package com.greencart.buyer.dto;

public class UpdateCartItemRequest {

    private Double quantity;

    public UpdateCartItemRequest() {
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }
}
