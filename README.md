# BÀI TẬP 08: SPRING BOOT GRAPHQL & AJAX

* **Trường**: Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh (HCM-UTE)
* **Khoa**: Công nghệ Thông tin - Bộ môn Công nghệ Phần mềm
* **Môn học**: Lập trình Web (WEBPR330479)
* **Họ và tên**: Huỳnh Cao Trung Đức
* **MSSV**: 24133012
* **Repository**: [https://github.com/duchuynhct/-24133012_HuynhCaoTrungDuc_BaiTap08-21-09-2026-](https://github.com/duchuynhct/-24133012_HuynhCaoTrungDuc_BaiTap08-21-09-2026-)

---

## 1. Yêu cầu đề bài

Xây dựng ứng dụng Spring Boot sử dụng **GraphQL API** và **AJAX** trên trang giao diện HTML kết nối với hệ quản trị CSDL **Microsoft SQL Server**:
* Cơ sở dữ liệu gồm các bảng:
  * `Category(id, name, images)`
  * `User(id, fullname, email, password, phone)`
  * `Product(id, title, quantity, desc, price, userid)`
* Mối quan hệ:
  * `Category` $\leftrightarrow$ `User`: Quan hệ **Nhiều - Nhiều** (`@ManyToMany` qua bảng trung gian `category_user`).
  * `Category` $\rightarrow$ `Product`: Quan hệ **Một - Nhiều** (`@OneToMany` / `@ManyToOne`).
  * `User` $\rightarrow$ `Product`: Quan hệ **Một - Nhiều** (`@OneToMany` / `@ManyToOne` qua `userid`).
* Xây dựng GraphQL API cho các tính năng:
  * **Yêu cầu 1**: Hiển thị tất cả `Product` có `price` từ thấp đến cao (sắp xếp tăng dần).
  * **Yêu cầu 2**: Lấy tất cả `Product` của 01 `Category`.
  * **Yêu cầu 3**: Đầy đủ thao tác **CRUD** cho bảng `Product` và `Category`.
* **Giao diện**: Sử dụng **AJAX** để gọi GraphQL endpoint (`/graphql`) và render động lên view `.html`.

---

## 2. Công nghệ sử dụng

* **Ngôn ngữ & Nền tảng**: Java 21, Spring Boot 3.3.x (Spring Boot 4.x Compatible)
* **API Architecture**: GraphQL (Spring for GraphQL, GraphiQL)
* **ORM & CSDL**: Spring Data JPA, Hibernate, Microsoft SQL Server (`mssql-jdbc`)
* **Thư viện hỗ trợ**: Project Lombok, Spring Boot DevTools
* **Giao diện Frontend**: HTML5, Bootstrap 5.3, Bootstrap Icons, JavaScript AJAX (Fetch API)

---

## 3. Cấu trúc thư mục dự án

```text
-24133012_HuynhCaoTrungDuc_BaiTap08-21-09-2026-/
├── pom.xml                                           # Khai báo dependencies Maven
├── README.md                                         # Báo cáo và hướng dẫn chi tiết
└── src/
    └── main/
        ├── java/vn/trungduc/graphql_product/
        │   ├── GraphqlProductApplication.java       # Main class chạy ứng dụng Spring Boot
        │   ├── config/
        │   │   └── DataInitializer.java             # Seeder tự động sinh dữ liệu mẫu vào SQL Server
        │   ├── entity/                               # Các thực thể JPA & ánh xạ quan hệ
        │   │   ├── Category.java                     # Bảng categories (ManyToMany User, OneToMany Product)
        │   │   ├── User.java                         # Bảng users (ManyToMany Category, OneToMany Product)
        │   │   └── Product.java                      # Bảng products (ManyToOne Category & User)
        │   ├── repository/                           # Tầng giao tiếp CSDL (Spring Data JPA)
        │   │   ├── CategoryRepository.java
        │   │   ├── UserRepository.java
        │   │   └── ProductRepository.java           # Phương thức sắp xếp giá ASC, lọc category
        │   ├── service/                              # Tầng xử lý nghiệp vụ
        │   │   ├── CategoryService.java & impl/CategoryServiceImpl.java
        │   │   └── ProductService.java & impl/ProductServiceImpl.java
        │   ├── controller/                           # Tầng GraphQL Controller
        │   │   ├── CategoryGraphQLController.java   # @QueryMapping & @MutationMapping Category
        │   │   ├── ProductGraphQLController.java    # @QueryMapping & @MutationMapping Product
        │   │   └── UserGraphQLController.java       # @QueryMapping User
        │   └── dto/                                  # Input DTOs nhận dữ liệu từ client
        │       ├── CategoryInput.java
        │       └── ProductInput.java
        └── resources/
            ├── application.properties                # Cấu hình SQL Server & GraphiQL
            ├── graphql/
            │   └── schema.graphqls                   # Định nghĩa toàn bộ Schema GraphQL
            └── static/                               # Giao diện Web động AJAX
                ├── index.html                        # Giao diện người dùng Bootstrap 5
                ├── css/style.css                     # Định kiểu giao diện hiện đại
                └── js/app.js                         # Xử lý AJAX gọi GraphQL API và render động
```

---

## 4. Hướng dẫn cài đặt và chạy ứng dụng

### 4.1. Chuẩn bị Cơ sở dữ liệu SQL Server
Mở SQL Server Management Studio (SSMS) và chạy lệnh:
```sql
CREATE DATABASE GraphQL_ProductDB;
GO
```

### 4.2. Cấu hình kết nối (Nếu tài khoản khác `sa`/`123456`)
Mở file `src/main/resources/application.properties` để điều chỉnh tài khoản/mật khẩu nếu cần:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=GraphQL_ProductDB;encrypt=true;trustServerCertificate=true;
spring.datasource.username=sa
spring.datasource.password=123456
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
```

### 4.3. Khởi chạy ứng dụng
Mở Terminal tại thư mục gốc của dự án và chạy lệnh:
```bash
mvn spring-boot:run
```
Ứng dụng sẽ khởi động tại cổng `8080` và lớp `DataInitializer` sẽ tự động sinh dữ liệu mẫu phong phú vào SQL Server.

---

## 5. Hướng dẫn sử dụng & Kiểm thử chức năng

### 5.1. Sử dụng Giao diện Web (AJAX)
Truy cập trình duyệt tại địa chỉ:
👉 **[http://localhost:8080/](http://localhost:8080/)**

* **Chức năng 1 - Sắp xếp giá tăng dần**: Bấm vào nút `Sắp xếp giá tăng dần`. Bảng dữ liệu sẽ được AJAX làm mới, hiển thị sản phẩm theo giá từ thấp đến cao (Xiaomi 19.9tr $\rightarrow$ Dell XPS 32tr).
* **Chức năng 2 - Lọc sản phẩm theo danh mục**: Chọn danh mục trong ô dropdown `Tất cả danh mục` (ví dụ chọn *Điện thoại*). Bảng sẽ cập nhật ngay các sản phẩm thuộc danh mục được chọn.
* **Chức năng 3 - CRUD Sản phẩm**:
  * **Thêm mới**: Bấm `Thêm sản phẩm mới`, nhập thông tin và bấm `Lưu lại`.
  * **Cập nhật**: Bấm nút `Sửa` trên dòng sản phẩm, chỉnh sửa và lưu lại.
  * **Xóa**: Bấm nút `Xóa` và xác nhận.
* **Chức năng 4 - CRUD Danh mục**: Chuyển sang tab `Quản lý Danh mục (Categories)` để thêm, sửa, xóa danh mục.

---

### 5.2. Kiểm thử API qua GraphiQL Playground
Truy cập công cụ GraphiQL tích hợp tại:
👉 **[http://localhost:8080/graphiql](http://localhost:8080/graphiql)**

#### Query 1: Hiển thị sản phẩm sắp xếp giá từ thấp đến cao (ASC)
```graphql
query {
  productsByPriceAsc {
    id
    title
    price
    quantity
    description
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
```

#### Query 2: Lấy tất cả sản phẩm của 01 danh mục (Ví dụ categoryId = 1)
```graphql
query {
  productsByCategory(categoryId: 1) {
    id
    title
    price
    quantity
    category {
      name
    }
  }
}
```

#### Mutation 1: Thêm mới sản phẩm (Create Product)
```graphql
mutation {
  createProduct(input: {
    title: "Tai nghe Sony WH-1000XM5"
    quantity: 10
    price: 7990000
    description: "Chống ồn đỉnh cao, âm thanh Hi-Res"
    categoryId: 1
  }) {
    id
    title
    price
  }
}
```

#### Mutation 2: Cập nhật sản phẩm (Update Product)
```graphql
mutation {
  updateProduct(id: 1, input: {
    title: "Xiaomi 14 Ultra (Bản quốc tế)"
    quantity: 12
    price: 20500000
    description: "Camera Leica nâng cấp firmware mới"
  }) {
    id
    title
    price
  }
}
```

#### Mutation 3: Xóa sản phẩm (Delete Product)
```graphql
mutation {
  deleteProduct(id: 6)
}
```

#### Mutation 4: Thêm mới danh mục (Create Category)
```graphql
mutation {
  createCategory(input: {
    name: "Phụ kiện thông minh"
    images: "smart-accessories.jpg"
  }) {
    id
    name
  }
}
```

---

## 6. Lịch sử phân nhánh Git và Pull Requests

Quy trình phát triển dự án được chia làm 6 giai đoạn nghiêm ngặt với các Pull Request riêng biệt:

| Giai đoạn | Branch | Nội dung | Pull Request |
| :---: | :--- | :--- | :---: |
| **Phase 1** | `feat/phase1-init-project-sqlserver` | Khởi tạo Spring Boot, cấu hình SQL Server & GraphiQL | [PR #1](https://github.com/duchuynhct/-24133012_HuynhCaoTrungDuc_BaiTap08-21-09-2026-/pull/1) |
| **Phase 2** | `feat/phase2-jpa-entities-erd` | Thiết kế Entity Category, User, Product & DataSeeder | [PR #2](https://github.com/duchuynhct/-24133012_HuynhCaoTrungDuc_BaiTap08-21-09-2026-/pull/2) |
| **Phase 3** | `feat/phase3-repositories-services` | Xây dựng Service Layer, CRUD & sắp xếp giá tăng dần | [PR #3](https://github.com/duchuynhct/-24133012_HuynhCaoTrungDuc_BaiTap08-21-09-2026-/pull/3) |
| **Phase 4** | `feat/phase4-graphql-api` | Thiết kế Schema GraphQL & xây dựng GraphQL Controllers | [PR #4](https://github.com/duchuynhct/-24133012_HuynhCaoTrungDuc_BaiTap08-21-09-2026-/pull/4) |
| **Phase 5** | `feat/phase5-web-ui-ajax` | Xây dựng Giao diện Web động bằng AJAX không reload | [PR #5](https://github.com/duchuynhct/-24133012_HuynhCaoTrungDuc_BaiTap08-21-09-2026-/pull/5) |
| **Phase 6** | `feat/phase6-testing-docs` | Hoàn thiện tài liệu README.md và nghiệm thu toàn diện | [PR #6](https://github.com/duchuynhct/-24133012_HuynhCaoTrungDuc_BaiTap08-21-09-2026-/pull/6) |
