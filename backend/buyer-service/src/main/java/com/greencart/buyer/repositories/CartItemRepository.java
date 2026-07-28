package com.greencart.buyer.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greencart.buyer.entities.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    /**
     * Find all cart items for a specific cart
     */
    List<CartItem> findByCart_CartId(Integer cartId);

    /**
     * Find a specific cart item by cart and product stock
     */
    Optional<CartItem> findByCart_CartIdAndProductStock_StockId(Integer cartId, Integer stockId);

    /**
     * Delete all cart items for a specific cart
     */
    void deleteByCart_CartId(Integer cartId);

    /**
     * Count items in a cart
     */
    long countByCart_CartId(Integer cartId);
}
