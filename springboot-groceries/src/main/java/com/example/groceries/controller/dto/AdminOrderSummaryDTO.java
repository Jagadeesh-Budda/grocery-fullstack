package com.example.groceries.controller.dto;

import com.example.groceries.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderSummaryDTO {
    private Long orderId;
    private String userEmail;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private long itemsCount;
    private List<AdminOrderTimelineEntryDTO> timeline;
}
