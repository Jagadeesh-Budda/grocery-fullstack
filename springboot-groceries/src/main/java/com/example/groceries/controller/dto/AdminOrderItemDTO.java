package com.example.groceries.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderItemDTO {
    private Long id;
    private String productName;
    private String variantName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}
