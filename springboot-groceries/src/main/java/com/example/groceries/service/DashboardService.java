package com.example.groceries.service;

import com.example.groceries.controller.dto.DashboardStatsDTO;
import com.example.groceries.repository.CategoryRepository;
import com.example.groceries.repository.OrderRepository;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.repository.UserRepository;
import com.example.groceries.model.OrderStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.EnumSet;

@Service
public class DashboardService {

    private final ProductMasterRepository productMasterRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final Clock clock;

    public DashboardService(
            ProductMasterRepository productMasterRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            OrderRepository orderRepository,
            ProductVariantRepository productVariantRepository,
            Clock clock
    ) {
        this.productMasterRepository = productMasterRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productVariantRepository = productVariantRepository;
        this.clock = clock;
    }

    public DashboardStatsDTO getDashboardStats() {
        long totalProducts = productMasterRepository.count();
        long totalCategories = categoryRepository.count();
        long totalUsers = userRepository.count();

        long totalOrders = orderRepository.count();
        LocalDateTime startOfToday = LocalDate.now(clock).atStartOfDay();
        long todayOrders = orderRepository.countByCreatedAtGreaterThanEqual(startOfToday);

        EnumSet<OrderStatus> revenueStatuses = EnumSet.of(
                OrderStatus.CONFIRMED,
                OrderStatus.PACKED,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED
        );
        BigDecimal totalRevenue = orderRepository.sumTotalAmountByStatusIn(revenueStatuses);
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        long lowStockCount = productVariantRepository.countLowStockVariants();

        DashboardStatsDTO dto = new DashboardStatsDTO();
        dto.setTotalProducts(totalProducts);
        dto.setTotalCategories(totalCategories);
        dto.setTotalUsers(totalUsers);

        dto.setTotalOrders(totalOrders);
        dto.setTodayOrders(todayOrders);
        dto.setTotalRevenue(totalRevenue);
        dto.setLowStockCount(lowStockCount);

        // Backward compatibility with existing Admin UI cards.
        dto.setTotalSales(totalOrders);
        dto.setTotalIncome(totalRevenue.doubleValue());
        dto.setTotalVisitors(todayOrders);
        dto.setSalesGrowthPercent(0.0);

        return dto;
    }
}

