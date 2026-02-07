package com.example.groceries.controller;

import com.example.groceries.controller.dto.coupon.AdminCouponDTO;
import com.example.groceries.controller.dto.coupon.AdminCouponUpsertRequest;
import com.example.groceries.model.Coupon;
import com.example.groceries.service.AdminCouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminCouponController {

    private static final Logger log = LoggerFactory.getLogger(AdminCouponController.class);

    private final AdminCouponService adminCouponService;

    @GetMapping
    public ResponseEntity<List<AdminCouponDTO>> list(Authentication authentication) {
        List<AdminCouponDTO> result = adminCouponService.list();
        log.info(
                "AUDIT admin_coupon_list admin={} count={}"
                , authentication != null ? authentication.getName() : "anonymous"
                , result != null ? result.size() : 0
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{couponId}")
    public ResponseEntity<AdminCouponDTO> get(
            @PathVariable long couponId,
            Authentication authentication
    ) {
        AdminCouponDTO result = adminCouponService.get(couponId);
        log.info(
                "AUDIT admin_coupon_get admin={} couponId={}"
                , authentication != null ? authentication.getName() : "anonymous"
                , couponId
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<AdminCouponDTO> create(
            @Valid @RequestBody AdminCouponUpsertRequest request,
            Authentication authentication
    ) {
        Coupon created = adminCouponService.create(request);
        log.info(
                "AUDIT admin_coupon_create admin={} couponId={} code={}"
                , authentication != null ? authentication.getName() : "anonymous"
                , created.getId()
                , created.getCode()
        );
        return ResponseEntity.ok(adminCouponService.get(created.getId()));
    }

    @PutMapping("/{couponId}")
    public ResponseEntity<AdminCouponDTO> update(
            @PathVariable long couponId,
            @Valid @RequestBody AdminCouponUpsertRequest request,
            Authentication authentication
    ) {
        Coupon updated = adminCouponService.update(couponId, request);
        log.info(
                "AUDIT admin_coupon_update admin={} couponId={}"
                , authentication != null ? authentication.getName() : "anonymous"
                , updated.getId()
        );
        return ResponseEntity.ok(adminCouponService.get(updated.getId()));
    }

    @DeleteMapping("/{couponId}")
    public ResponseEntity<Void> delete(
            @PathVariable long couponId,
            Authentication authentication
    ) {
        adminCouponService.delete(couponId);
        log.info(
                "AUDIT admin_coupon_delete admin={} couponId={}"
                , authentication != null ? authentication.getName() : "anonymous"
                , couponId
        );
        return ResponseEntity.noContent().build();
    }
}
