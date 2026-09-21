package vn.trungduc.graphql_product.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.trungduc.graphql_product.entity.Category;
import vn.trungduc.graphql_product.entity.Product;
import vn.trungduc.graphql_product.entity.User;
import vn.trungduc.graphql_product.repository.CategoryRepository;
import vn.trungduc.graphql_product.repository.ProductRepository;
import vn.trungduc.graphql_product.repository.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public DataInitializer(CategoryRepository categoryRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (categoryRepository.count() == 0 && productRepository.count() == 0) {
            // 1. Tạo Users
            User user1 = User.builder()
                    .fullname("Nguyễn Văn An")
                    .email("an.nguyen@example.com")
                    .password("123456")
                    .phone("0901234567")
                    .build();

            User user2 = User.builder()
                    .fullname("Trần Thị Bình")
                    .email("binh.tran@example.com")
                    .password("123456")
                    .phone("0912345678")
                    .build();

            userRepository.saveAll(List.of(user1, user2));

            // 2. Tạo Categories
            Category catPhones = Category.builder()
                    .name("Điện thoại")
                    .images("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300")
                    .build();

            Category catLaptops = Category.builder()
                    .name("Laptop")
                    .images("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300")
                    .build();

            Category catTablets = Category.builder()
                    .name("Máy tính bảng")
                    .images("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300")
                    .build();

            categoryRepository.saveAll(List.of(catPhones, catLaptops, catTablets));

            // 3. Thiết lập quan hệ nhiều-nhiều (User <-> Category)
            user1.setCategories(new HashSet<>(Set.of(catPhones, catLaptops)));
            user2.setCategories(new HashSet<>(Set.of(catLaptops, catTablets)));
            userRepository.saveAll(List.of(user1, user2));

            // 4. Tạo Products
            Product p1 = Product.builder()
                    .title("Xiaomi 14 Ultra")
                    .quantity(8)
                    .description("Camera Leica, Snapdragon 8 Gen 3, 512GB")
                    .price(19990000.0)
                    .category(catPhones)
                    .user(user2)
                    .build();

            Product p2 = Product.builder()
                    .title("MacBook Air M2")
                    .quantity(12)
                    .description("Apple M2 8-core CPU 8GB 256GB")
                    .price(24500000.0)
                    .category(catLaptops)
                    .user(user2)
                    .build();

            Product p3 = Product.builder()
                    .title("Samsung Galaxy S24 Ultra")
                    .quantity(15)
                    .description("Snapdragon 8 Gen 3, 12GB RAM, 512GB")
                    .price(26500000.0)
                    .category(catPhones)
                    .user(user1)
                    .build();

            Product p4 = Product.builder()
                    .title("iPad Pro M4")
                    .quantity(7)
                    .description("OLED Ultra Retina XDR, Apple M4, 256GB")
                    .price(27900000.0)
                    .category(catTablets)
                    .user(user2)
                    .build();

            Product p5 = Product.builder()
                    .title("iPhone 15 Pro Max")
                    .quantity(10)
                    .description("Khung Titan, chip A17 Pro, 256GB")
                    .price(28990000.0)
                    .category(catPhones)
                    .user(user1)
                    .build();

            Product p6 = Product.builder()
                    .title("Dell XPS 13 Plus")
                    .quantity(5)
                    .description("Intel Core i7-1360P, 16GB RAM, 512GB SSD")
                    .price(32000000.0)
                    .category(catLaptops)
                    .user(user1)
                    .build();

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6));

            System.out.println(">>> [DataInitializer] Đã khởi tạo dữ liệu mẫu thành công vào SQL Server!");
        }
    }
}
