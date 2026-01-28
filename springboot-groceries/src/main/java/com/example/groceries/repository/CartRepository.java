package com.example.groceries.repository;

import com.example.groceries.model.Cart;
import com.example.groceries.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(Long userId);
    Optional<Cart> findByUser(User user);
    void deleteByUserId(Long userId);

}
