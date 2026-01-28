package com.example.groceries.controller;

import com.example.groceries.controller.dto.CartItemRequest;
import com.example.groceries.controller.dto.CartItemResponse;
import com.example.groceries.controller.dto.CartSummaryResponse;
import com.example.groceries.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItemResponse>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<List<CartItemResponse>> addItem(
            @PathVariable Long userId,
            @RequestParam Long variantId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.ok(
                cartService.addItemAndReturn(userId, variantId, quantity)
        );
    }

    @PutMapping("/{userId}/update")
    public ResponseEntity<List<CartItemResponse>> updateQuantity(
            @PathVariable Long userId,
            @RequestParam Long variantId,
            @RequestParam Integer delta) {
        return ResponseEntity.ok(
                cartService.updateQuantityAndReturn(userId, variantId, delta)
        );
    }

    @PostMapping("/{userId}/merge")
    public ResponseEntity<List<CartItemResponse>> mergeCart(
            @PathVariable Long userId,
            @RequestBody List<CartItemRequest> items) {
        return ResponseEntity.ok(
                cartService.mergeAndReturn(userId, items)
        );
    }

    @GetMapping("/{userId}/summary")
    public ResponseEntity<CartSummaryResponse> summary(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getSummary(userId));
    }
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCartByUserId(userId);
        return ResponseEntity.noContent().build();
    }

}
