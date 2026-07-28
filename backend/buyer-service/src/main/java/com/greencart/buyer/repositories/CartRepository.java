package com.greencart.buyer.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greencart.buyer.entities.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    /**
     * Find cart by buyer ID
     */
    Optional<Cart> findByBuyerId(Integer buyerId);

    /**
     * Check if cart exists for a buyer
     */
    boolean existsByBuyerId(Integer buyerId);
}
