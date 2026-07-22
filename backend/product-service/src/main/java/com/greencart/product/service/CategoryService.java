package com.greencart.product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.greencart.product.entities.Category;
import com.greencart.product.repository.CategoryRepository;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        // Return only ACTIVE categories (or null status for backward compatibility)
        return categoryRepository.findByStatusOrStatusIsNull("ACTIVE");
    }

    public Category getCategoryById(int id) {
        return categoryRepository.findById(id).orElse(null);
    }
}
