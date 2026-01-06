package com.example.groceries.controller.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String imageUrl;
    private List<String> images;
    private List<ProductVariantDTO> variants;
}
