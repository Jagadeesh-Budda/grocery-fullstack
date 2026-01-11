package com.example.groceries.controller.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupedProductDTO {
    private Long id;
    private String name;
    private Boolean active;
    private BigDecimal displayPrice;
    private List<ProductVariantDTO> variants;
}