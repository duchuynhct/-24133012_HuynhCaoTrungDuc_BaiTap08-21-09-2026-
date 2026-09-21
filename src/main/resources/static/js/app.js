// GraphQL Endpoint
const GRAPHQL_URL = '/graphql';

// Trạng thái hiện tại
let currentCategoryFilter = '';
let currentSortPriceAsc = false;
let categoryList = [];

// Hàm gửi request AJAX tới GraphQL API
async function fetchGraphQL(query, variables = {}) {
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query, variables })
        });

        const result = await response.json();
        if (result.errors && result.errors.length > 0) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error(result.errors[0].message || 'Lỗi khi gọi GraphQL API');
        }
        return result.data;
    } catch (error) {
        console.error('Network/GraphQL Error:', error);
        alert('Lỗi: ' + error.message);
        throw error;
    }
}

// Định dạng tiền tệ VNĐ
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// ==========================================
// 1. QUẢN LÝ SẢN PHẨM (PRODUCTS)
// ==========================================

// Tải danh sách sản phẩm theo bộ lọc hoặc sắp xếp
async function loadProducts() {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><div class="mt-2 text-muted">Đang tải dữ liệu sản phẩm qua GraphQL...</div></td></tr>`;

    let query = '';
    let variables = {};

    if (currentSortPriceAsc) {
        // Yêu cầu 1: Hiển thị tất cả product có price từ thấp đến cao
        query = `
            query GetProductsSortedByPrice {
                productsByPriceAsc {
                    id
                    title
                    quantity
                    description
                    desc
                    price
                    category {
                        id
                        name
                    }
                    user {
                        id
                        fullname
                    }
                }
            }
        `;
    } else if (currentCategoryFilter) {
        // Yêu cầu 2: Lấy tất cả product của 01 category
        query = `
            query GetProductsByCategory($categoryId: ID!) {
                productsByCategory(categoryId: $categoryId) {
                    id
                    title
                    quantity
                    description
                    desc
                    price
                    category {
                        id
                        name
                    }
                    user {
                        id
                        fullname
                    }
                }
            }
        `;
        variables = { categoryId: currentCategoryFilter };
    } else {
        // Mặc định: Lấy tất cả sản phẩm
        query = `
            query GetAllProducts {
                products {
                    id
                    title
                    quantity
                    description
                    desc
                    price
                    category {
                        id
                        name
                    }
                    user {
                        id
                        fullname
                    }
                }
            }
        `;
    }

    try {
        const data = await fetchGraphQL(query, variables);
        const products = data.productsByPriceAsc || data.productsByCategory || data.products || [];

        if (products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">Không có sản phẩm nào phù hợp.</td></tr>`;
            return;
        }

        tbody.innerHTML = products.map((p, index) => `
            <tr>
                <td class="fw-bold text-secondary text-center">${p.id}</td>
                <td class="fw-semibold text-primary">${escapeHtml(p.title)}</td>
                <td class="text-muted small">${escapeHtml(p.description || p.desc || 'Chưa có mô tả')}</td>
                <td class="text-center"><span class="badge bg-secondary">${p.quantity ?? 0}</span></td>
                <td><span class="badge-price">${formatCurrency(p.price)}</span></td>
                <td><span class="badge bg-info text-dark">${p.category ? escapeHtml(p.category.name) : 'Chưa phân loại'}</span></td>
                <td><span class="small text-muted">${p.user ? escapeHtml(p.user.fullname) : 'Hệ thống'}</span></td>
                <td class="text-center">
                    <button class="btn btn-outline-primary btn-sm action-btn me-1" onclick="editProduct(${p.id})">
                        <i class="bi bi-pencil"></i> Sửa
                    </button>
                    <button class="btn btn-outline-danger btn-sm action-btn" onclick="deleteProduct(${p.id}, '${escapeHtml(p.title)}')">
                        <i class="bi bi-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger py-4">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
    }
}

// Mở modal thêm sản phẩm mới
function openAddProductModal() {
    document.getElementById('productModalTitle').innerText = 'Thêm sản phẩm mới';
    document.getElementById('productId').value = '';
    document.getElementById('productForm').reset();
    populateCategorySelect('productCategory');
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Mở modal sửa sản phẩm
async function editProduct(id) {
    try {
        const query = `
            query GetProductById($id: ID!) {
                productById(id: $id) {
                    id
                    title
                    quantity
                    description
                    desc
                    price
                    category {
                        id
                    }
                }
            }
        `;
        const data = await fetchGraphQL(query, { id });
        const p = data.productById;
        if (!p) {
            alert('Không tìm thấy sản phẩm');
            return;
        }

        document.getElementById('productModalTitle').innerText = 'Cập nhật sản phẩm #' + p.id;
        document.getElementById('productId').value = p.id;
        document.getElementById('productTitle').value = p.title || '';
        document.getElementById('productQuantity').value = p.quantity ?? 0;
        document.getElementById('productPrice').value = p.price ?? 0;
        document.getElementById('productDescription').value = p.description || p.desc || '';
        
        populateCategorySelect('productCategory', p.category ? p.category.id : '');

        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
    }
}

// Lưu sản phẩm (Create hoặc Update thông qua GraphQL Mutation)
async function saveProduct(event) {
    event.preventDefault();
    const id = document.getElementById('productId').value;
    const title = document.getElementById('productTitle').value.trim();
    const quantity = parseInt(document.getElementById('productQuantity').value) || 0;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const description = document.getElementById('productDescription').value.trim();
    const categoryId = document.getElementById('productCategory').value;

    const input = {
        title,
        quantity,
        price,
        description,
        desc: description,
        categoryId: categoryId ? categoryId : null
    };

    try {
        if (id) {
            // Mutation Update Product
            const mutation = `
                mutation UpdateProduct($id: ID!, $input: ProductInput!) {
                    updateProduct(id: $id, input: $input) {
                        id
                        title
                    }
                }
            `;
            await fetchGraphQL(mutation, { id, input });
        } else {
            // Mutation Create Product
            const mutation = `
                mutation CreateProduct($input: ProductInput!) {
                    createProduct(input: $input) {
                        id
                        title
                    }
                }
            `;
            await fetchGraphQL(mutation, { input });
        }

        // Đóng modal và tải lại bảng
        const modalElement = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();

        loadProducts();
    } catch (error) {
        console.error('Lỗi lưu sản phẩm:', error);
    }
}

// Xóa sản phẩm qua GraphQL Mutation
async function deleteProduct(id, title) {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${title}" (ID: ${id})?`)) {
        return;
    }

    try {
        const mutation = `
            mutation DeleteProduct($id: ID!) {
                deleteProduct(id: $id)
            }
        `;
        const data = await fetchGraphQL(mutation, { id });
        if (data.deleteProduct) {
            loadProducts();
        } else {
            alert('Không thể xóa sản phẩm.');
        }
    } catch (error) {
        console.error('Lỗi xóa sản phẩm:', error);
    }
}

// ==========================================
// 2. QUẢN LÝ DANH MỤC (CATEGORIES)
// ==========================================

// Tải danh sách danh mục qua GraphQL
async function loadCategories() {
    const tbody = document.getElementById('categoryTableBody');
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary" role="status"></div></td></tr>`;

    const query = `
        query GetAllCategories {
            categories {
                id
                name
                images
                products {
                    id
                }
            }
        }
    `;

    try {
        const data = await fetchGraphQL(query);
        categoryList = data.categories || [];

        // Cập nhật dropdown filter ở tab sản phẩm
        updateCategoryFilterDropdown();

        if (categoryList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">Chưa có danh mục nào.</td></tr>`;
            return;
        }

        tbody.innerHTML = categoryList.map(c => `
            <tr>
                <td class="fw-bold text-secondary text-center">${c.id}</td>
                <td class="text-center">
                    ${c.images ? `<img src="${escapeHtml(c.images)}" class="thumbnail-img" onerror="this.src='https://placehold.co/48x48?text=No+Img'">` : '<span class="text-muted small">Không có ảnh</span>'}
                </td>
                <td class="fw-semibold text-dark">${escapeHtml(c.name)}</td>
                <td class="text-center"><span class="badge bg-primary">${c.products ? c.products.length : 0} sản phẩm</span></td>
                <td class="text-center">
                    <button class="btn btn-outline-primary btn-sm action-btn me-1" onclick="editCategory(${c.id})">
                        <i class="bi bi-pencil"></i> Sửa
                    </button>
                    <button class="btn btn-outline-danger btn-sm action-btn" onclick="deleteCategory(${c.id}, '${escapeHtml(c.name)}')">
                        <i class="bi bi-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Lỗi: ${error.message}</td></tr>`;
    }
}

// Cập nhật dropdown bộ lọc danh mục
function updateCategoryFilterDropdown() {
    const select = document.getElementById('categoryFilterSelect');
    if (!select) return;

    select.innerHTML = `<option value="">-- Tất cả danh mục --</option>` +
        categoryList.map(c => `<option value="${c.id}" ${currentCategoryFilter == c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
}

// Điền options vào select danh mục của form sản phẩm
function populateCategorySelect(elementId, selectedId = '') {
    const select = document.getElementById(elementId);
    if (!select) return;

    select.innerHTML = `<option value="">-- Chọn danh mục --</option>` +
        categoryList.map(c => `<option value="${c.id}" ${selectedId == c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
}

// Mở modal thêm danh mục mới
function openAddCategoryModal() {
    document.getElementById('categoryModalTitle').innerText = 'Thêm danh mục mới';
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

// Mở modal sửa danh mục
async function editCategory(id) {
    try {
        const query = `
            query GetCategoryById($id: ID!) {
                categoryById(id: $id) {
                    id
                    name
                    images
                }
            }
        `;
        const data = await fetchGraphQL(query, { id });
        const c = data.categoryById;
        if (!c) {
            alert('Không tìm thấy danh mục');
            return;
        }

        document.getElementById('categoryModalTitle').innerText = 'Cập nhật danh mục #' + c.id;
        document.getElementById('categoryId').value = c.id;
        document.getElementById('categoryName').value = c.name || '';
        document.getElementById('categoryImages').value = c.images || '';

        const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        modal.show();
    } catch (error) {
        console.error('Lỗi tải danh mục:', error);
    }
}

// Lưu danh mục (Create hoặc Update thông qua GraphQL Mutation)
async function saveCategory(event) {
    event.preventDefault();
    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value.trim();
    const images = document.getElementById('categoryImages').value.trim();

    const input = { name, images };

    try {
        if (id) {
            const mutation = `
                mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
                    updateCategory(id: $id, input: $input) {
                        id
                        name
                    }
                }
            `;
            await fetchGraphQL(mutation, { id, input });
        } else {
            const mutation = `
                mutation CreateCategory($input: CategoryInput!) {
                    createCategory(input: $input) {
                        id
                        name
                    }
                }
            `;
            await fetchGraphQL(mutation, { input });
        }

        const modalElement = document.getElementById('categoryModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();

        loadCategories();
        loadProducts();
    } catch (error) {
        console.error('Lỗi lưu danh mục:', error);
    }
}

// Xóa danh mục qua GraphQL Mutation
async function deleteCategory(id, name) {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${name}"? Tất cả sản phẩm thuộc danh mục này cũng sẽ bị xóa!`)) {
        return;
    }

    try {
        const mutation = `
            mutation DeleteCategory($id: ID!) {
                deleteCategory(id: $id)
            }
        `;
        const data = await fetchGraphQL(mutation, { id });
        if (data.deleteCategory) {
            loadCategories();
            loadProducts();
        } else {
            alert('Không thể xóa danh mục.');
        }
    } catch (error) {
        console.error('Lỗi xóa danh mục:', error);
    }
}

// Tiện ích escape HTML tránh XSS
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ==========================================
// 3. KHỞI TẠO SỰ KIỆN KHI TẢI TRANG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Tải dữ liệu ban đầu
    loadCategories();
    loadProducts();

    // Sự kiện lọc theo Category
    const filterSelect = document.getElementById('categoryFilterSelect');
    filterSelect.addEventListener('change', (e) => {
        currentCategoryFilter = e.target.value;
        currentSortPriceAsc = false; // Bỏ sort nếu đang lọc
        document.getElementById('sortPriceBtn').classList.remove('btn-success');
        document.getElementById('sortPriceBtn').classList.add('btn-outline-secondary');
        document.getElementById('sortPriceBtn').innerHTML = `<i class="bi bi-sort-numeric-down"></i> Sắp xếp giá tăng dần`;
        loadProducts();
    });

    // Sự kiện nút Sắp xếp theo giá từ thấp đến cao (Yêu cầu 1)
    const sortBtn = document.getElementById('sortPriceBtn');
    sortBtn.addEventListener('click', () => {
        currentSortPriceAsc = !currentSortPriceAsc;
        currentCategoryFilter = ''; // Reset filter danh mục khi sort toàn bộ
        filterSelect.value = '';

        if (currentSortPriceAsc) {
            sortBtn.classList.remove('btn-outline-secondary');
            sortBtn.classList.add('btn-success');
            sortBtn.innerHTML = `<i class="bi bi-check-circle-fill"></i> Đang lọc: Giá thấp -> cao`;
        } else {
            sortBtn.classList.remove('btn-success');
            sortBtn.classList.add('btn-outline-secondary');
            sortBtn.innerHTML = `<i class="bi bi-sort-numeric-down"></i> Sắp xếp giá tăng dần`;
        }
        loadProducts();
    });

    // Sự kiện submit form
    document.getElementById('productForm').addEventListener('submit', saveProduct);
    document.getElementById('categoryForm').addEventListener('submit', saveCategory);
});
