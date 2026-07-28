package com.greencart.buyer.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.greencart.buyer.entities.ProductStock;

@Repository
public interface ProductStockRepository extends JpaRepository<ProductStock, Integer> {

    /**
     * Find all stock entries for a product
     */
    List<ProductStock> findByProduct_Pid(Integer productId);

    // Find all stock with quantity greater than 0
    @Query("SELECT ps FROM ProductStock ps WHERE ps.quantity > 0")
    List<ProductStock> findAllAvailableStock();

    // Find stock by seller ID
    List<ProductStock> findBySellerId(int sellerId);
}
