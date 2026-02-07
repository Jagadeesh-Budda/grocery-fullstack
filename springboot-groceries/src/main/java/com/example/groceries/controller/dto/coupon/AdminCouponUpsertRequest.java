package com.example.groceries.controller.dto.coupon;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminCouponUpsertRequest {

    @NotBlank
    @Pattern(regexp = "^[A-Za-z0-9_-]{3,50}$", message = "code must be 3-50 chars and only letters, numbers, _ or -")
    private String code;

    @NotNull
    @Min(1)
    @Max(100)
    private Integer percentOff;

    private LocalDateTime expiresAt;

    @Min(0)
    private Integer usageLimit;

    @NotNull
    private Boolean isActive;
}
