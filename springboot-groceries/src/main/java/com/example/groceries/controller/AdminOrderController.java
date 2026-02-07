package com.example.groceries.controller;

import com.example.groceries.controller.dto.AdminOrderDetailDTO;
import com.example.groceries.controller.dto.AdminOrderSummaryDTO;
import com.example.groceries.model.Order;
import com.example.groceries.model.OrderStatus;
import com.example.groceries.service.AdminOrderService;
import com.example.groceries.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Slf4j
public class AdminOrderController {

    private final OrderService orderService;
    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<Page<AdminOrderSummaryDTO>> listOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String q
    ) {
        log.info("admin={} action=listOrders status={} q={} page={} size={}", currentUsername(), status, q, page, size);
        return ResponseEntity.ok(adminOrderService.listOrders(page, size, status, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminOrderDetailDTO> getOrder(@PathVariable Long id) {
        log.info("admin={} action=getOrder orderId={}", currentUsername(), id);
        return ResponseEntity.ok(adminOrderService.getOrder(id));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestBody OrderStatus status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        log.info("admin={} action=updateOrderStatus orderId={} newStatus={}", currentUsername(), orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    private String currentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return "anonymous";
        }
        return authentication.getName();
    }
}
