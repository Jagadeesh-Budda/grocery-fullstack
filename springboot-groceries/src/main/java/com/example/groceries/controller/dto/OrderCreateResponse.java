package com.example.groceries.controller.dto;

import com.example.groceries.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateResponse {
    private Long orderId;
    private BigDecimal subtotalAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String couponCode;
    private OrderStatus status;
}
