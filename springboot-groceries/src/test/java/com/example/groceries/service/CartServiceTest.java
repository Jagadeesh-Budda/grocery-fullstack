package com.example.groceries.service;

import com.example.groceries.controller.dto.CartSummaryResponse;
import com.example.groceries.model.*;
import com.example.groceries.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Cart cart;
    private ProductVariant variant;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);

        cart = new Cart();
        cart.setId(1L);
        cart.setUser(user);
        cart.setItems(new ArrayList<>());

        variant = new ProductVariant();
        variant.setId(1L);
        variant.setMrp(BigDecimal.valueOf(100));
        variant.setMrp(BigDecimal.valueOf(100)); // ✅ IMPORTANT
        variant.setVariantName("1kg");

        ProductMaster master = new ProductMaster();
        master.setName("Rice");
        variant.setProductMaster(master);
    }


    /* ======================
       ADD ITEM
       ====================== */

    @Test
    void addItem_NewItem_ShouldAdd() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findById(1L)).thenReturn(Optional.of(variant));
        when(cartRepository.save(any())).thenReturn(cart);

        cartService.addItem(1L, 1L, 2);

        assertEquals(1, cart.getItems().size());
        assertEquals(2, cart.getItems().get(0).getQuantity());
        assertEquals(variant, cart.getItems().get(0).getProductVariant());
    }

    @Test
    void addItem_ExistingItem_ShouldIncreaseQuantity() {
        CartItem existing = new CartItem();
        existing.setCart(cart);
        existing.setProductVariant(variant);
        existing.setQuantity(1);
        cart.getItems().add(existing);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findById(1L)).thenReturn(Optional.of(variant));
        when(cartRepository.save(any())).thenReturn(cart);

        cartService.addItem(1L, 1L, 2);

        assertEquals(1, cart.getItems().size());
        assertEquals(3, cart.getItems().get(0).getQuantity());
    }

    /* ======================
       UPDATE QUANTITY
       ====================== */

    @Test
    void updateQuantity_PositiveDelta_ShouldUpdate() {
        CartItem item = new CartItem();
        item.setProductVariant(variant);
        item.setQuantity(2);
        cart.getItems().add(item);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any())).thenReturn(cart);

        cartService.updateQuantity(1L, 1L, 1);

        assertEquals(3, cart.getItems().get(0).getQuantity());
    }

    @Test
    void updateQuantity_NegativeToZero_ShouldRemoveItem() {
        CartItem item = new CartItem();
        item.setProductVariant(variant);
        item.setQuantity(1);
        cart.getItems().add(item);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any())).thenReturn(cart);

        cartService.updateQuantity(1L, 1L, -1);

        assertTrue(cart.getItems().isEmpty());
    }

    /* ======================
       GET SUMMARY
       ====================== */

    @Test
    void getSummary_ShouldCalculateTotalAndCount() {
        CartItem item = new CartItem();
        item.setProductVariant(variant);
        item.setQuantity(2);
        cart.getItems().add(item);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        CartSummaryResponse summary = cartService.getSummary(1L);

        assertEquals(2, summary.getItemCount());
        assertEquals(0, summary.getTotalAmount().compareTo(BigDecimal.valueOf(200)));

    }

    /* ======================
       GET OR CREATE CART
       ====================== */

    @Test
    void getOrCreateCart_WhenCartExists_ShouldReturnIt() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        Cart result = cartService.getOrCreateCart(1L);

        assertNotNull(result);
        assertEquals(cart, result);
    }

    @Test
    void getOrCreateCart_WhenCartMissing_ShouldCreate() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartRepository.save(any())).thenReturn(cart);

        Cart result = cartService.getOrCreateCart(1L);

        assertNotNull(result);
        assertEquals(user, result.getUser());
    }
}
