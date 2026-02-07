package com.example.groceries.controller.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminLowStockInventoryItemDTO {
    private Long variantId;
    private String variantName;
    private Long productId;
    private String productName;
    private Integer stock;
    private Integer threshold;
}
