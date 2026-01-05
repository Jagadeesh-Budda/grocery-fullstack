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
    private String description;
    private String imageUrl;
    private Boolean active;
    private Long categoryId;
    private List<ProductVariantDTO> variants;
}