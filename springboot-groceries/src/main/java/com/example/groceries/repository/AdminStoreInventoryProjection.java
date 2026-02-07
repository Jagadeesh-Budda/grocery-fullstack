package com.example.groceries.repository;

public interface AdminStoreInventoryProjection {
    Long getVariantId();
    String getVariantName();
    Long getProductId();
    String getProductName();
    Integer getStock();
    Integer getThreshold();
}
