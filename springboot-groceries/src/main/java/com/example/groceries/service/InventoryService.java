package com.example.groceries.service;

import com.example.groceries.controller.dto.InventoryAdjustRequest;
import com.example.groceries.controller.dto.InventoryResponse;
import com.example.groceries.exception.ResourceNotFoundException;
import com.example.groceries.model.ProductVariant;
import com.example.groceries.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductVariantRepository productVariantRepository;

    @Transactional(readOnly = true)
    public InventoryResponse getVariantInventory(Long variantId) {
        ProductVariant variant = findVariantOrThrow(variantId);
        return new InventoryResponse(variant.getId(), variant.getStock());
    }

    @Transactional
    public InventoryResponse adjustVariantInventory(Long variantId, InventoryAdjustRequest request) {
        if (request == null || request.getDelta() == null) {
            throw new IllegalArgumentException("delta is required");
        }

        ProductVariant variant = findVariantOrThrow(variantId);
        int currentStock = variant.getStock() != null ? variant.getStock() : 0;

        long newStockLong = (long) currentStock + (long) request.getDelta();
        if (newStockLong < 0) {
            throw new IllegalStateException(
                    "Insufficient stock: current=" + currentStock + ", delta=" + request.getDelta()
            );
        }
        if (newStockLong > Integer.MAX_VALUE) {
            throw new IllegalArgumentException("Resulting stock is too large");
        }

        variant.setStock((int) newStockLong);
        ProductVariant saved = productVariantRepository.save(variant);
        return new InventoryResponse(saved.getId(), saved.getStock());
    }

    private ProductVariant findVariantOrThrow(Long variantId) {
        return productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant not found: " + variantId));
    }
}
