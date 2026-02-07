package com.example.groceries.repository;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.model.ProductMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
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
       USED BY AdminProductService
       ========================= */

    @EntityGraph(attributePaths = {"category"})
    @Query("""
        SELECT pm
        FROM ProductMaster pm
        WHERE (:active IS NULL OR pm.is_active = :active)
          AND (:q IS NULL OR :q = '' OR LOWER(pm.name) LIKE LOWER(CONCAT('%', :q, '%')))
    """)
    Page<ProductMaster> findAdminProducts(
            @Param("q") String q,
            @Param("active") Boolean active,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT pm
        FROM ProductMaster pm
        JOIN FETCH pm.category
        LEFT JOIN FETCH pm.variants
        WHERE pm.id = :id
    """)
    Optional<ProductMaster> findByIdWithVariantsAndCategory(@Param("id") Long id);

    /* =========================
       GROUPED PRODUCTS (FINAL FIX)
       ========================= */

    /**
     * Grouped products with case-insensitive category filter.
     * Parameter :category must be pre-lowercased by the service layer.
     * Avoids LOWER(:category) which PostgreSQL can misinterpret as bytea.
     */
    @Query(
            value = """
        SELECT new com.example.groceries.controller.dto.GroupedProductDTO(
            pm.id,
            pm.name,
            pm.imageUrl,
            COALESCE(MAX(v.stock), 0),
            'N/A',
            pm.category.name,
            MIN(v.mrp)
        )
        FROM ProductMaster pm
        JOIN pm.variants v
        WHERE pm.is_active = true
          AND (:category IS NULL OR LOWER(pm.category.name) = :category)
        GROUP BY pm.id, pm.name, pm.imageUrl, pm.category.name
        ORDER BY pm.name ASC
    """,
            countQuery = """
        SELECT COUNT(DISTINCT pm.id)
        FROM ProductMaster pm
        WHERE pm.is_active = true
          AND (:category IS NULL OR LOWER(pm.category.name) = :category)
    """
    )
    Page<GroupedProductDTO> findGroupedProducts(
            @Param("category") String category,
            Pageable pageable
    );

}
