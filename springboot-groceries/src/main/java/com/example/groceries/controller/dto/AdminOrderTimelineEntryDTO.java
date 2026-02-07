package com.example.groceries.controller.dto;

import com.example.groceries.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderTimelineEntryDTO {
    private OrderStatus status;
    private boolean reached;
    private boolean current;
}
