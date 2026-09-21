package vn.trungduc.graphql_product.service;

import vn.trungduc.graphql_product.dto.CategoryInput;
import vn.trungduc.graphql_product.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> getAllCategories();
    Optional<Category> getCategoryById(Long id);
    Category createCategory(CategoryInput input);
    Category updateCategory(Long id, CategoryInput input);
    boolean deleteCategory(Long id);
}
