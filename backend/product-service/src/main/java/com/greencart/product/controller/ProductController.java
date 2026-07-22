package com.greencart.product.controller;

import com.greencart.product.dto.ProductRequestDTO;
import com.greencart.product.dto.ProductResponseDTO;
import com.greencart.product.entities.Product;
import com.greencart.product.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private final ProductService productService;

    // Constructor Injection (Recommended)
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Create a new product with stock information
     * Extracts sellerId from request header (set by JWT filter)
     */
    @PostMapping("/create")
    public ResponseEntity<?> createProduct(
            @Validated @RequestBody ProductRequestDTO request,
            @RequestHeader(value = "X-User-Id", required = false) Integer sellerId) {

        if (sellerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Seller ID not found. Please login.");
        }

        try {
            ProductResponseDTO response = productService.createProduct(request, sellerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Get all products for a specific seller
     */
    @GetMapping("/seller")
    public ResponseEntity<List<ProductResponseDTO>> getSellerProducts(
            @RequestHeader(value = "X-User-Id", required = false) Integer sellerId) {

        System.out.println("DEBUG: ProductController.getSellerProducts called with X-User-Id: " + sellerId);

        if (sellerId == null) {
            System.out.println("DEBUG: sellerId is NULL, returning 401");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ProductResponseDTO> products = productService.getProductsBySeller(sellerId);
        return ResponseEntity.ok(products);
    }

    /**
     * Update an existing product
     */
    @PutMapping("/update/{productId}")
    public ResponseEntity<?> updateProduct(
            @PathVariable int productId,
            @Validated @RequestBody ProductRequestDTO request,
            @RequestHeader(value = "X-User-Id", required = false) Integer sellerId) {

        if (sellerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Seller ID not found. Please login.");
        }

        try {
            ProductResponseDTO response = productService.updateProduct(productId, request, sellerId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /* Legacy endpoints (keep for backward compatibility) */
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable int id) {
        return productService.getProductById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        return "Product deleted successfully";
    }
}
