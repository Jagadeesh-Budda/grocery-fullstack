package com.example.groceries.service;

import com.example.groceries.audit.AdminAuditMutation;
import com.example.groceries.controller.dto.coupon.AdminCouponDTO;
import com.example.groceries.controller.dto.coupon.AdminCouponUpsertRequest;
import com.example.groceries.model.Coupon;
import com.example.groceries.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminCouponService {

    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public List<AdminCouponDTO> list() {
        return couponRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminCouponDTO get(long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found: " + couponId));
        return toDto(coupon);
    }

    @Transactional
    @AdminAuditMutation(
            entity = "Coupon",
            entityClass = Coupon.class,
            entityIdAfter = "#result.id",
            operation = AdminAuditMutation.Operation.CREATE
    )
    public Coupon create(AdminCouponUpsertRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        Coupon coupon = new Coupon();
        applyRequest(coupon, request);
        coupon.setTimesUsed(0);

        return couponRepository.save(coupon);
    }

    @Transactional
    @AdminAuditMutation(
            entity = "Coupon",
            entityClass = Coupon.class,
            entityIdBefore = "#couponId",
            entityIdAfter = "#couponId",
            operation = AdminAuditMutation.Operation.UPDATE
    )
    public Coupon update(long couponId, AdminCouponUpsertRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found: " + couponId));

        applyRequest(coupon, request);
        return couponRepository.save(coupon);
    }

    @Transactional
    @AdminAuditMutation(
            entity = "Coupon",
            entityClass = Coupon.class,
            entityIdBefore = "#couponId",
            operation = AdminAuditMutation.Operation.DELETE
    )
    public void delete(long couponId) {
        Coupon existing = couponRepository.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found: " + couponId));
        couponRepository.delete(existing);
    }

    private void applyRequest(Coupon coupon, AdminCouponUpsertRequest request) {
        String normalized = CouponService.normalizeCode(request.getCode());
        if (normalized == null) {
            throw new IllegalArgumentException("code is required");
        }

        coupon.setCode(normalized);
        coupon.setPercentOff(request.getPercentOff());
        coupon.setExpiresAt(request.getExpiresAt());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setIs_active(request.getIsActive());
    }

    private AdminCouponDTO toDto(Coupon coupon) {
        return new AdminCouponDTO(
                coupon.getId(),
                coupon.getCode(),
                coupon.getPercentOff(),
                coupon.getExpiresAt(),
                coupon.getUsageLimit(),
                coupon.getTimesUsed(),
                coupon.getIs_active(),
                coupon.getCreatedAt()
        );
    }
}
