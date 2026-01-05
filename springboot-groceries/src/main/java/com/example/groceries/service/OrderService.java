package com.example.groceries.service;

import com.example.groceries.controller.dto.CreateOrderRequest;
import com.example.groceries.controller.dto.OrderItemRequest;
import com.example.groceries.model.*;
import com.example.groceries.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setTotalAmount(BigDecimal.ZERO);

        // Save order before OrderItem creation as requested
        order = orderRepository.save(order);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
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

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}
