package com.greencart.product.service;

import com.greencart.product.entities.ProductStock;
import com.greencart.product.repository.ProductStockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    private final ProductStockRepository stockRepository = null;

    public ProductStock addStock(ProductStock stock) {
        return stockRepository.save(stock);
    }

    public List<ProductStock> getStockBySeller(int sellerId) {
        return stockRepository.findBySellerId(sellerId);
    }

    public List<ProductStock> getAllStock() {
        return stockRepository.findAll();
    }
}
