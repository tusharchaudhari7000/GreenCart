package com.greencart.buyer.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greencart.buyer.entities.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    /**
     * Find payment by order ID
     */
    Optional<Payment> findByOrder_OrderId(Integer orderId);

    /**
     * Find payment by bill number
     */
    Optional<Payment> findByBillNumber(String billNumber);
}
