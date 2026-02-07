package com.example.groceries.controller;

import com.example.groceries.controller.dto.inventory.AdminLowStockInventoryItemDTO;
import com.example.groceries.service.AdminInventoryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminInventoryController {

    private static final Logger log = LoggerFactory.getLogger(AdminInventoryController.class);

    private final AdminInventoryService adminInventoryService;

    @GetMapping("/low-stock")
    public ResponseEntity<List<AdminLowStockInventoryItemDTO>> lowStock(Authentication authentication) {
        List<AdminLowStockInventoryItemDTO> result = adminInventoryService.lowStock();

        log.info(
                "AUDIT admin_inventory_low_stock admin={} count={}",
                authentication != null ? authentication.getName() : "anonymous",
                result != null ? result.size() : 0
        );

        return ResponseEntity.ok(result);
    }
}
