package com.examly.springapp.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.request.PaymentRequest;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Booking;
import com.examly.springapp.model.Payment;
import com.examly.springapp.repository.BookingRepository;
import com.examly.springapp.repository.PaymentRepository;
import com.examly.springapp.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Value("${razorpay.key.id:rzp_test_1DP5mmOlF5G5ag}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:s8rKz20w3n1ZzX9nN8m6m7lK}")
    private String razorpayKeySecret;

    @Override
    public Map<String, Object> createRazorpayOrder(Long bookingId, double amount) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Map<String, Object> response = new HashMap<>();
        int amountInPaise = (int) Math.round(amount * 100);

        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + booking.getBookingId() + "_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);

            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("keyId", razorpayKeyId);
            response.put("status", "created");
        } catch (Exception e) {
            // Safe fallback if network is offline or dummy credentials used
            response.put("orderId", "order_" + System.currentTimeMillis());
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("keyId", razorpayKeyId);
            response.put("status", "simulated");
        }

        return response;
    }

    @Override
    public Payment processPayment(PaymentRequest request) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(request.getAmount());
        payment.setStatus("SUCCESS");

        String method = request.getPaymentMethod() != null ? request.getPaymentMethod() : "RAZORPAY";
        payment.setPaymentMethod(method);

        String txnId = request.getRazorpayPaymentId() != null
                ? request.getRazorpayPaymentId()
                : "TXN" + System.currentTimeMillis();
        payment.setTransactionId(txnId);
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentByBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        return paymentRepository.findByBooking(booking)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found"));
    }
}