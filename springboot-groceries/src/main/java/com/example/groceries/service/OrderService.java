package com.example.groceries.service;

import com.example.groceries.controller.dto.CreateOrderRequest;
import com.example.groceries.controller.dto.OrderItemRequest;
import com.example.groceries.model.*;
import com.example.groceries.repository.*;
import com.example.groceries.audit.AdminAuditMutation;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryTransactionService inventoryTransactionService;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must have at least one item");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CREATED);
        order.setCreatedAt(LocalDateTime.now());
        order.setSubtotalAmount(BigDecimal.ZERO);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setTotalAmount(BigDecimal.ZERO);

        // Save order before OrderItem creation as requested
        order = orderRepository.save(order);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            if (itemReq.getVariantId() == null) {
                throw new IllegalArgumentException("Variant ID is required");
            }
            if (itemReq.getQuantity() == null || itemReq.getQuantity() < 1) {
                throw new IllegalArgumentException("Quantity must be at least 1");
            }

            ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            BigDecimal itemTotal = variant.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setVariant(variant);
            orderItem.setProductId(variant.getProductMaster().getId());
            orderItem.setProductName(variant.getProductMaster().getName());
            orderItem.setVariantName(variant.getVariantName());
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(variant.getPrice());
            orderItem.setSubtotal(itemTotal);
            // Relationship is set inside addOrderItem helper
            order.addOrderItem(orderItem);

            total = total.add(itemTotal);
        }

        order.setSubtotalAmount(total);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);
        log.info("Order created: orderId={}, status={}", savedOrder.getId(), savedOrder.getStatus());
        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
        @AdminAuditMutation(
            entity = "Order",
            entityClass = Order.class,
            entityIdBefore = "#orderId",
            entityIdAfter = "#orderId",
            operation = AdminAuditMutation.Operation.UPDATE
        )
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus oldStatus = order.getStatus();
        if (oldStatus == newStatus) {
            return order;
        }

        OrderStatusValidator.validate(oldStatus, newStatus);

        // Stock handling
        if (newStatus == OrderStatus.CONFIRMED && oldStatus != OrderStatus.CONFIRMED) {
            reduceStockForOrder(order);
        } else if (newStatus == OrderStatus.CANCELLED && (oldStatus == OrderStatus.CONFIRMED || oldStatus == OrderStatus.SHIPPED)) {
            // Note: If CANCELLED from CREATED, stock wasn't reduced yet (assuming reduction happens on CONFIRMED)
            // But let's check if we should reduce on CREATED instead. 
            // Usually stock is blocked/reduced when order is placed or confirmed.
            // In this implementation, let's assume CONFIRMED is the trigger for stock reduction.
            restoreStockForOrder(order);
        }

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        log.info("Order status changed: orderId={}, oldStatus={}, newStatus={}", orderId, oldStatus, newStatus);
        return updatedOrder;
    }

    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus oldStatus = order.getStatus();
        if (oldStatus == OrderStatus.CANCELLED) {
            return order;
        }

        if (oldStatus != OrderStatus.CREATED && oldStatus != OrderStatus.CONFIRMED && oldStatus != OrderStatus.SHIPPED) {
            throw new IllegalStateException("Order cannot be cancelled in " + oldStatus + " status");
        }

        // Restore stock if it was already reduced
        if (oldStatus == OrderStatus.CONFIRMED || oldStatus == OrderStatus.SHIPPED) {
            restoreStockForOrder(order);
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        log.info("Order status changed: orderId={}, oldStatus={}, newStatus={}", orderId, oldStatus, OrderStatus.CANCELLED);
        return updatedOrder;
    }

    private void reduceStockForOrder(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getVariant();
            if (variant.getStock() != null) {
                if (variant.getStock() < item.getQuantity()) {
                    throw new IllegalStateException("Insufficient stock for product: " + variant.getVariantName());
                }
                int before = variant.getStock();
                int after = before - item.getQuantity();
                variant.setStock(after);
                productVariantRepository.save(variant);

                Long variantId = variant.getId();
                if (variantId != null) {
                    inventoryTransactionService.record(
                            InventoryTransactionType.ORDER_CONFIRMED,
                            variantId,
                            order.getId(),
                            -item.getQuantity(),
                            before,
                            after,
                            null
                    );
                }
            }
        }
    }

    private void restoreStockForOrder(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getVariant();
            if (variant.getStock() != null) {
                int before = variant.getStock();
                int after = before + item.getQuantity();
                variant.setStock(after);
                productVariantRepository.save(variant);

                Long variantId = variant.getId();
                if (variantId != null) {
                    inventoryTransactionService.record(
                            InventoryTransactionType.ORDER_CANCELLED,
                            variantId,
                            order.getId(),
                            item.getQuantity(),
                            before,
                            after,
                            null
                    );
                }
            }
        }
    }
}
