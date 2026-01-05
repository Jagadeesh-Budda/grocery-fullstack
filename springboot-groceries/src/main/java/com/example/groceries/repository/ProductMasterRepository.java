package com.example.groceries.repository;

import com.example.groceries.model.ProductMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductMasterRepository extends JpaRepository<ProductMaster, Long> {
    List<ProductMaster> findByCategoryId(Long categoryId);

    @Query(value = "SELECT DISTINCT pm FROM ProductMaster pm LEFT JOIN FETCH pm.variants",
           countQuery = "SELECT count(DISTINCT pm) FROM ProductMaster pm")
    Page<ProductMaster> findAllWithVariants(Pageable pageable);

    @Query("SELECT pm FROM ProductMaster pm WHERE pm.active = true")
    Page<ProductMaster> findActiveProducts(Pageable pageable);
}
