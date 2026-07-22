package com.greencart.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greencart.product.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}
