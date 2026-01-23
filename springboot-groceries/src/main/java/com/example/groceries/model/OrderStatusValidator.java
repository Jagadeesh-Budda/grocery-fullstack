package com.example.groceries.model;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public class OrderStatusValidator {

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_TRANSITIONS =
            new EnumMap<>(OrderStatus.class);

    static {
        // Order created
        ALLOWED_TRANSITIONS.put(
                OrderStatus.CREATED,
                EnumSet.of(OrderStatus.PENDING, OrderStatus.CANCELLED)
        );

        // Awaiting payment / confirmation
        ALLOWED_TRANSITIONS.put(
                OrderStatus.PENDING,
                EnumSet.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED)
        );

        // Order confirmed
        ALLOWED_TRANSITIONS.put(
                OrderStatus.CONFIRMED,
                EnumSet.of(OrderStatus.PACKED, OrderStatus.CANCELLED)
        );

        // Order packed
        ALLOWED_TRANSITIONS.put(
                OrderStatus.PACKED,
                EnumSet.of(OrderStatus.SHIPPED)
        );

        // Order shipped
        ALLOWED_TRANSITIONS.put(
                OrderStatus.SHIPPED,
                EnumSet.of(OrderStatus.DELIVERED)
        );

        // Final states
        ALLOWED_TRANSITIONS.put(
                OrderStatus.DELIVERED,
                EnumSet.noneOf(OrderStatus.class)
        );

        ALLOWED_TRANSITIONS.put(
                OrderStatus.CANCELLED,
                EnumSet.noneOf(OrderStatus.class)
        );
    }

    public static void validate(OrderStatus currentStatus, OrderStatus nextStatus) {

        if (currentStatus == nextStatus) {
            return; // no-op
        }

        Set<OrderStatus> allowedNextStatuses =
                ALLOWED_TRANSITIONS.getOrDefault(currentStatus, EnumSet.noneOf(OrderStatus.class));

        if (!allowedNextStatuses.contains(nextStatus)) {
            throw new IllegalStateException(
                    "Invalid status transition from " + currentStatus + " to " + nextStatus
            );
        }
    }
}
