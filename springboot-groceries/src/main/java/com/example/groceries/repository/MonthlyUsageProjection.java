package com.example.groceries.repository;

public interface MonthlyUsageProjection {
    Long getProductVariantId();

    Long getTotalQuantity();
}
