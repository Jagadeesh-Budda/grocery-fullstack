package com.example.groceries.controller;

import com.example.groceries.controller.dto.store.AdminStoreDTO;
import com.example.groceries.service.AdminStoreService;
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
@RequestMapping("/api/admin/stores")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminStoreController {

    private static final Logger log = LoggerFactory.getLogger(AdminStoreController.class);

    private final AdminStoreService adminStoreService;

    @GetMapping
    public ResponseEntity<List<AdminStoreDTO>> list(Authentication authentication) {
        List<AdminStoreDTO> result = adminStoreService.listStores();

        log.info(
                "AUDIT admin_store_list admin={} count={}"
                , authentication != null ? authentication.getName() : "anonymous"
                , result != null ? result.size() : 0
        );

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<AdminStoreDTO> get(
            @PathVariable long storeId,
            Authentication authentication
    ) {
        AdminStoreDTO result = adminStoreService.getStore(storeId);

        log.info(
                "AUDIT admin_store_get admin={} storeId={}"
                , authentication != null ? authentication.getName() : "anonymous"
                , storeId
        );

        return ResponseEntity.ok(result);
    }
}
