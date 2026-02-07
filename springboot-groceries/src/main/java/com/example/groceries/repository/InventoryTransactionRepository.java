package com.example.groceries.repository;

import com.example.groceries.model.InventoryTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    @Query(
            value = """
                SELECT
                    tx.id AS id,
                    tx.created_at AS createdAt,
                    tx.type AS type,
                    tx.variant_id AS variantId,
                    v.sku AS variantName,
                    pm.id AS productId,
                    pm.name AS productName,
                    tx.order_id AS orderId,
                    tx.delta AS delta,
                    tx.stock_before AS stockBefore,
                    tx.stock_after AS stockAfter,
                    tx.actor_username AS actorUsername,
                    tx.reason AS reason
                FROM inventory_transactions tx
                JOIN product_variants v ON v.id = tx.variant_id
                JOIN products pm ON pm.id = v.product_master_id
                WHERE (:variantId IS NULL OR tx.variant_id = :variantId)
                  AND (:orderId IS NULL OR tx.order_id = :orderId)
                  AND (:type IS NULL OR tx.type = :type)
                ORDER BY tx.created_at DESC, tx.id DESC
            """,
            countQuery = """
                SELECT COUNT(*)
                FROM inventory_transactions tx
                WHERE (:variantId IS NULL OR tx.variant_id = :variantId)
                  AND (:orderId IS NULL OR tx.order_id = :orderId)
                  AND (:type IS NULL OR tx.type = :type)
            """,
            nativeQuery = true
    )
    Page<AdminInventoryTransactionProjection> findAdminHistory(
            @Param("variantId") Long variantId,
            @Param("orderId") Long orderId,
            @Param("type") String type,
            Pageable pageable
    );
}
