package com.greencart.product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.greencart.product.entities.SubCategory;
import com.greencart.product.repository.SubCategoryRepository;

import java.util.List;

@Service
public class SubCategoryService {

    @Autowired
    private final SubCategoryRepository subCategoryRepository;

    public SubCategoryService(SubCategoryRepository subCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    public SubCategory addSubCategory(SubCategory subCategory) {
        return subCategoryRepository.save(subCategory);
    }

    public List<SubCategory> getAllSubCategories() {
        // Return only ACTIVE subcategories (or null status for backward compatibility)
        return subCategoryRepository.findByStatusOrStatusIsNull("ACTIVE");
    }

    public List<SubCategory> getSubCategoriesByCategoryId(int categoryId) {
        // Return only ACTIVE subcategories for the given category
        return subCategoryRepository.findByCategory_CategoryIdAndStatusOrStatusIsNull(categoryId, "ACTIVE");
    }

    public SubCategory getSubCategoryById(int id) {
        return subCategoryRepository.findById(id).orElse(null);
    }
}
