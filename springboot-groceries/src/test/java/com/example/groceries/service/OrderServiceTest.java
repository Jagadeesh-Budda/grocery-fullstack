package com.example.groceries.service;

import com.example.groceries.controller.dto.CreateOrderRequest;
import com.example.groceries.controller.dto.OrderItemRequest;
import com.example.groceries.model.*;
import com.example.groceries.repository.OrderRepository;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private ProductMaster productMaster;
    private ProductVariant variant;

    @BeforeEach
    void setUp() {
        user = new User();
        // user.setId(1L); // User doesn't have setId but has getId. Wait, let's check User.java again.
        user.setUsername("testuser");

        productMaster = new ProductMaster();
        productMaster.setId(10L);
        productMaster.setName("Test Product");

        variant = new ProductVariant();
        variant.setId(100L);
        variant.setVariantName("500g");
        variant.setPrice(BigDecimal.valueOf(50.0));
        variant.setProductMaster(productMaster);
    }

    @Test
    void createOrder_ShouldCalculateTotalsAndSave() {
        // Arrange
        OrderItemRequest itemRequest = OrderItemRequest.builder()
                .variantId(100L)
                .quantity(2)
                .build();

        CreateOrderRequest request = CreateOrderRequest.builder()
                .userId(1L)
                .items(List.of(itemRequest))
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productVariantRepository.findById(100L)).thenReturn(Optional.of(variant));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Order createdOrder = orderService.createOrder(request);

        // Assert
        assertNotNull(createdOrder);
        assertEquals(user, createdOrder.getUser());
        assertEquals("PENDING", createdOrder.getStatus());
        assertEquals(0, BigDecimal.valueOf(100.0).compareTo(createdOrder.getTotalAmount()));
        assertEquals(1, createdOrder.getOrderItems().size());

        OrderItem savedItem = createdOrder.getOrderItems().get(0);
        assertEquals(variant, savedItem.getVariant());
        assertEquals(productMaster.getId(), savedItem.getProductId());
        assertEquals(productMaster.getName(), savedItem.getProductName());
        assertEquals(variant.getVariantName(), savedItem.getVariantName());
        assertEquals(0, BigDecimal.valueOf(50.0).compareTo(savedItem.getPrice()));
        assertEquals(2, savedItem.getQuantity());
        assertEquals(0, BigDecimal.valueOf(100.0).compareTo(savedItem.getSubtotal()));

        verify(orderRepository, times(2)).save(any(Order.class));
    }

    @Test
    void createOrder_UserNotFound_ShouldThrowException() {
        // Arrange
        CreateOrderRequest request = CreateOrderRequest.builder()
                .userId(1L)
                .build();
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> orderService.createOrder(request));
        verify(orderRepository, never()).save(any());
    }
}
