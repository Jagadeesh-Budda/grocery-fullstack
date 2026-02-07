package com.example.groceries.controller;

import com.example.groceries.controller.dto.inventory.AdminInventoryTransactionDTO;
import com.example.groceries.repository.AdminInventoryTransactionProjection;
import com.example.groceries.repository.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/inventory/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminInventoryTransactionController {

    private static final Logger log = LoggerFactory.getLogger(AdminInventoryTransactionController.class);

    private final InventoryTransactionRepository inventoryTransactionRepository;

    @GetMapping
    public ResponseEntity<Page<AdminInventoryTransactionDTO>> history(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) Long variantId,
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) String type,
            Authentication authentication
    ) {
        int safeSize = Math.min(Math.max(size, 1), 200);
        PageRequest pageable = PageRequest.of(Math.max(page, 0), safeSize, Sort.by(Sort.Direction.DESC, "id"));

        Page<AdminInventoryTransactionDTO> result = inventoryTransactionRepository
                .findAdminHistory(variantId, orderId, type, pageable)
                .map(this::toDto);

        log.info(
                "AUDIT admin_inventory_transactions_list admin={} page={} size={} variantId={} orderId={} type={}",
                authentication != null ? authentication.getName() : "anonymous",
                page,
                safeSize,
                variantId,
                orderId,
                type
        );

        return ResponseEntity.ok(result);
    }

    private AdminInventoryTransactionDTO toDto(AdminInventoryTransactionProjection r) {
        return new AdminInventoryTransactionDTO(
                r.getId(),
                r.getCreatedAt(),
                r.getType(),
                r.getVariantId(),
                r.getVariantName(),
                r.getProductId(),
                r.getProductName(),
                r.getOrderId(),
                r.getDelta(),
                r.getStockBefore(),
                r.getStockAfter(),
                r.getActorUsername(),
                r.getReason()
        );
    }
}
