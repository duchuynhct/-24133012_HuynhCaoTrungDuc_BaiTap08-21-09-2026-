package vn.trungduc.graphql_product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.trungduc.graphql_product.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByPriceAsc();

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByCategoryIdOrderByPriceAsc(Long categoryId);
}
