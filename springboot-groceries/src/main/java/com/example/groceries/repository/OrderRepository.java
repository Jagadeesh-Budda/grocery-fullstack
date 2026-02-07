package com.example.groceries.repository;

import com.example.groceries.model.Order;
import com.example.groceries.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    long countByCreatedAtGreaterThanEqual(LocalDateTime since);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN :statuses")
    BigDecimal sumTotalAmountByStatusIn(@Param("statuses") Collection<OrderStatus> statuses);

        @Query("""
                        SELECT
                            o.id as orderId,
                            u.email as userEmail,
                            o.totalAmount as totalAmount,
                            o.status as status,
                            o.createdAt as createdAt,
                            COUNT(oi.id) as itemsCount
                        FROM Order o
                        JOIN o.user u
                        LEFT JOIN o.orderItems oi
                        WHERE (:status IS NULL OR o.status = :status)
                            AND (:orderId IS NULL OR o.id = :orderId)
                            AND (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))
                        GROUP BY o.id, u.email, o.totalAmount, o.status, o.createdAt
                        """)
        Page<AdminOrderSummaryProjection> findAdminOrderSummaries(
                        @Param("status") OrderStatus status,
                        @Param("orderId") Long orderId,
                        @Param("email") String email,
                        Pageable pageable
        );
}
