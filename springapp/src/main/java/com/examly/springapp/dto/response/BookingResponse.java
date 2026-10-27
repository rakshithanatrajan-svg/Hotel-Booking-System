package com.examly.springapp.dto.response;

import java.time.LocalDate;

import com.examly.springapp.model.BookingStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BookingResponse {

    private Long bookingId;
    private String roomNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private double totalPrice;
    private BookingStatus status;

    public BookingResponse(Long bookingId,
                           String roomNumber,
                           LocalDate checkInDate,
                           LocalDate checkOutDate,
                           double totalPrice,
                           BookingStatus status) {

        this.bookingId = bookingId;
        this.roomNumber = roomNumber;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.totalPrice = totalPrice;
        this.status = status;
    }
}