package com.greencart.buyer.dto;

import com.greencart.buyer.entities.PaymentMethod;

public class PlaceOrderRequest {

    private Integer buyerId;
    private PaymentMethod paymentMethod;

    public PlaceOrderRequest() {
    }

    public Integer getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Integer buyerId) {
        this.buyerId = buyerId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
