package com.greencart.product.controller;

import com.greencart.product.entities.ProductStock;
import com.greencart.product.service.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stocks")
public class StockController {

    private final StockService stockService;

    // Constructor Injection
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping
    public ProductStock addStock(@RequestBody ProductStock stock) {
        return stockService.addStock(stock);
    }

    @GetMapping("/seller/{sellerId}")
    public List<ProductStock> getStockBySeller(@PathVariable int sellerId) {
        return stockService.getStockBySeller(sellerId);
    }

    @GetMapping
    public List<ProductStock> getAllStock() {
        return stockService.getAllStock();
    }
}
