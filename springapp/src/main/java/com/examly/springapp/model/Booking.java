package com.examly.springapp.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    private String guestName;

    private String guestEmail;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // 10-arg constructor with User & BookingStatus
    public Booking(Long bookingId,
                   User user,
                   Room room,
                   String guestName,
                   String guestEmail,
                   LocalDate checkInDate,
                   LocalDate checkOutDate,
                   Double totalPrice,
                   BookingStatus status,
                   LocalDateTime createdAt) {

        this.bookingId = bookingId;
        this.user = user;
        this.room = room;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // 9-arg constructor with BookingStatus
    public Booking(Long bookingId,
                   Room room,
                   String guestName,
                   String guestEmail,
                   LocalDate checkInDate,
                   LocalDate checkOutDate,
                   Double totalPrice,
                   BookingStatus status,
                   LocalDateTime createdAt) {

        this.bookingId = bookingId;
        this.room = room;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // 9-arg constructor with String status (used in BookingControllerTest)
    public Booking(Long bookingId,
                   Room room,
                   String guestName,
                   String guestEmail,
                   LocalDate checkInDate,
                   LocalDate checkOutDate,
                   Double totalPrice,
                   String status,
                   LocalDateTime createdAt) {

        this.bookingId = bookingId;
        this.room = room;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.totalPrice = totalPrice;
        if (status != null) {
            try {
                this.status = BookingStatus.valueOf(status.toUpperCase());
            } catch (Exception e) {
                this.status = BookingStatus.PENDING;
            }
        }
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }
}