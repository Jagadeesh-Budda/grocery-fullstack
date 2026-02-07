package com.example.groceries.repository;

public interface AdminLowStockInventoryProjection {
    Long getVariantId();

    String getVariantName();

    Long getProductId();

    String getProductName();

    Integer getStock();

    Integer getThreshold();
}
