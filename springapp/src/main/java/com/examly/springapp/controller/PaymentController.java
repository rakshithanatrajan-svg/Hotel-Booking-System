package com.examly.springapp.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.request.PaymentRequest;
import com.examly.springapp.model.Payment;
import com.examly.springapp.service.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping({"/api/payments", "/api/payment"})
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Endpoints for processing and retrieving payments")
public class PaymentController {

    private final PaymentService paymentService;

    // SRS Page 10 Endpoint: POST /api/payment/create-checkout-session & /api/payments/create-order
    @PostMapping({"/create-order", "/create-checkout-session"})
    @Operation(summary = "Create Checkout Session / Order", description = "Integrates with payment gateway to create a checkout session (SRS Page 10)")
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestBody PaymentRequest request) {

        return ResponseEntity.ok(
                paymentService.createRazorpayOrder(request.getBookingId(), request.getAmount()));
    }

    @PostMapping
    @Operation(summary = "Process a payment", description = "Processes a new payment transaction for a room booking")
    public ResponseEntity<Payment> processPayment(
            @RequestBody PaymentRequest request) {

        return new ResponseEntity<>(
                paymentService.processPayment(request),
                HttpStatus.CREATED);
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get payment by booking ID", description = "Fetches payment details associated with a specific booking ID")
    public ResponseEntity<Payment> getPaymentByBooking(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                paymentService.getPaymentByBooking(bookingId));
    }
}