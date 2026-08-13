package com.greencart.buyer.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.greencart.buyer.entities.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    /**
     * Find all orders by buyer ID, ordered by date descending
     */
    List<Order> findByBuyerIdOrderByOrderDateDesc(Integer buyerId);

    /**
     * Find orders by buyer ID
     */
    List<Order> findByBuyerId(Integer buyerId);

    /**
     * Find all orders containing products for a specific seller
     */
    @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN o.orderItems oi " +
            "WHERE oi.product.pid IN (" +
            "  SELECT ps.product.pid FROM ProductStock ps WHERE ps.sellerId = :sellerId" +
            ") " +
            "ORDER BY o.orderDate DESC")
    List<Order> findOrdersBySellerId(@Param("sellerId") Integer sellerId);
}
