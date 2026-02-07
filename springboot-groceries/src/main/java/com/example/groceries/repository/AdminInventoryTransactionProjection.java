package com.example.groceries.repository;

import java.time.LocalDateTime;

public interface AdminInventoryTransactionProjection {
    Long getId();

    LocalDateTime getCreatedAt();

    String getType();

    Long getVariantId();

    String getVariantName();

    Long getProductId();

    String getProductName();

    Long getOrderId();

    Integer getDelta();

    Integer getStockBefore();

    Integer getStockAfter();

    String getActorUsername();

    String getReason();
}
