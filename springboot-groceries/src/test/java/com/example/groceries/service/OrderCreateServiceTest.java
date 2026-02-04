package com.example.groceries.service;

import com.example.groceries.exception.OrderCreateErrorCode;
import com.example.groceries.exception.OrderCreateException;
import com.example.groceries.repository.CartRepository;
import com.example.groceries.repository.OrderRepository;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderCreateServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderCreateService orderCreateService;

    @Test
    void createOrderSafely_whenNoCart_shouldThrowEmptyCart() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());

        OrderCreateException ex = assertThrows(
                OrderCreateException.class,
                () -> orderCreateService.createOrderSafely(1L)
        );

        assertEquals(OrderCreateErrorCode.EMPTY_CART, ex.getCode());
    }
}
