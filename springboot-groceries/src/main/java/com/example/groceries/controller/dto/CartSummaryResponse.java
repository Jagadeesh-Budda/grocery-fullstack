package com.example.groceries.controller.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartSummaryResponse {
    private Integer itemCount;
    private BigDecimal totalAmount;
}
