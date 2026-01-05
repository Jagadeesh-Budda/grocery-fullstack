package com.example.groceries.repository;

import com.example.groceries.model.ProductVariant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    /* =========================
       ACTIVE PRODUCTS FOR USER SHOP
       (FILTER VIA PRODUCT MASTER)
       ========================= */
    @Query("""
        SELECT v FROM ProductVariant v
        WHERE v.productMaster.active = true
    """)
    Page<ProductVariant> findActiveVariants(Pageable pageable);
}
