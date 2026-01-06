package com.example.groceries.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class OrderStatusTest {

    @Test
    void shouldHandlePendingForBackwardCompatibility() {
        OrderStatus status = OrderStatus.valueOf("PENDING");
        assertEquals(OrderStatus.PENDING, status);
    }

    @Test
    void shouldHandleCreatedForNewOrders() {
        OrderStatus status = OrderStatus.valueOf("CREATED");
        assertEquals(OrderStatus.CREATED, status);
    }
}
