package com.example.groceries.service;

import com.example.groceries.controller.dto.DashboardStatsDTO;
import com.example.groceries.repository.CategoryRepository;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.UserRepository;
import org.springframework.stereotype.Service;


@Service
public class DashboardService {

    private final ProductMasterRepository productMasterRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public DashboardService(
            ProductMasterRepository productMasterRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.productMasterRepository = productMasterRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        long products = productMasterRepository.count();
        long categories = categoryRepository.count();
        long users = userRepository.count();

        return new DashboardStatsDTO();
    }
}

