package com.examly.springapp.dto.request;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BookingRequest {

    private Long userId;

    private Long roomId;

    private String guestName;

    private String guestEmail;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;
}