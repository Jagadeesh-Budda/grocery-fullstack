package com.example.groceries.controller.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuyAgainDTO {
    private Long productVariantId;
    private Long orderCount;
    private LocalDateTime lastOrderedAt;
}
