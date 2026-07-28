package com.greencart.buyer.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greencart.buyer.dto.OrderDTO;
import com.greencart.buyer.dto.PaymentDTO;
import com.greencart.buyer.entities.PaymentStatus;
import com.greencart.buyer.services.OrderService;

@RestController
@RequestMapping("/api/farmer/orders")
public class FarmerOrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Get all orders containing products sold by a specific farmer/seller
     * GET /api/farmer/orders/seller/{sellerId}
     */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<?> getOrdersBySeller(@PathVariable Integer sellerId) {
        try {
            List<OrderDTO> orders = orderService.getOrdersBySeller(sellerId);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Update payment status (PENDING -> SUCCESS)
     * PATCH /api/farmer/orders/payment/{paymentId}/status
     */
    @PatchMapping("/payment/{paymentId}/status")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Integer paymentId,
            @RequestBody PaymentStatusUpdateRequest request) {
        try {
            PaymentDTO payment = orderService.updatePaymentStatus(paymentId, request.getPaymentStatus());
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Request DTO for payment status update
    static class PaymentStatusUpdateRequest {
        private PaymentStatus paymentStatus;

        public PaymentStatus getPaymentStatus() {
            return paymentStatus;
        }

        public void setPaymentStatus(PaymentStatus paymentStatus) {
            this.paymentStatus = paymentStatus;
        }
    }

    // Error response DTO
    static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
    }
}
