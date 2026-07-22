package com.greencart.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greencart.product.entities.Product;
import com.greencart.product.entities.ProductStock;

import java.util.List;
import java.util.Optional;

public interface ProductStockRepository extends JpaRepository<ProductStock, Integer> {

    List<ProductStock> findBySellerId(int sellerId);

    Optional<ProductStock> findByProductAndSellerId(Product product, int sellerId);

    void deleteByProduct(Product product);
}
