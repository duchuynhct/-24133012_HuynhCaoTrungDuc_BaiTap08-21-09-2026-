package vn.trungduc.graphql_product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.trungduc.graphql_product.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
