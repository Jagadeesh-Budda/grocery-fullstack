package com.example.groceries.controller.dto.coupon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminCouponDTO {
    private Long id;
    private String code;
    private Integer percentOff;
    private LocalDateTime expiresAt;
    private Integer usageLimit;
    private Integer timesUsed;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
