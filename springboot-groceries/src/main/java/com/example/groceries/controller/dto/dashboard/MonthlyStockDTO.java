package com.example.groceries.controller.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStockDTO {
    private Long productVariantId;
    private Long monthlyUsage;
}
