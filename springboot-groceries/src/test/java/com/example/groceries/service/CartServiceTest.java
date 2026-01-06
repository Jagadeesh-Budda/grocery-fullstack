package com.example.groceries.service;

import com.example.groceries.controller.dto.CartSummaryResponse;
import com.example.groceries.model.*;
import com.example.groceries.repository.CartItemRepository;
import com.example.groceries.repository.CartRepository;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProductVariantRepository productVariantRepository;
    @Mock
    private OrderService orderService;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Cart cart;
    private ProductVariant variant;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        cart = new Cart();
        cart.setId(1L);
        cart.setUser(user);
        cart.setItems(new ArrayList<>());

        variant = new ProductVariant();
        variant.setId(1L);
        variant.setMrp(new BigDecimal("10.00"));
        variant.setDiscountPercent(0);
    }

    @Test
    void getOrCreateCart_Exists_ShouldReturnExisting() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        Cart result = cartService.getOrCreateCart(1L);

        assertEquals(cart, result);
        verify(cartRepository, never()).save(any());
    }

    @Test
    void getOrCreateCart_NotExists_ShouldCreateNew() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Cart result = cartService.getOrCreateCart(1L);

        assertNotNull(result);
        assertEquals(user, result.getUser());
        verify(cartRepository).save(any());
    }

    @Test
    void addItemToCart_NewItem_ShouldAdd() {
        variant.setStock(10);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findById(1L)).thenReturn(Optional.of(variant));
        when(cartRepository.save(any())).thenReturn(cart);

        cartService.addItemToCart(1L, 1L, 2);

        assertEquals(1, cart.getItems().size());
        assertEquals(2, cart.getItems().get(0).getQuantity());
        assertEquals(variant, cart.getItems().get(0).getProductVariant());
    }

    @Test
    void addItemToCart_InsufficientStock_ShouldThrowException() {
        variant.setStock(1);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findById(1L)).thenReturn(Optional.of(variant));

        assertThrows(IllegalStateException.class, () -> cartService.addItemToCart(1L, 1L, 2));
    }

    @Test
    void addItemToCart_ExistingItem_ShouldIncreaseQuantity() {
        variant.setStock(10);
        CartItem existingItem = new CartItem();
        existingItem.setProductVariant(variant);
        existingItem.setQuantity(1);
        cart.getItems().add(existingItem);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findById(1L)).thenReturn(Optional.of(variant));
        when(cartRepository.save(any())).thenReturn(cart);

        cartService.addItemToCart(1L, 1L, 2);

        assertEquals(1, cart.getItems().size());
        assertEquals(3, cart.getItems().get(0).getQuantity());
    }

    @Test
    void addItemToCart_ExistingItem_InsufficientStock_ShouldThrowException() {
        variant.setStock(2);
        CartItem existingItem = new CartItem();
        existingItem.setProductVariant(variant);
        existingItem.setQuantity(1);
        cart.getItems().add(existingItem);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findById(1L)).thenReturn(Optional.of(variant));

        assertThrows(IllegalStateException.class, () -> cartService.addItemToCart(1L, 1L, 2));
    }

    @Test
    void updateQuantity_Increase_ShouldUpdate() {
        variant.setStock(10);
        CartItem existingItem = new CartItem();
        existingItem.setProductVariant(variant);
        existingItem.setQuantity(1);
        cart.getItems().add(existingItem);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any())).thenReturn(cart);

        cartService.updateQuantity(1L, 1L, 1);

        assertEquals(2, existingItem.getQuantity());
    }

    @Test
    void updateQuantity_Increase_InsufficientStock_ShouldThrowException() {
        variant.setStock(1);
        CartItem existingItem = new CartItem();
        existingItem.setProductVariant(variant);
        existingItem.setQuantity(1);
        cart.getItems().add(existingItem);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        assertThrows(IllegalStateException.class, () -> cartService.updateQuantity(1L, 1L, 1));
    }

    @Test
    void updateQuantity_DecreaseToZero_ShouldRemove() {
        CartItem existingItem = new CartItem();
        existingItem.setProductVariant(variant);
        existingItem.setQuantity(1);
        cart.getItems().add(existingItem);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any())).thenReturn(cart);

        cartService.updateQuantity(1L, 1L, -1);

        assertTrue(cart.getItems().isEmpty());
    }

    @Test
    void getCartSummary_ShouldReturnCorrectSummary() {
        CartItem item1 = new CartItem();
        item1.setProductVariant(variant);
        item1.setQuantity(2); // 2 * 10.00 = 20.00
        
        ProductVariant variant2 = new ProductVariant();
        variant2.setId(2L);
        variant2.setMrp(new BigDecimal("5.00"));
        variant2.setDiscountPercent(0);
        
        CartItem item2 = new CartItem();
        item2.setProductVariant(variant2);
        item2.setQuantity(3); // 3 * 5.00 = 15.00
        
        cart.getItems().add(item1);
        cart.getItems().add(item2);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        CartSummaryResponse summary = cartService.getCartSummary(1L);

        assertEquals(5, summary.getItemCount());
        assertEquals(new BigDecimal("35.00"), summary.getTotalAmount());
    }

    @Test
    void checkout_ShouldCreateOrderAndClearCart() {
        // Arrange
        CartItem item = new CartItem();
        item.setProductVariant(variant);
        item.setQuantity(2);
        cart.getItems().add(item);

        Order mockOrder = new Order();
        mockOrder.setId(100L);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(orderService.createOrder(any())).thenReturn(mockOrder);

        // Act
        Order result = cartService.checkout(1L);

        // Assert
        assertEquals(100L, result.getId());
        assertTrue(cart.getItems().isEmpty());
        verify(orderService).createOrder(any());
        verify(cartRepository).save(cart);
    }

    @Test
    void checkout_EmptyCart_ShouldThrowException() {
        // Arrange
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> cartService.checkout(1L));
        verify(orderService, never()).createOrder(any());
    }
}
