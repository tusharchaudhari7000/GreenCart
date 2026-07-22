package com.greencart.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greencart.product.entities.SubCategory;

import java.util.List;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Integer> {

    List<SubCategory> findByCategory_CategoryId(int categoryId);

    List<SubCategory> findByStatusOrStatusIsNull(String status);

    List<SubCategory> findByCategory_CategoryIdAndStatusOrStatusIsNull(int categoryId, String status);
}
