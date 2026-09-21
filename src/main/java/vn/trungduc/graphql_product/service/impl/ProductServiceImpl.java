package vn.trungduc.graphql_product.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.trungduc.graphql_product.dto.ProductInput;
import vn.trungduc.graphql_product.entity.Category;
import vn.trungduc.graphql_product.entity.Product;
import vn.trungduc.graphql_product.entity.User;
import vn.trungduc.graphql_product.repository.CategoryRepository;
import vn.trungduc.graphql_product.repository.ProductRepository;
import vn.trungduc.graphql_product.repository.UserRepository;
import vn.trungduc.graphql_product.service.ProductService;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              UserRepository userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsSortedByPriceAsc() {
        return productRepository.findAllByOrderByPriceAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryIdOrderByPriceAsc(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product createProduct(ProductInput input) {
        Category category = null;
        if (input.getCategoryId() != null) {
            category = categoryRepository.findById(input.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + input.getCategoryId()));
        }

        User user = null;
        if (input.getUserId() != null) {
            user = userRepository.findById(input.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + input.getUserId()));
        } else {
            // Gán mặc định user đầu tiên nếu không truyền
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }

        Product product = Product.builder()
                .title(input.getTitle())
                .quantity(input.getQuantity())
                .description(input.getDescription())
                .price(input.getPrice())
                .category(category)
                .user(user)
                .build();

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, ProductInput input) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setTitle(input.getTitle());
        product.setQuantity(input.getQuantity());
        product.setDescription(input.getDescription());
        product.setPrice(input.getPrice());

        if (input.getCategoryId() != null) {
            Category category = categoryRepository.findById(input.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + input.getCategoryId()));
            product.setCategory(category);
        }

        if (input.getUserId() != null) {
            User user = userRepository.findById(input.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + input.getUserId()));
            product.setUser(user);
        }

        return productRepository.save(product);
    }

    @Override
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
