package com.example.groceries.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @NotNull
    @Min(1)
    @Max(100)
    @Column(name = "percent_off", nullable = false)
    private Integer percentOff;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @NotNull
    @Min(0)
    @Column(name = "times_used", nullable = false)
    private Integer timesUsed = 0;

    @NotNull
    @Column(nullable = false)
    private Boolean is_active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
