package vn.trungduc.graphql_product.controller;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import vn.trungduc.graphql_product.dto.ProductInput;
import vn.trungduc.graphql_product.entity.Product;
import vn.trungduc.graphql_product.service.ProductService;

import java.util.List;
import java.util.Optional;

@Controller
public class ProductGraphQLController {

    private final ProductService productService;

    public ProductGraphQLController(ProductService productService) {
        this.productService = productService;
    }

    // 1. Hiển thị tất cả product có price từ thấp đến cao (Yêu cầu bài tập)
    @QueryMapping
    public List<Product> productsByPriceAsc() {
        return productService.getProductsSortedByPriceAsc();
    }

    // 2. Lấy tất cả product của 01 category (Yêu cầu bài tập)
    @QueryMapping
    public List<Product> productsByCategory(@Argument Long categoryId) {
        return productService.getProductsByCategoryId(categoryId);
    }

    // Các query bổ trợ
    @QueryMapping
    public List<Product> products() {
        return productService.getAllProducts();
    }

    @QueryMapping
    public Optional<Product> productById(@Argument Long id) {
        return productService.getProductById(id);
    }

    // 3. CRUD bảng product (Yêu cầu bài tập)
    @MutationMapping
    public Product createProduct(@Argument ProductInput input) {
        return productService.createProduct(input);
    }

    @MutationMapping
    public Product updateProduct(@Argument Long id, @Argument ProductInput input) {
        return productService.updateProduct(id, input);
    }

    @MutationMapping
    public Boolean deleteProduct(@Argument Long id) {
        return productService.deleteProduct(id);
    }
}
