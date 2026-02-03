package com.example.groceries.repository;

import java.time.LocalDateTime;

public interface BuyAgainProjection {
    Long getProductVariantId();

    Long getOrderCount();

    LocalDateTime getLastOrderedAt();
}
