package com.example.groceries.service;

import com.example.groceries.model.Coupon;
import com.example.groceries.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public Coupon getByCodeOrThrow(String code) {
        String normalized = normalizeCode(code);
        if (normalized == null) {
            throw new IllegalArgumentException("Invalid coupon code");
        }
        return couponRepository.findByCodeIgnoreCase(normalized)
                .orElseThrow(() -> new IllegalArgumentException("Invalid coupon code"));
    }

    @Transactional
    public CouponApplication applyAndConsume(String code, BigDecimal subtotal) {
        if (subtotal == null || subtotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Invalid subtotal");
        }

        Coupon coupon = getByCodeOrThrow(code);

        if (coupon.getIs_active() == null || !coupon.getIs_active()) {
            throw new IllegalStateException("Coupon is inactive");
        }

        LocalDateTime expiresAt = coupon.getExpiresAt();
        if (expiresAt != null && expiresAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Coupon has expired");
        }

        Integer percentOff = coupon.getPercentOff();
        if (percentOff == null || percentOff < 1 || percentOff > 100) {
            throw new IllegalStateException("Invalid coupon percent_off");
        }

        BigDecimal discount = subtotal
                .multiply(BigDecimal.valueOf(percentOff))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }

        int updated = couponRepository.incrementTimesUsedIfAvailable(coupon.getId());
        if (updated != 1) {
            throw new IllegalStateException("Coupon usage limit reached");
        }

        return new CouponApplication(coupon, discount);
    }

    public static String normalizeCode(String code) {
        if (code == null) return null;
        String normalized = code.trim();
        return normalized.isEmpty() ? null : normalized.toUpperCase();
    }

    public record CouponApplication(Coupon coupon, BigDecimal discountAmount) {}
}
