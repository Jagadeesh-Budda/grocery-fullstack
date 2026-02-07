package com.example.groceries.repository;

import com.example.groceries.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCodeIgnoreCase(String code);

    @Modifying
    @Query("""
        UPDATE Coupon c
        SET c.timesUsed = c.timesUsed + 1
        WHERE c.id = :couponId
          AND (c.usageLimit IS NULL OR c.timesUsed < c.usageLimit)
    """)
    int incrementTimesUsedIfAvailable(@Param("couponId") Long couponId);
}
