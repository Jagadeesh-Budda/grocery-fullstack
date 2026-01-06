package com.example.groceries.service;

import com.example.groceries.controller.dto.CartSummaryResponse;
import com.example.groceries.controller.dto.CreateOrderRequest;
import com.example.groceries.controller.dto.OrderItemRequest;
import com.example.groceries.model.*;
import com.example.groceries.repository.CartItemRepository;
import com.example.groceries.repository.CartRepository;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderService orderService;

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public Cart addItemToCart(Long userId, Long variantId, Integer quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        Cart cart = getOrCreateCart(userId);
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        if (variant.getStock() != null && variant.getStock() < quantity) {
            throw new IllegalStateException("Insufficient stock for product: " + variant.getVariantName());
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductVariant().getId().equals(variantId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            if (variant.getStock() != null && variant.getStock() < newQuantity) {
                throw new IllegalStateException("Insufficient stock for product: " + variant.getVariantName());
            }
            item.setQuantity(newQuantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProductVariant(variant);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateQuantity(Long userId, Long variantId, Integer delta) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductVariant().getId().equals(variantId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        int newQuantity = item.getQuantity() + delta;
        if (newQuantity <= 0) {
            cart.getItems().remove(item);
        } else {
            ProductVariant variant = item.getProductVariant();
            if (delta > 0 && variant.getStock() != null && variant.getStock() < newQuantity) {
                throw new IllegalStateException("Insufficient stock for product: " + variant.getVariantName());
            }
            item.setQuantity(newQuantity);
        }

        return cartRepository.save(cart);
    }

    @Transactional(readOnly = true)
    public CartSummaryResponse getCartSummary(Long userId) {
        Cart cart = getOrCreateCart(userId);

        int itemCount = cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        BigDecimal totalAmount = cart.getItems().stream()
                .map(item -> {
                    BigDecimal price = item.getProductVariant().getPrice();
                    return price.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartSummaryResponse.builder()
                .itemCount(itemCount)
                .totalAmount(totalAmount)
                .build();
    }


    @Transactional
    public Order checkout(Long userId) {
        Cart cart = getOrCreateCart(userId);
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot checkout an empty cart");
        }

        List<OrderItemRequest> orderItems = cart.getItems().stream()
                .map(item -> OrderItemRequest.builder()
                        .variantId(item.getProductVariant().getId())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        CreateOrderRequest orderRequest = CreateOrderRequest.builder()
                .userId(userId)
                .items(orderItems)
                .build();

        Order order = orderService.createOrder(orderRequest);

        // Clear cart only after successful order creation
        cart.getItems().clear();
        cartRepository.save(cart);

        return order;
    }
}
