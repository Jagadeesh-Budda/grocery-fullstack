package com.example.groceries.repository;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.model.ProductMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductMasterRepository extends JpaRepository<ProductMaster, Long> {

    /* ======================
       EXISTING (KEEP AS-IS)
       ====================== */

    List<ProductMaster> findByCategoryId(Long categoryId);

    @Query(
            value = "SELECT DISTINCT pm FROM ProductMaster pm LEFT JOIN FETCH pm.variants",
            countQuery = "SELECT count(DISTINCT pm) FROM ProductMaster pm"
    )
    Page<ProductMaster> findAllWithVariants(Pageable pageable);

    @Query("SELECT pm FROM ProductMaster pm WHERE pm.active = true")
    Page<ProductMaster> findActiveProducts(Pageable pageable);

    Page<ProductMaster> findByCategoryNameIgnoreCase(String categoryName, Pageable pageable);

    /* ======================
       ✅ SHOPPING LIST (NEW)
       ====================== */

    @Query(
            value = """
            SELECT new com.example.groceries.controller.dto.GroupedProductDTO(
                pm.id,
                pm.name,
                pm.imageUrl,
                MIN(v.mrp)
            )
            FROM ProductMaster pm
            JOIN pm.variants v
            WHERE pm.active = true
            AND (:category IS NULL OR LOWER(pm.category.name) = LOWER(:category))
            GROUP BY pm.id, pm.name, pm.imageUrl
        """,
            countQuery = """
            SELECT COUNT(DISTINCT pm.id)
            FROM ProductMaster pm
            JOIN pm.variants v
            WHERE pm.active = true
            AND (:category IS NULL OR LOWER(pm.category.name) = LOWER(:category))
        """
    )
    Page<GroupedProductDTO> findGroupedProducts(
            @org.springframework.data.repository.query.Param("category") String category,
            Pageable pageable
    );

}
