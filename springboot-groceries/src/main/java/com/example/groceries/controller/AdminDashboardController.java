package com.example.groceries.controller;

import com.example.groceries.controller.dto.DashboardStatsDTO;
import com.example.groceries.repository.CategoryRepository;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminDashboardController {

    private final ProductMasterRepository productMasterRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public AdminDashboardController(
            ProductMasterRepository productMasterRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.productMasterRepository = productMasterRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public DashboardStatsDTO getStats() {
        DashboardStatsDTO dto = new DashboardStatsDTO();

        dto.setTotalSales(productMasterRepository.count());     // temp meaning: products count
        dto.setTotalIncome(0.0);                          // until orders exist
        dto.setTotalVisitors(userRepository.count());     // users count
        dto.setSalesGrowthPercent(0.0);                   // placeholder

        return dto;
    }
}
