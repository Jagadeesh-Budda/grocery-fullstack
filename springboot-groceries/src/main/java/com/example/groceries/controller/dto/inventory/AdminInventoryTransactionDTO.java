package com.example.groceries.controller.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminInventoryTransactionDTO {
    private Long id;
    private LocalDateTime createdAt;
    private String type;

    private Long variantId;
    private String variantName;

    private Long productId;
    private String productName;

    private Long orderId;

    private Integer delta;
    private Integer stockBefore;
    private Integer stockAfter;

    private String actorUsername;
    private String reason;
}
