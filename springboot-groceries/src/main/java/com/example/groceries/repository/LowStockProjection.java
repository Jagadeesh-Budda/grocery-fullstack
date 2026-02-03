package com.example.groceries.repository;

public interface LowStockProjection {
    Long getProductVariantId();

    Integer getStock();

    Integer getThreshold();
}
