package com.greencart.buyer.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.greencart.buyer.dto.AddToCartRequest;
import com.greencart.buyer.dto.CartDTO;
import com.greencart.buyer.dto.CartItemDTO;
import com.greencart.buyer.dto.UpdateCartItemRequest;
import com.greencart.buyer.entities.Cart;
import com.greencart.buyer.entities.CartItem;
import com.greencart.buyer.entities.ProductStock;
import com.greencart.buyer.repositories.CartItemRepository;
import com.greencart.buyer.repositories.CartRepository;
import com.greencart.buyer.repositories.ProductStockRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductStockRepository productStockRepository;

    @Transactional
    public CartDTO addToCart(AddToCartRequest request) {
        ProductStock stock = productStockRepository.findById(request.getStockId())
                .orElseThrow(() -> new RuntimeException("Product stock not found"));

        if (stock.getQuantity() < request.getQuantity().intValue()) {
            throw new RuntimeException("Insufficient stock available");
        }

        Cart cart = cartRepository.findByBuyerId(request.getBuyerId())
                .orElseGet(() -> {
                    Cart newCart = new Cart(request.getBuyerId());
                    return cartRepository.save(newCart);
                });

        Optional<CartItem> existingItem = cartItemRepository
                .findByCart_CartIdAndProductStock_StockId(cart.getCartId(), request.getStockId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            Double newQuantity = item.getQuantity() + request.getQuantity();

            if (stock.getQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock available");
            }

            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(stock.getProduct());
            newItem.setProductStock(stock);
            newItem.setQuantity(request.getQuantity());
            newItem.setUnitPrice(stock.getPrice());
            cartItemRepository.save(newItem);
        }

        return getCartByBuyerId(request.getBuyerId());
    }

    @Transactional(readOnly = true)
    public CartDTO getCartByBuyerId(Integer buyerId) {
        Optional<Cart> cartOpt = cartRepository.findByBuyerId(buyerId);

        if (cartOpt.isEmpty()) {
            CartDTO emptyCart = new CartDTO();
            emptyCart.setBuyerId(buyerId);
            emptyCart.setTotalAmount(0.0);
            emptyCart.setItemCount(0);
            return emptyCart;
        }

        Cart cart = cartOpt.get();
        List<CartItem> items = cartItemRepository.findByCart_CartId(cart.getCartId());

        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartId(cart.getCartId());
        cartDTO.setBuyerId(buyerId);

        List<CartItemDTO> itemDTOs = items.stream().map(this::convertToDTO).collect(Collectors.toList());
        cartDTO.setItems(itemDTOs);
        cartDTO.setItemCount(itemDTOs.size());
        cartDTO.setTotalAmount(itemDTOs.stream().mapToDouble(CartItemDTO::getTotalPrice).sum());

        return cartDTO;
    }

    @Transactional
    public CartItemDTO updateCartItem(Integer cartItemId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (item.getProductStock().getQuantity() < request.getQuantity().intValue()) {
            throw new RuntimeException("Insufficient stock available");
        }

        item.setQuantity(request.getQuantity());
        CartItem updated = cartItemRepository.save(item);

        return convertToDTO(updated);
    }

    @Transactional
    public void removeCartItem(Integer cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new RuntimeException("Cart item not found");
        }
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(Integer buyerId) {
        Optional<Cart> cartOpt = cartRepository.findByBuyerId(buyerId);
        if (cartOpt.isPresent()) {
            cartItemRepository.deleteByCart_CartId(cartOpt.get().getCartId());
        }
    }

    private CartItemDTO convertToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setCartItemId(item.getCartItemId());
        dto.setProductId(item.getProduct().getPid());
        dto.setProductName(item.getProduct().getPname());
        dto.setStockId(item.getProductStock().getStockId());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        dto.setImagePath(item.getProductStock().getImagePath());

        if (item.getProduct().getSubCategory() != null) {
            dto.setSubCategoryName(item.getProduct().getSubCategory().getSubCategoryName());
            if (item.getProduct().getSubCategory().getCategory() != null) {
                dto.setCategoryName(item.getProduct().getSubCategory().getCategory().getCategoryName());
            }
        }

        return dto;
    }
}
