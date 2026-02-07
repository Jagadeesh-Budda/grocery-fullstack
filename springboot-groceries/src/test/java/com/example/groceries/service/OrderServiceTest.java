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

    @Mock
    private InventoryTransactionService inventoryTransactionService;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private ProductMaster productMaster;
    private ProductVariant variant;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUsername("testuser");

        productMaster = new ProductMaster();
        productMaster.setId(10L);
        productMaster.setName("Test Product");

        variant = new ProductVariant();
        variant.setId(100L);
        variant.setVariantName("500g");
        variant.setMrp(BigDecimal.valueOf(50.0));
        variant.setDiscountPercent(0);
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
        assertEquals(OrderStatus.CREATED, createdOrder.getStatus());
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
                .items(List.of(OrderItemRequest.builder().variantId(100L).quantity(1).build()))
                .build();
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> orderService.createOrder(request));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void updateOrderStatus_ValidTransition_ToConfirmed_ShouldReduceStock() {
        // Arrange
        variant.setStock(10);
        OrderItem item = new OrderItem();
        item.setVariant(variant);
        item.setQuantity(2);

        Order order = new Order();
        order.setId(1L);
        // FIX: Start with PENDING to allow transition to CONFIRMED
        order.setStatus(OrderStatus.PENDING);
        order.addOrderItem(item);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Order updatedOrder = orderService.updateOrderStatus(1L, OrderStatus.CONFIRMED);

        // Assert
        assertEquals(OrderStatus.CONFIRMED, updatedOrder.getStatus());
        assertEquals(8, variant.getStock());
        verify(productVariantRepository).save(variant);
        verify(orderRepository).save(order);
    }

    @Test
    void updateOrderStatus_ValidTransition_ToConfirmed_InsufficientStock_ShouldThrowException() {
        // Arrange
        variant.setStock(1);
        OrderItem item = new OrderItem();
        item.setVariant(variant);
        item.setQuantity(2);

        Order order = new Order();
        order.setId(1L);
        // FIX: Start with PENDING to avoid status validation error before stock check
        order.setStatus(OrderStatus.PENDING);
        order.addOrderItem(item);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> orderService.updateOrderStatus(1L, OrderStatus.CONFIRMED));
        assertEquals(1, variant.getStock());
        verify(productVariantRepository, never()).save(any());
    }

    @Test
    void cancelOrder_ConfirmedStatus_ShouldRestoreStock() {
        // Arrange
        variant.setStock(8);
        OrderItem item = new OrderItem();
        item.setVariant(variant);
        item.setQuantity(2);

        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.CONFIRMED);
        order.addOrderItem(item);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Order cancelledOrder = orderService.cancelOrder(1L);

        // Assert
        assertEquals(OrderStatus.CANCELLED, cancelledOrder.getStatus());
        assertEquals(10, variant.getStock());
        verify(productVariantRepository).save(variant);
        verify(orderRepository).save(order);
    }

    @Test
    void updateOrderStatus_SameStatus_ShouldReturnOrderWithoutSaving() {
        // Arrange
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.CONFIRMED);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act
        Order updatedOrder = orderService.updateOrderStatus(1L, OrderStatus.CONFIRMED);

        // Assert
        assertEquals(OrderStatus.CONFIRMED, updatedOrder.getStatus());
        verify(orderRepository, never()).save(any());
    }

    @Test
    void cancelOrder_AlreadyCancelled_ShouldReturnOrderWithoutSaving() {
        // Arrange
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.CANCELLED);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act
        Order result = orderService.cancelOrder(1L);

        // Assert
        assertEquals(OrderStatus.CANCELLED, result.getStatus());
        verify(orderRepository, never()).save(any());
    }
}