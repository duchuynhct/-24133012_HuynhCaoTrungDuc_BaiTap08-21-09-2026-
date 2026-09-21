package vn.trungduc.graphql_product.service;

import vn.trungduc.graphql_product.dto.ProductInput;
import vn.trungduc.graphql_product.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAllProducts();
    List<Product> getProductsSortedByPriceAsc();
    List<Product> getProductsByCategoryId(Long categoryId);
    Optional<Product> getProductById(Long id);
    Product createProduct(ProductInput input);
    Product updateProduct(Long id, ProductInput input);
    boolean deleteProduct(Long id);
}
