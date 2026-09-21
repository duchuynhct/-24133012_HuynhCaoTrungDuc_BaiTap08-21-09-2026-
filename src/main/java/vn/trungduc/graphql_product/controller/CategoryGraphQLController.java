package vn.trungduc.graphql_product.controller;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import vn.trungduc.graphql_product.dto.CategoryInput;
import vn.trungduc.graphql_product.entity.Category;
import vn.trungduc.graphql_product.service.CategoryService;

import java.util.List;
import java.util.Optional;

@Controller
public class CategoryGraphQLController {

    private final CategoryService categoryService;

    public CategoryGraphQLController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @QueryMapping
    public List<Category> categories() {
        return categoryService.getAllCategories();
    }

    @QueryMapping
    public Optional<Category> categoryById(@Argument Long id) {
        return categoryService.getCategoryById(id);
    }

    @MutationMapping
    public Category createCategory(@Argument CategoryInput input) {
        return categoryService.createCategory(input);
    }

    @MutationMapping
    public Category updateCategory(@Argument Long id, @Argument CategoryInput input) {
        return categoryService.updateCategory(id, input);
    }

    @MutationMapping
    public Boolean deleteCategory(@Argument Long id) {
        return categoryService.deleteCategory(id);
    }
}
