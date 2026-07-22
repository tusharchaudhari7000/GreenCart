package com.greencart.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greencart.product.entities.Category;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByStatusOrStatusIsNull(String status);
}
