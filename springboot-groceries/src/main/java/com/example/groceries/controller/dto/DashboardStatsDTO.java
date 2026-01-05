package com.example.groceries.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalSales = 0L;
    private Double totalIncome = 0.0;
    private Long totalVisitors = 0L;
    private Double salesGrowthPercent = 0.0;
    private long totalProducts;
    private long totalCategories;
    private long totalUsers;
}