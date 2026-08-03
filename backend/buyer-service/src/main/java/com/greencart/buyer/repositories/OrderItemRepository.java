package com.greencart.buyer.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greencart.buyer.entities.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    /**
     * Find all order items for a specific order
     */
    List<OrderItem> findByOrder_OrderId(Integer orderId);
}
