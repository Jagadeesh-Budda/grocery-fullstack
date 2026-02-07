package com.example.groceries.controller;

import com.example.groceries.controller.dto.OrderCreateResponse;
import com.example.groceries.controller.dto.OrderSummaryResponse;
import com.example.groceries.model.Order;
import com.example.groceries.service.OrderCreateService;
import com.example.groceries.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.util.Objects;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;
    private final OrderCreateService orderCreateService;

    @PostMapping
    public ResponseEntity<OrderCreateResponse> createOrder(
            HttpSession session,
            @RequestParam(name = "couponCode", required = false) String couponCode
    ) {
        // Assumption: userId is stored in server-side session post-login.
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (couponCode == null || couponCode.isBlank()) {
            return ResponseEntity.ok(orderCreateService.createOrderSafely(userId));
        }

        return ResponseEntity.ok(orderCreateService.createOrderSafely(userId, couponCode));
    }

    @GetMapping("/me")
    public ResponseEntity<List<OrderSummaryResponse>> getMyOrders(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<OrderSummaryResponse> orders = orderService.getOrdersByUser(userId)
                .stream()
                .filter(Objects::nonNull)
                .map(OrderController::toOrderSummaryResponse)
                .toList();

        return ResponseEntity.ok(orders);
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderSummaryResponse> cancelOrder(@PathVariable Long orderId) {
        Order cancelled = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(toOrderSummaryResponse(cancelled));
    }

    private static OrderSummaryResponse toOrderSummaryResponse(Order order) {
        if (order == null) {
            return null;
        }

        return OrderSummaryResponse.builder()
                .orderId(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }

    @GetMapping
    public String health() {
        return "Orders API is running";
    }
}
