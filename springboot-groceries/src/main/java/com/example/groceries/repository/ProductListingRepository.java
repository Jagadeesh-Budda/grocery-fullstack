package com.example.groceries.repository;

import com.example.groceries.controller.dto.ProductListView;
import com.example.groceries.model.ProductMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductListingRepository extends JpaRepository<ProductMaster, Long> {

    /* ================= PAGINATED PRODUCT LIST ================= */
    // Updated to query product_variants directly to show all 2500+ items
    @Query(
            value = """
            SELECT
              pm.id    AS productId,
              pm.name  AS productName,
              c.name   AS category,
              pv.id    AS variantId,
              pv.name  AS variantName,
              pv.price AS price
            FROM product_variants pv
            JOIN product_masters pm ON pm.id = pv.product_master_id
            JOIN category c ON c.id = pm.category_id
            WHERE pm.active = true
            ORDER BY pm.name ASC, pv.price ASC
            LIMIT :size OFFSET :offset
        """,
            nativeQuery = true
    )
    List<ProductListView> findProducts(
            @Param("size") int size,
            @Param("offset") int offset
    );

    /* ================= PRODUCT COUNT ================= */
    @Query(
            value = """
        SELECT COUNT(*)
        FROM product_variants pv
        JOIN product_masters pm ON pm.id = pv.product_master_id
        WHERE pm.active = true
    """,
            nativeQuery = true
    )
    long countVariants();
}