package com.example.groceries.service;

import com.example.groceries.controller.dto.store.AdminStoreInventoryItemDTO;
import com.example.groceries.repository.AdminStoreInventoryProjection;
import com.example.groceries.repository.InventoryByStoreRepository;
import com.example.groceries.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminStoreInventoryService {

    private final StoreRepository storeRepository;
    private final InventoryByStoreRepository inventoryByStoreRepository;

    @Transactional(readOnly = true)
    public List<AdminStoreInventoryItemDTO> listInventory(long storeId) {
        requireStoreExists(storeId);
        return inventoryByStoreRepository.findStoreInventory(storeId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminStoreInventoryItemDTO> lowStock(long storeId) {
        requireStoreExists(storeId);
        return inventoryByStoreRepository.findStoreLowStockInventory(storeId).stream()
                .map(this::toDto)
                .toList();
    }

    private void requireStoreExists(long storeId) {
        if (!storeRepository.existsById(storeId)) {
            throw new IllegalArgumentException("Store not found: " + storeId);
        }
    }

    private AdminStoreInventoryItemDTO toDto(AdminStoreInventoryProjection row) {
        return new AdminStoreInventoryItemDTO(
                row.getVariantId(),
                row.getVariantName(),
                row.getProductId(),
                row.getProductName(),
                row.getStock(),
                row.getThreshold()
        );
    }
}
