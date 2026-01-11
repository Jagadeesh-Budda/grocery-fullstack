package com.example.groceries.controller;

import com.example.groceries.controller.dto.CartSummaryResponse;
import com.example.groceries.model.Cart;
import com.example.groceries.model.Order;
import com.example.groceries.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getOrCreateCart(userId));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<Cart> addItem(@PathVariable Long userId, 
                                        @RequestParam Long variantId, 
                                        @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.ok(cartService.addItemToCart(userId, variantId, quantity));
    }

    @PutMapping("/{userId}/update")
    public ResponseEntity<Cart> updateQuantity(@PathVariable Long userId, 
                                               @RequestParam Long variantId, 
                                               @RequestParam Integer delta) {
        return ResponseEntity.ok(cartService.updateQuantity(userId, variantId, delta));
    }

    @GetMapping("/{userId}/summary")
    public ResponseEntity<CartSummaryResponse> getSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartSummary(userId));
    }

    @PostMapping("/{userId}/checkout")
    public ResponseEntity<Long> checkout(@PathVariable Long userId) {
        Order order = cartService.checkout(userId);
        return ResponseEntity.ok(order.getId());
    }
}
