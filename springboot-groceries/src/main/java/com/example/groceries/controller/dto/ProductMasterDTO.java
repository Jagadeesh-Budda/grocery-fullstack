package com.example.groceries.controller.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductMasterDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private List<String> images;
    private Boolean active;
    private Integer lowStockThreshold;
    private Long categoryId;
    private String categoryName;
    private List<ProductVariantDTO> variants;
}