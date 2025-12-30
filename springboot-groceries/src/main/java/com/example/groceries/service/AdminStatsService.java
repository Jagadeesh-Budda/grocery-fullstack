package com.example.groceries.service;

import com.example.groceries.controller.dto.DashboardStatsDTO;
import com.example.groceries.repository.CategoryRepository;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminStatsService {

    private final ProductMasterRepository productMasterRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public AdminStatsService(ProductMasterRepository productMasterRepository, 
                             CategoryRepository categoryRepository, 
                             UserRepository userRepository) {
        this.productMasterRepository = productMasterRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalSales(productMasterRepository.count());
        stats.setTotalIncome((double) categoryRepository.count());
        stats.setTotalVisitors(userRepository.count());
        stats.setSalesGrowthPercent(0.0);
        return stats;
    }
}
