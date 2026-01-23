package com.example.groceries.service;

import com.example.groceries.controller.dto.CartItemRequest;
import com.example.groceries.controller.dto.CartItemResponse;
import com.example.groceries.controller.dto.CartSummaryResponse;
import com.example.groceries.model.*;
import com.example.groceries.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    /* ======================
       CORE CART
       ====================== */

    public Cart getOrCreateCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Cart c = new Cart();
                    c.setUser(user);
                    c.setItems(new ArrayList<>());
                    return cartRepository.save(c);
                });

        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }
        return cart;
    }

    /* ======================
       ADD ITEM
       ====================== */

    public Cart addItem(Long userId, Long variantId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);

        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        int qty = quantity != null && quantity > 0 ? quantity : 1;

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductVariant().getId().equals(variantId))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + qty);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProductVariant(variant);
            item.setQuantity(qty);
            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    /* ======================
       UPDATE QUANTITY
       ====================== */

    public Cart updateQuantity(Long userId, Long variantId, Integer delta) {
        Cart cart = getOrCreateCart(userId);

        cart.getItems().removeIf(item -> {
            if (item.getProductVariant().getId().equals(variantId)) {
                int newQty = item.getQuantity() + delta;
                if (newQty <= 0) return true;
                item.setQuantity(newQty);
            }
            return false;
        });

        return cartRepository.save(cart);
    }

    /* ======================
       MERGE CART
       ====================== */

    public Cart mergeCart(Long userId, List<CartItemRequest> items) {
        Cart cart = getOrCreateCart(userId);

        if (items == null || items.isEmpty()) return cart;

        for (CartItemRequest req : items) {
            ProductVariant variant = productVariantRepository.findById(req.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            int qty = req.getQuantity() != null && req.getQuantity() > 0 ? req.getQuantity() : 1;

            Optional<CartItem> existing = cart.getItems().stream()
                    .filter(i -> i.getProductVariant().getId().equals(req.getVariantId()))
                    .findFirst();

            if (existing.isPresent()) {
                existing.get().setQuantity(existing.get().getQuantity() + qty);
            } else {
                CartItem item = new CartItem();
                item.setCart(cart);
                item.setProductVariant(variant);
                item.setQuantity(qty);
                cart.getItems().add(item);
            }
        }

        return cartRepository.save(cart);
    }

    /* ======================
       DTO SAFE METHODS
       ====================== */

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(Long userId) {
        return toResponse(getOrCreateCart(userId));
    }

    public List<CartItemResponse> addItemAndReturn(Long userId, Long variantId, Integer quantity) {
        return toResponse(addItem(userId, variantId, quantity));
    }

    public List<CartItemResponse> updateQuantityAndReturn(Long userId, Long variantId, Integer delta) {
        return toResponse(updateQuantity(userId, variantId, delta));
    }

    public List<CartItemResponse> mergeAndReturn(Long userId, List<CartItemRequest> items) {
        return toResponse(mergeCart(userId, items));
    }

    /* ======================
       SUMMARY
       ====================== */

    @Transactional(readOnly = true)
    public CartSummaryResponse getSummary(Long userId) {
        Cart cart = getOrCreateCart(userId);

        BigDecimal total = BigDecimal.ZERO;
        int count = 0;

        for (CartItem item : cart.getItems()) {
            total = total.add(
                    item.getProductVariant().getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()))
            );
            count += item.getQuantity();
        }

        return new CartSummaryResponse(count, total);
    }

    /* ======================
       MAPPER
       ====================== */

    public List<CartItemResponse> toResponse(Cart cart) {
        List<CartItemResponse> response = new ArrayList<>();

        for (CartItem item : cart.getItems()) {
            ProductVariant v = item.getProductVariant();

            response.add(
                    CartItemResponse.builder()
                            .Id(v.getId())
                            .productName(v.getProductMaster().getName())
                            .variantName(v.getVariantName())
                            .quantity(item.getQuantity())
                            .price(v.getPrice())
                            .imageUrl(v.getImageUrl())
                            .build()
            );

        }
        return response;
    }
}
