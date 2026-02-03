package com.example.groceries.controller.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProductDTO {
    private Long productId;
    private Long variantId;
    private String productName;
    private String category;
    private String unit;
    private Integer stock;
    private BigDecimal mrp;
    private Integer discountPercent;
    private BigDecimal price;
    private String imageUrl;
}