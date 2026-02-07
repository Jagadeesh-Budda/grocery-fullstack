package com.example.groceries.repository;

import com.example.groceries.model.OrderItem;
import com.example.groceries.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Read-only aggregate queries used by the Home Dashboard.
 *
 * Notes on performance:
 * - Monthly usage / buy-again filter by user + status + createdAt, so indexes on
 *   (orders.user_id, orders.status, orders.created_at) and
 *   (order_items.order_id, order_items.variant_id) are recommended.
 * - All queries return projections (no entity graphs) to avoid N+1.
 */
@Repository
public interface HomeDashboardRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Monthly usage (last 30 days, or any caller-supplied window).
     * Business meaning: total quantity consumed per product variant.
     */
    @Query("""
        SELECT
            oi.variant.id AS productVariantId,
            SUM(oi.quantity) AS totalQuantity
        FROM OrderItem oi
        JOIN oi.order o
        WHERE o.user.id = :userId
          AND o.createdAt >= :since
          AND o.status IN (:completedStatuses)
        GROUP BY oi.variant.id
        ORDER BY SUM(oi.quantity) DESC, oi.variant.id ASC
    """)
    List<MonthlyUsageProjection> findMonthlyUsage(
            @Param("userId") Long userId,
            @Param("since") LocalDateTime since,
            @Param("completedStatuses") List<OrderStatus> completedStatuses
    );

    /**
     * Overload using the dashboard definition of "completed": CONFIRMED and DELIVERED.
     */
    default List<MonthlyUsageProjection> findMonthlyUsage(Long userId, LocalDateTime since) {
        return findMonthlyUsage(userId, since, List.of(OrderStatus.CONFIRMED, OrderStatus.DELIVERED));
    }

    /**
     * Buy Again – Top 3 variants per user.
     *
     * Rules:
     * - User-specific
     * - Completed orders only
     * - Rank by COUNT(order items) DESC, then MAX(order.createdAt) DESC
     * - Exclude variants where stock = 0
     * - Limit 3
     *
     * We use a native query for deterministic limiting (LIMIT 3) across H2.
     */
    @Query(
            value = """
                SELECT
                    oi.product_variant_id AS productVariantId,
                    COUNT(oi.id) AS orderCount,
                    MAX(o.created_at) AS lastOrderedAt
                FROM order_items oi
                JOIN orders o ON o.id = oi.order_id
                JOIN product_variants v ON v.id = oi.product_variant_id
                WHERE o.user_id = :userId
                  AND o.status IN ('CONFIRMED','DELIVERED')
                  AND v.stock > 0
                GROUP BY oi.product_variant_id
                ORDER BY COUNT(oi.id) DESC, MAX(o.created_at) DESC, oi.product_variant_id ASC
                LIMIT 3
            """,
            nativeQuery = true
    )
    List<BuyAgainProjection> findTop3BuyAgain(@Param("userId") Long userId);

    /**
     * Low Stock Detection.
     *
     * Rule (per spec): stock <= productMaster.lowStockThreshold and productMaster.active = true.
     *
     * NOTE: this codebase's ProductMaster entity currently doesn't expose a lowStockThreshold field.
     * To keep this repository queryable and testable without changing production domain code,
     * we join to the column directly in SQL. This assumes the DB schema has
     * product_masters.low_stock_threshold.
     */
    @Query(
            value = """
                SELECT
                    v.id AS productVariantId,
                    v.stock AS stock,
                    pm.low_stock_threshold AS threshold
                FROM product_variants v
                JOIN products pm ON pm.id = v.product_master_id
                WHERE pm.is_active = true
                  AND v.stock <= pm.low_stock_threshold
                ORDER BY v.id ASC
            """,
            nativeQuery = true
    )
    List<LowStockProjection> findLowStock();
}
