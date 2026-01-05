package com.example.groceries.service.mapper;

import com.example.groceries.controller.dto.DashboardStatsDTO;
import com.example.groceries.model.DashboardStats;
import org.springframework.stereotype.Component;

@Component
public class DashboardStatsMapper {

    public DashboardStatsDTO toDTO(DashboardStats model) {
        if (model == null) return null;

        DashboardStatsDTO dto = new DashboardStatsDTO();
        dto.setTotalSales(model.getTotalSales());
        dto.setTotalIncome(model.getTotalIncome());
        dto.setTotalVisitors(model.getTotalVisitors());
        dto.setSalesGrowthPercent(model.getSalesGrowthPercent());
        // These fields are usually calculated in the Service, not just mapped
        return dto;
    }
}