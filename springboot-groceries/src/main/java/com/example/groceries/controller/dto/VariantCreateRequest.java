package com.example.groceries.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariantCreateRequest {
    private String variantName;
    private String unit;
    private BigDecimal mrp;
    private Integer discountPercent;
    private String imageUrl;
    private Integer stock;
}
