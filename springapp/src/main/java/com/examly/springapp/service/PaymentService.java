package com.examly.springapp.service;

import java.util.Map;

import com.examly.springapp.dto.request.PaymentRequest;
import com.examly.springapp.model.Payment;

public interface PaymentService {

    Payment processPayment(PaymentRequest request);

    Payment getPaymentByBooking(Long bookingId);

    Map<String, Object> createRazorpayOrder(Long bookingId, double amount);
}