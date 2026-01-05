package com.example.groceries.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Long totalSales;
    private Double totalIncome;
    private Long totalVisitors;
    private Double salesGrowthPercent;
}
