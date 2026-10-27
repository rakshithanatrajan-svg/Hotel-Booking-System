package com.examly.springapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    private Double amount;

    private String transactionId;

    private String paymentMethod;

    private String status;

    private LocalDateTime paymentDate;

    public Payment(Long paymentId,
                   Booking booking,
                   Double amount,
                   String transactionId,
                   String paymentMethod,
                   String status,
                   LocalDateTime paymentDate) {
        this.paymentId = paymentId;
        this.booking = booking;
        this.amount = amount;
        this.transactionId = transactionId;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.paymentDate = paymentDate;
    }
}