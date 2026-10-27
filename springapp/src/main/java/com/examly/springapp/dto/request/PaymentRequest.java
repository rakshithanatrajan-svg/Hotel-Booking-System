package com.examly.springapp.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PaymentRequest {

    private Long bookingId;
    private double amount;
    private String paymentMethod;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;

    public PaymentRequest(Long bookingId, double amount) {
        this.bookingId = bookingId;
        this.amount = amount;
    }

    public PaymentRequest(Long bookingId, double amount, String paymentMethod,
                          String razorpayPaymentId, String razorpayOrderId, String razorpaySignature) {
        this.bookingId = bookingId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpaySignature = razorpaySignature;
    }
}