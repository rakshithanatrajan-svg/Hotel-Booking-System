package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.dto.request.BookingRequest;
import com.examly.springapp.model.Booking;

public interface BookingService {

    Booking bookRoom(BookingRequest request);

    Booking getBookingById(Long id);

    List<Booking> getAllBookings();

    List<Booking> getBookingsByUser(Long userId);

    Booking updateBookingStatus(Long bookingId, String status);

    void cancelBooking(Long bookingId);
}