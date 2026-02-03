package com.example.groceries.controller.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LowStockDTO {
    private Long productVariantId;
    private Integer stock;
    private Integer threshold;
}
