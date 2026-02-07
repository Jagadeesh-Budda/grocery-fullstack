package com.example.groceries.service;

import com.example.groceries.model.InventoryTransaction;
import com.example.groceries.model.InventoryTransactionType;
import com.example.groceries.repository.InventoryTransactionRepository;
import com.example.groceries.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {

    private final InventoryTransactionRepository inventoryTransactionRepository;

    public void record(
            InventoryTransactionType type,
            Long variantId,
            Long orderId,
            int delta,
            int stockBefore,
            int stockAfter,
            String reason
    ) {
        InventoryTransaction tx = new InventoryTransaction();
        tx.setType(type);
        tx.setVariantId(variantId);
        tx.setOrderId(orderId);
        tx.setDelta(delta);
        tx.setStockBefore(stockBefore);
        tx.setStockAfter(stockAfter);
        tx.setReason(reason);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            tx.setActorUsername(authentication.getName());
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserPrincipal up) {
                tx.setActorUserId(up.getId());
            }
        }

        inventoryTransactionRepository.save(tx);
    }
}
