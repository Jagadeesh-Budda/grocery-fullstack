package com.example.groceries.controller;

import com.example.groceries.controller.dto.InventoryAdjustRequest;
import com.example.groceries.controller.dto.InventoryResponse;
import com.example.groceries.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InventoryController {

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
        return ResponseEntity.ok(inventoryService.adjustVariantInventory(variantId, request));
    }
}
