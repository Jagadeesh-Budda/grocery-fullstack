package com.example.groceries.controller.dto;

public class DashboardStatsDTO {
    private Long totalSales;
    private Double totalIncome;
    private Long totalVisitors;
    private Double salesGrowthPercent;

    public Long getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Long totalSales) {
        this.totalSales = totalSales;
    }

    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Long getTotalVisitors() {
        return totalVisitors;
    }

    public void setTotalVisitors(Long totalVisitors) {
        this.totalVisitors = totalVisitors;
    }

    public Double getSalesGrowthPercent() {
        return salesGrowthPercent;
    }

    public void setSalesGrowthPercent(Double salesGrowthPercent) {
        this.salesGrowthPercent = salesGrowthPercent;
    }
}
