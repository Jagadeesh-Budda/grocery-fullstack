package com.example.groceries.controller.dto;

import java.math.BigDecimal;
import lombok.Builder;



@Builder

public record CartItemResponse(
        Long Id,
        String productName,
        String variantName,
        Integer quantity,
        BigDecimal price,
        String imageUrl
) {}
