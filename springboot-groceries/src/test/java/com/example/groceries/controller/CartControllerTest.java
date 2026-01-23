package com.example.groceries.controller;

import com.example.groceries.controller.dto.CartItemRequest;
import com.example.groceries.controller.dto.CartItemResponse;
import com.example.groceries.exception.ResourceNotFoundException;
import com.example.groceries.service.CartService;
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
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CartController.class)
@AutoConfigureMockMvc(addFilters = false)
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CartService cartService;

    @Autowired
    private ObjectMapper objectMapper;

    /* ======================
       ADD ITEM
       ====================== */

    @Test
    void addItem_VariantNotFound_ShouldReturn404() throws Exception {
        Mockito.when(cartService.addItemAndReturn(
                        Mockito.anyLong(),
                        Mockito.anyLong(),
                        Mockito.anyInt()
                ))
                .thenThrow(new ResourceNotFoundException("Variant not found"));

        mockMvc.perform(
                        post("/api/cart/1/add")
                                .param("variantId", "1")
                                .param("quantity", "1")
                )
                .andExpect(status().isNotFound());
    }

    /* ======================
       MERGE CART
       ====================== */

    @Test
    void mergeCart_ShouldSucceed() throws Exception {
        List<CartItemResponse> responses = List.of(
                new CartItemResponse(
                        1L,
                        "Product",
                        "Variant",
                        1,
                        new BigDecimal("10.00"),
                        "url"
                )
        );

        Mockito.when(cartService.mergeAndReturn(
                        Mockito.anyLong(),
                        Mockito.anyList()
                ))
                .thenReturn(responses);

        List<CartItemRequest> requests =
                List.of(new CartItemRequest(1L, 2));

        mockMvc.perform(
                        post("/api/cart/1/merge")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requests))
                )
                .andExpect(status().isOk());
    }
}
