package com.example.groceries.service;

import com.example.groceries.controller.dto.dashboard.BuyAgainDTO;
import com.example.groceries.controller.dto.dashboard.HomeDashboardDTO;
import com.example.groceries.controller.dto.dashboard.LowStockDTO;
import com.example.groceries.controller.dto.dashboard.MonthlyStockDTO;
import com.example.groceries.repository.BuyAgainProjection;
import com.example.groceries.repository.HomeDashboardRepository;
import com.example.groceries.repository.LowStockProjection;
import com.example.groceries.repository.MonthlyUsageProjection;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Composes a single Home Dashboard read model from repository-level aggregations.
 *
 * Why this service exists:
 * - keeps aggregation logic centralized in repositories (no duplication)
 * - returns stable, projection-backed read DTOs without loading entities
 * - injects time via {@link Clock} for deterministic tests and reproducible windows
 */
@Service

@Transactional(readOnly = true)
public class HomeDashboardService {
    private final HomeDashboardRepository homeDashboardRepository;
    private final Clock clock;
    public HomeDashboardService(HomeDashboardRepository homeDashboardRepository, Clock clock) {
        this.homeDashboardRepository = homeDashboardRepository;
        this.clock = clock;
    }

    /**
     * Uses the repository aggregate query for the last 30 days and maps directly to DTOs.
     */

    public List<MonthlyStockDTO> monthlyStock(Long userId) {
        LocalDateTime since = LocalDateTime.now(clock).minusDays(30);

        List<MonthlyUsageProjection> rows = homeDashboardRepository.findMonthlyUsage(userId, since);
        if (rows == null || rows.isEmpty()) {
            return List.of();
        }

        return rows.stream()
                .map(r -> new MonthlyStockDTO(r.getProductVariantId(), r.getTotalQuantity()))
                .toList();
    }

    /**
     * Delegates to the repository (limit + ordering are enforced in the query) and maps to DTOs.
     */

    public List<BuyAgainDTO> buyAgainTop3(Long userId) {
        List<BuyAgainProjection> rows = homeDashboardRepository.findTop3BuyAgain(userId);
        if (rows == null || rows.isEmpty()) {
            return List.of();
        }

        return rows.stream()
                .map(r -> new BuyAgainDTO(r.getProductVariantId(), r.getOrderCount(), r.getLastOrderedAt()))
                .toList();
    }

    /**
     * Delegates to the repository and maps to DTOs only.
     *
     * The userId parameter is part of the service contract for consistent composition; the
     * current aggregate query is global.
     */

    public List<LowStockDTO> lowStock(Long userId) {
        // userId is kept for a stable service contract; current low-stock query is global.
        @SuppressWarnings("unused") Long ignored = userId;

        List<LowStockProjection> rows = homeDashboardRepository.findLowStock();
        if (rows == null || rows.isEmpty()) {
            return List.of();
        }

        return rows.stream()
                .map(r -> new LowStockDTO(r.getProductVariantId(), r.getStock(), r.getThreshold()))
                .toList();
    }

    /**
     * Composes the dashboard from the three read models; returns empty lists instead of nulls.
     */

    public HomeDashboardDTO getDashboard(Long userId) {
        return new HomeDashboardDTO(
                monthlyStock(userId),
                buyAgainTop3(userId),
                lowStock(userId)
        );
    }
}
