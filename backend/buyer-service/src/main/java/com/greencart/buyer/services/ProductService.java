package com.greencart.buyer.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.greencart.buyer.entities.ProductStock;
import com.greencart.buyer.repositories.ProductStockRepository;

@Service
public class ProductService {

    @Autowired
    private ProductStockRepository productStockRepository;

    /**
     * Get all available products with stock information
     * Returns a list of product data with category, subcategory, price, quantity,
     * and image
     */
    public List<Map<String, Object>> getAllAvailableProducts() {
        List<ProductStock> stockList = productStockRepository.findAllAvailableStock();
        List<Map<String, Object>> productList = new ArrayList<>();

        for (ProductStock stock : stockList) {
            Map<String, Object> productData = new HashMap<>();

            // Product basic info
            productData.put("stockId", stock.getStockId());
            productData.put("productId", stock.getProduct().getPid());
            productData.put("productName", stock.getProduct().getPname());
            productData.put("description", stock.getProduct().getDescription());

            // Stock info
            productData.put("price", stock.getPrice());
            productData.put("quantity", stock.getQuantity());
            productData.put("sellerId", stock.getSellerId());
            productData.put("imagePath", stock.getImagePath());

            // Category info
            if (stock.getProduct().getSubCategory() != null) {
                productData.put("subCategoryId", stock.getProduct().getSubCategory().getSubCategoryId());
                productData.put("subCategoryName", stock.getProduct().getSubCategory().getSubCategoryName());

                if (stock.getProduct().getSubCategory().getCategory() != null) {
                    productData.put("categoryId", stock.getProduct().getSubCategory().getCategory().getCategoryId());
                    productData.put("categoryName",
                            stock.getProduct().getSubCategory().getCategory().getCategoryName());
                }
            }

            productList.add(productData);
        }

        return productList;
    }
}
