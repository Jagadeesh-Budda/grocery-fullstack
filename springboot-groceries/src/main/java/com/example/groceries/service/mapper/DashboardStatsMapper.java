package com.example.groceries.service.mapper;

import com.example.groceries.controller.dto.DashboardStatsDTO;
import com.example.groceries.model.DashboardStats;

public class DashboardStatsMapper {

    public static DashboardStatsDTO toDTO(DashboardStats model) {
        if (model == null) {
            return null;
        }
        DashboardStatsDTO dto = new DashboardStatsDTO();
        dto.setTotalSales(model.getTotalSales());
        dto.setTotalIncome(model.getTotalIncome());
        dto.setTotalVisitors(model.getTotalVisitors());
        dto.setSalesGrowthPercent(model.getSalesGrowthPercent());
        return dto;
    }

    public static DashboardStats toModel(DashboardStatsDTO dto) {
        if (dto == null) {
            return null;
        }
        DashboardStats model = new DashboardStats();
        model.setTotalSales(dto.getTotalSales());
        model.setTotalIncome(dto.getTotalIncome());
        model.setTotalVisitors(dto.getTotalVisitors());
        model.setSalesGrowthPercent(dto.getSalesGrowthPercent());
        return model;
    }
}
