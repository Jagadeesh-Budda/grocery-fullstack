package com.example.groceries.repository;

import com.example.groceries.model.InventoryByStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryByStoreRepository extends JpaRepository<InventoryByStore, Long> {

    @Query(
            value = """
                SELECT
                    inv.product_variant_id AS variantId,
                    v.sku AS variantName,
                    pm.id AS productId,
                    pm.name AS productName,
                    inv.stock AS stock,
                    pm.low_stock_threshold AS threshold
                FROM inventory_by_store inv
                JOIN product_variants v ON v.id = inv.product_variant_id
                JOIN products pm ON pm.id = v.product_master_id
                WHERE inv.store_id = :storeId
                  AND inv.is_active = true
                ORDER BY pm.name ASC, v.id ASC
            """,
            nativeQuery = true
    )
    List<AdminStoreInventoryProjection> findStoreInventory(long storeId);

    @Query(
            value = """
                SELECT
                    inv.product_variant_id AS variantId,
                    v.sku AS variantName,
                    pm.id AS productId,
                    pm.name AS productName,
                    inv.stock AS stock,
                    pm.low_stock_threshold AS threshold
                FROM inventory_by_store inv
                JOIN product_variants v ON v.id = inv.product_variant_id
                JOIN products pm ON pm.id = v.product_master_id
                WHERE inv.store_id = :storeId
                  AND inv.is_active = true
                  AND pm.is_active = true
                  AND inv.stock <= pm.low_stock_threshold
                ORDER BY inv.stock ASC, v.id ASC
            """,
            nativeQuery = true
    )
    List<AdminStoreInventoryProjection> findStoreLowStockInventory(long storeId);
}
