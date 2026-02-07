package com.example.groceries.controller;

import com.example.groceries.controller.dto.store.AdminStoreInventoryItemDTO;
import com.example.groceries.service.AdminStoreInventoryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stores/{storeId}/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminStoreInventoryController {

    private static final Logger log = LoggerFactory.getLogger(AdminStoreInventoryController.class);

    private final AdminStoreInventoryService adminStoreInventoryService;

    @GetMapping
    public ResponseEntity<List<AdminStoreInventoryItemDTO>> list(
            @PathVariable long storeId,
            Authentication authentication
    ) {
        List<AdminStoreInventoryItemDTO> result = adminStoreInventoryService.listInventory(storeId);

        log.info(
                "AUDIT admin_store_inventory_list admin={} storeId={} count={}"
                , authentication != null ? authentication.getName() : "anonymous"
                , storeId
                , result != null ? result.size() : 0
        );

        return ResponseEntity.ok(result);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<AdminStoreInventoryItemDTO>> lowStock(
            @PathVariable long storeId,
            Authentication authentication
    ) {
        List<AdminStoreInventoryItemDTO> result = adminStoreInventoryService.lowStock(storeId);

        log.info(
                "AUDIT admin_store_inventory_low_stock admin={} storeId={} count={}"
                , authentication != null ? authentication.getName() : "anonymous"
                , storeId
                , result != null ? result.size() : 0
        );

        return ResponseEntity.ok(result);
    }
}
