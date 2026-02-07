package com.example.groceries.repository;

import com.example.groceries.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface AdminOrderSummaryProjection {
    Long getOrderId();

    String getUserEmail();

    BigDecimal getTotalAmount();

    OrderStatus getStatus();

    LocalDateTime getCreatedAt();

    Long getItemsCount();
}
