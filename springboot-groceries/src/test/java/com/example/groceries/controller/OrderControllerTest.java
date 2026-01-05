package com.example.groceries.controller;

import com.example.groceries.controller.dto.CreateOrderRequest;
import com.example.groceries.controller.dto.OrderItemRequest;
import com.example.groceries.model.Order;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
        savedOrder.setStatus("PENDING");
        savedOrder.setCreatedAt(LocalDateTime.now());

        Mockito.when(orderService.createOrder(Mockito.any()))
                .thenReturn(savedOrder);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
