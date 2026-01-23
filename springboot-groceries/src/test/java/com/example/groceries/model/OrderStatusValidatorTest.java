package com.example.groceries.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class OrderStatusValidatorTest {

    @Test
    void validateTransition_ValidTransitions_ShouldNotThrowException() {

        // CREATED
        assertDoesNotThrow(() ->
                OrderStatusValidator.validate(OrderStatus.CREATED, OrderStatus.PENDING)
        );
        assertDoesNotThrow(() ->
                OrderStatusValidator.validate(OrderStatus.CREATED, OrderStatus.CANCELLED)
        );

        // PENDING
        assertDoesNotThrow(() ->
                OrderStatusValidator.validate(OrderStatus.PENDING, OrderStatus.CONFIRMED)
        );
        assertDoesNotThrow(() ->
                OrderStatusValidator.validate(OrderStatus.PENDING, OrderStatus.CANCELLED)
        );

        // CONFIRMED
        assertDoesNotThrow(() ->
                OrderStatusValidator.validate(OrderStatus.CONFIRMED, OrderStatus.PACKED)
        );
        assertDoesNotThrow(() ->
                OrderStatusValidator.validate(OrderStatus.CONFIRMED, OrderStatus.CANCELLED)
        );

        // PACKED
        assertDoesNotThrow(() ->
                OrderStatusValidator.validate(OrderStatus.PACKED, OrderStatus.SHIPPED)
        );

        // SHIPPED
        assertDoesNotThrow(() ->
                OrderStatusValidator.validate(OrderStatus.SHIPPED, OrderStatus.DELIVERED)
        );
    }


    @Test
    void validateTransition_InvalidTransitions_ShouldThrowIllegalStateException() {
        assertThrows(IllegalStateException.class, () -> OrderStatusValidator.validate(OrderStatus.CREATED, OrderStatus.SHIPPED));
        assertThrows(IllegalStateException.class, () -> OrderStatusValidator.validate(OrderStatus.PACKED, OrderStatus.DELIVERED));
        assertThrows(IllegalStateException.class, () -> OrderStatusValidator.validate(OrderStatus.DELIVERED, OrderStatus.CREATED));
        assertThrows(IllegalStateException.class, () -> OrderStatusValidator.validate(OrderStatus.CANCELLED, OrderStatus.CREATED));
    }

    @Test
    void validateTransition_SameStatus_ShouldNotThrowException() {
        assertDoesNotThrow(() -> OrderStatusValidator.validate(OrderStatus.CREATED, OrderStatus.CREATED));
        assertDoesNotThrow(() -> OrderStatusValidator.validate(OrderStatus.SHIPPED, OrderStatus.SHIPPED));
    }
}
