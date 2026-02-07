package com.example.groceries.service;

import com.example.groceries.controller.dto.inventory.AdminLowStockInventoryItemDTO;
import com.example.groceries.repository.AdminLowStockInventoryProjection;
import com.example.groceries.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminInventoryService {

    private final ProductVariantRepository productVariantRepository;

    @Transactional(readOnly = true)
    public List<AdminLowStockInventoryItemDTO> lowStock() {
        List<AdminLowStockInventoryProjection> rows = productVariantRepository.findLowStockInventory();
        return rows.stream()
                .map(r -> new AdminLowStockInventoryItemDTO(
                        r.getVariantId(),
                        r.getVariantName(),
                        r.getProductId(),
                        r.getProductName(),
                        r.getStock(),
                        r.getThreshold()
                ))
                .toList();
    }
}
