package com.example.groceries.controller;

import com.example.groceries.controller.dto.InventoryAdjustRequest;
import com.example.groceries.controller.dto.InventoryResponse;
import com.example.groceries.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InventoryController {

    private static final Logger log = LoggerFactory.getLogger(InventoryController.class);

    /**
     * TODO(security): enforce admin role for /api/admin/** endpoints.
     */
    private final InventoryService inventoryService;

    @GetMapping("/variants/{variantId}")
    public ResponseEntity<InventoryResponse> getVariantInventory(@PathVariable Long variantId) {
        return ResponseEntity.ok(inventoryService.getVariantInventory(variantId));
    }

    @PutMapping("/variants/{variantId}/adjust")
    public ResponseEntity<InventoryResponse> adjustVariantInventory(
            @PathVariable Long variantId,
            @RequestBody InventoryAdjustRequest request
    ) {
        InventoryResponse res = inventoryService.adjustVariantInventory(variantId, request);
        log.info(
                "AUDIT admin_inventory_adjust variantId={} delta={} actor={}",
                variantId,
                request != null ? request.getDelta() : null,
                currentUsername()
        );
        return ResponseEntity.ok(res);
    }

    private String currentUsername() {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return "anonymous";
        }
        return authentication.getName();
    }
}
