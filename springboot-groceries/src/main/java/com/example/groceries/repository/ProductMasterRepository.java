package com.example.groceries.repository;

import com.example.groceries.model.ProductMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductMasterRepository extends JpaRepository<ProductMaster, Long> {
    List<ProductMaster> findByCategoryId(Long categoryId);
}
