package com.example.groceries.model;

public enum OrderStatus {
    PENDING, // For backward compatibility
    CREATED,
    CONFIRMED,
    PACKED,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
