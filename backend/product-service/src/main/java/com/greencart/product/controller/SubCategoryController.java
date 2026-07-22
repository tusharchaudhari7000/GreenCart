package com.greencart.product.controller;

import com.greencart.product.entities.SubCategory;
import com.greencart.product.service.SubCategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    public SubCategoryController(SubCategoryService subCategoryService) {
        this.subCategoryService = subCategoryService;
    }

    @PostMapping
    public SubCategory addSubCategory(@RequestBody SubCategory subCategory) {
        return subCategoryService.addSubCategory(subCategory);
    }

    @GetMapping
    public List<SubCategory> getAllSubCategories() {
        return subCategoryService.getAllSubCategories();
    }

    @GetMapping("/category/{categoryId}")
    public List<SubCategory> getSubCategoriesByCategoryId(@PathVariable int categoryId) {
        return subCategoryService.getSubCategoriesByCategoryId(categoryId);
    }

    @GetMapping("/{id}")
    public SubCategory getSubCategoryById(@PathVariable int id) {
        return subCategoryService.getSubCategoryById(id);
    }
}
