package com.greencart.product.service;

import com.greencart.product.dto.ProductRequestDTO;
import com.greencart.product.dto.ProductResponseDTO;
import com.greencart.product.entities.Product;
import com.greencart.product.entities.ProductStock;
import com.greencart.product.entities.SubCategory;
import com.greencart.product.repository.ProductRepository;
import com.greencart.product.repository.ProductStockRepository;
import com.greencart.product.repository.SubCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductStockRepository productStockRepository;
    private final SubCategoryRepository subCategoryRepository;

    public ProductService(ProductRepository productRepository,
            ProductStockRepository productStockRepository,
            SubCategoryRepository subCategoryRepository) {
        this.productRepository = productRepository;
        this.productStockRepository = productStockRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO request, int sellerId) {
        // Validate subcategory exists
        SubCategory subCategory = subCategoryRepository.findById(request.getSubCategoryId())
                .orElseThrow(
                        () -> new RuntimeException("Subcategory not found with ID: " + request.getSubCategoryId()));

        // Create Product entity
        Product product = new Product();
        product.setPname(subCategory.getSubCategoryName()); // Product name = subcategory name
        product.setDescription(request.getDescription());
        product.setSubCategory(subCategory);

        // Save product
        Product savedProduct = productRepository.save(product);

        // Create ProductStock entity
        ProductStock stock = new ProductStock();
        stock.setProduct(savedProduct);
        stock.setSellerId(sellerId);
        stock.setPrice(request.getPrice());
        stock.setQuantity(request.getQuantity());
        stock.setImagePath(request.getImageUrl());
        stock.setCreated_at(LocalDateTime.now());

        // Save stock
        ProductStock savedStock = productStockRepository.save(stock);

        // Build response DTO
        return buildProductResponseDTO(savedProduct, savedStock, subCategory);
    }

    public List<ProductResponseDTO> getProductsBySeller(int sellerId) {
        List<ProductStock> stocks = productStockRepository.findBySellerId(sellerId);
        List<ProductResponseDTO> response = new ArrayList<>();

        for (ProductStock stock : stocks) {
            Product product = stock.getProduct();
            SubCategory subCategory = product.getSubCategory();
            response.add(buildProductResponseDTO(product, stock, subCategory));
        }

        return response;
    }

    @Transactional
    public ProductResponseDTO updateProduct(int productId, ProductRequestDTO request, int sellerId) {
        // Find the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // Find the stock entry for this product and seller
        ProductStock stock = productStockRepository.findByProductAndSellerId(product, sellerId)
                .orElseThrow(() -> new RuntimeException("You are not authorized to update this product"));

        // Validate subcategory exists
        SubCategory subCategory = subCategoryRepository.findById(request.getSubCategoryId())
                .orElseThrow(
                        () -> new RuntimeException("Subcategory not found with ID: " + request.getSubCategoryId()));

        // Update Product entity
        product.setPname(subCategory.getSubCategoryName());
        product.setDescription(request.getDescription());
        product.setSubCategory(subCategory);

        // Save updated product
        Product updatedProduct = productRepository.save(product);

        // Update ProductStock entity
        stock.setPrice(request.getPrice());
        stock.setQuantity(request.getQuantity());
        stock.setImagePath(request.getImageUrl());

        // Save updated stock
        ProductStock updatedStock = productStockRepository.save(stock);

        // Build response DTO
        return buildProductResponseDTO(updatedProduct, updatedStock, subCategory);
    }

    private ProductResponseDTO buildProductResponseDTO(Product product, ProductStock stock, SubCategory subCategory) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setPid(product.getPid());
        dto.setPname(product.getPname());
        dto.setDescription(product.getDescription());
        dto.setSubCategoryId(subCategory.getSubCategoryId());
        dto.setSubCategoryName(subCategory.getSubCategoryName());
        dto.setCategoryId(subCategory.getCategory().getCategoryId());
        dto.setCategoryName(subCategory.getCategory().getCategoryName());
        dto.setStockId(stock.getStockId());
        dto.setPrice(stock.getPrice());
        dto.setQuantity(stock.getQuantity());
        dto.setImagePath(stock.getImagePath());
        dto.setCreatedAt(stock.getCreated_at());
        return dto;
    }

    // Legacy methods (keep for backward compatibility)
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(int id) {
        return productRepository.findById(id).orElse(null);
    }

    @Transactional
    public void deleteProduct(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        // 1. Delete all stock entries (this hides it from marketplace and farmer view)
        try {
            productStockRepository.deleteByProduct(product);
            productStockRepository.flush(); // Force immediate deletion
        } catch (Exception e) {
            throw new RuntimeException("Could not remove product from marketplace: " + e.getMessage());
        }

        // 2. Try to delete the product template (optional, might fail if ordered)
        try {
            productRepository.delete(product);
        } catch (Exception e) {
            // Log and ignore - the product metadata stays for order history,
            // but marketplace visibility is gone because stock was deleted.
            System.out.println("Product metadata kept for history (id: " + id + ")");
        }
    }
}
