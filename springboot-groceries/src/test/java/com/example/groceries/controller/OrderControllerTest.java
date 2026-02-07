package com.example.groceries.controller;

import com.example.groceries.controller.dto.OrderCreateResponse;
import com.example.groceries.model.Order;
import com.example.groceries.model.OrderStatus;
import com.example.groceries.service.OrderCreateService;
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

        @MockBean
        private OrderCreateService orderCreateService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createOrder_ShouldReturnOrderCreateResponse() throws Exception {

        OrderCreateResponse response = OrderCreateResponse.builder()
                .orderId(123L)
                .totalAmount(BigDecimal.valueOf(200))
                .status(OrderStatus.CREATED)
                .build();

        Mockito.when(orderCreateService.createOrderSafely(1L)).thenReturn(response);

        mockMvc.perform(post("/api/orders")
                        .sessionAttr("userId", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId", is(123)))
                .andExpect(jsonPath("$.status", is("CREATED")));
    }

    @Test
    void createOrder_WithoutSessionUserId_ShouldReturn401() throws Exception {
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateOrderStatus_PublicEndpointShouldNotExist() throws Exception {
        mockMvc.perform(put("/api/orders/1/status")
                        .param("status", "CONFIRMED"))
                .andExpect(status().isNotFound());
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
