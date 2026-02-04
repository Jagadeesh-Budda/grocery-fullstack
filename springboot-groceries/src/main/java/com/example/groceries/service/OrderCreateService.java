package com.example.groceries.service;

import com.example.groceries.controller.dto.OrderCreateResponse;
import com.example.groceries.exception.OrderCreateErrorCode;
import com.example.groceries.exception.OrderCreateException;
import com.example.groceries.model.*;
import com.example.groceries.repository.CartRepository;
import com.example.groceries.repository.OrderRepository;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrderCreateService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderRepository orderRepository;

    /**
     * Creates an order ONLY from server-side cart + variant data.
     * Assumption: userId currently arrives from the frontend; later it should come from session/auth.
     */
    @Transactional
    public OrderCreateResponse createOrderSafely(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new OrderCreateException(
                        OrderCreateErrorCode.EMPTY_CART,
                        "Cart is empty"
                ));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new OrderCreateException(OrderCreateErrorCode.EMPTY_CART, "Cart is empty");
        }

        User user = userRepository.findById(userId)
                // Assumption: cart should not exist without a valid user; if it does, treat as not found.
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CREATED);
        order.setCreatedAt(LocalDateTime.now());
        order.setTotalAmount(BigDecimal.ZERO);

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Long variantId = cartItem.getProductVariant() != null ? cartItem.getProductVariant().getId() : null;
            Integer quantity = cartItem.getQuantity();

            if (variantId == null || quantity == null || quantity < 1) {
                // Assumption: cart data is DB-backed and validated elsewhere; reject if inconsistent.
                throw new IllegalStateException("Invalid cart item detected");
            }

            // Always reload from DB to avoid trusting cart-attached/stale price/discount data.
            ProductVariant variant = productVariantRepository.findById(variantId)
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            Integer stock = variant.getStock();
            if (stock == null || stock < quantity) {
                throw new OrderCreateException(
                        OrderCreateErrorCode.OUT_OF_STOCK,
                        "Out of stock for variantId=" + variantId
                );
            }

            // Backend price calculation only (mrp - discount%).
            BigDecimal unitPrice = variant.getPrice();

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));

            OrderItem orderItem = new OrderItem();
            orderItem.setVariant(variant);
            orderItem.setProductId(variant.getProductMaster().getId());
            orderItem.setProductName(variant.getProductMaster().getName());
            orderItem.setVariantName(variant.getVariantName());
            orderItem.setQuantity(quantity);
            orderItem.setPrice(unitPrice);
            orderItem.setSubtotal(lineTotal);
            order.addOrderItem(orderItem);

            total = total.add(lineTotal);
        }

        order.setTotalAmount(total);

        // Important: DO NOT reduce stock here. Stock reduction happens only when status becomes CONFIRMED.
        Order saved = orderRepository.save(order);

        return OrderCreateResponse.builder()
                .orderId(saved.getId())
                .totalAmount(saved.getTotalAmount())
                .status(saved.getStatus())
                .build();
    }
}
