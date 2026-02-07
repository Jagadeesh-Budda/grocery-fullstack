package com.example.groceries.repository;

import com.example.groceries.model.ProductVariant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    /* =========================
       ACTIVE PRODUCTS FOR USER SHOP
       ========================= */
    @Query("""
        SELECT v FROM ProductVariant v
        WHERE v.productMaster.is_active = true
          AND v.discountPercent >= :discountPercent
    """)
    Page<ProductVariant> findByDiscountPercentGreaterThanEqual(
            @org.springframework.data.repository.query.Param("discountPercent")
            Integer discountPercent,
            Pageable pageable
    );

    @Query("""
        SELECT v FROM ProductVariant v
        WHERE v.productMaster.is_active = true
    """)
    Page<ProductVariant> findActiveVariants(Pageable pageable);

    @Query(
            value = """
                SELECT COUNT(*)
                FROM product_variants v
                JOIN products pm ON pm.id = v.product_master_id
                WHERE pm.is_active = true
                  AND v.stock <= pm.low_stock_threshold
            """,
            nativeQuery = true
    )
    long countLowStockVariants();

    @Query(
            value = """
                SELECT
                    v.id AS variantId,
                    v.sku AS variantName,
                    pm.id AS productId,
                    pm.name AS productName,
                    v.stock AS stock,
                    pm.low_stock_threshold AS threshold
                FROM product_variants v
                JOIN products pm ON pm.id = v.product_master_id
                WHERE v.stock <= pm.low_stock_threshold
                ORDER BY v.stock ASC, v.id ASC
            """,
            nativeQuery = true
    )
    List<AdminLowStockInventoryProjection> findLowStockInventory();
}
