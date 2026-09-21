package vn.trungduc.graphql_product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInput {
    private String title;
    private Integer quantity;
    private String description;
    private Double price;
    private Long categoryId;
    private Long userId;
}
