package com.example.groceries.controller;

import com.example.groceries.controller.dto.CreateOrderRequest;
import com.example.groceries.controller.dto.OrderItemRequest;
import com.example.groceries.model.Order;
import com.example.groceries.model.OrderStatus;
import com.example.groceries.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.is;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createOrder_ShouldReturnOrderId() throws Exception {

        // ✅ request DTO
        CreateOrderRequest request = CreateOrderRequest.builder()
                .userId(1L)
                .items(List.of(
                        OrderItemRequest.builder()
                                .variantId(1L)
                                .quantity(2)
                                .build()
                ))
                .build();

        // ✅ MANUAL entity creation (NO builder)
        Order savedOrder = new Order();
        savedOrder.setId(123L);
        savedOrder.setTotalAmount(BigDecimal.valueOf(200));
        savedOrder.setStatus(OrderStatus.CREATED);
        savedOrder.setCreatedAt(LocalDateTime.now());

        Mockito.when(orderService.createOrder(Mockito.any()))
                .thenReturn(savedOrder);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void updateOrderStatus_ShouldReturnUpdatedOrder() throws Exception {
        Order updatedOrder = new Order();
        updatedOrder.setId(1L);
        updatedOrder.setStatus(OrderStatus.CONFIRMED);

        Mockito.when(orderService.updateOrderStatus(1L, OrderStatus.CONFIRMED))
                .thenReturn(updatedOrder);

        mockMvc.perform(put("/api/orders/1/status")
                        .param("status", "CONFIRMED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CONFIRMED")));
    }

    @Test
    void cancelOrder_ShouldReturnCancelledOrder() throws Exception {
        Order cancelledOrder = new Order();
        cancelledOrder.setId(1L);
        cancelledOrder.setStatus(OrderStatus.CANCELLED);

        Mockito.when(orderService.cancelOrder(1L))
                .thenReturn(cancelledOrder);

        mockMvc.perform(post("/api/orders/1/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CANCELLED")));
    }
}
