package com.example.groceries.repository;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.model.ProductMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductMasterRepository extends JpaRepository<ProductMaster, Long> {

    /* =========================
       USED BY ProductService
       ========================= */

    List<ProductMaster> findByCategoryId(Long categoryId);

    @Query("""
        SELECT DISTINCT pm
        FROM ProductMaster pm
        LEFT JOIN FETCH pm.variants
        WHERE pm.id = :id
    """)
    Optional<ProductMaster> findByIdWithVariants(@Param("id") Long id);

    /* =========================
       GROUPED PRODUCTS (FINAL FIX)
       ========================= */

    @Query(
            value = """
            SELECT new com.example.groceries.controller.dto.GroupedProductDTO(
                pm.id,
                pm.name,
                pm.imageUrl,
                                COALESCE(MAX(v.stock), 1),
                                MIN(v.unit),
                                COALESCE(pm.category.name, 'Uncategorized'),
                                MIN(v.mrp)
            )
            FROM ProductMaster pm
            JOIN pm.variants v
            WHERE pm.active = true
              AND (:category IS NULL OR LOWER(pm.category.name) = :category)
                        GROUP BY pm.id, pm.name, pm.imageUrl, pm.category.name
            ORDER BY pm.name ASC
        """,
            countQuery = """
            SELECT COUNT(DISTINCT pm.id)
            FROM ProductMaster pm
            WHERE pm.active = true
              AND (:category IS NULL OR LOWER(pm.category.name) = :category)
        """
    )
    Page<GroupedProductDTO> findGroupedProducts(
            @Param("category") String category,
            Pageable pageable
    );
}
