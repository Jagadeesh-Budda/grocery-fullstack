package com.example.groceries.controller.dto.store;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStoreInventoryItemDTO {
    private Long variantId;
    private String variantName;
    private Long productId;
    private String productName;
    private Integer stock;
    private Integer threshold;
}
