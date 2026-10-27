package com.examly.springapp.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.dto.request.BookingRequest;
import com.examly.springapp.exception.BadRequestException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Booking;
import com.examly.springapp.model.BookingStatus;
import com.examly.springapp.model.Room;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.BookingRepository;
import com.examly.springapp.repository.RoomRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.BookingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    @Override
    public Booking bookRoom(BookingRequest request) {

        // Validate email format
        if (request.getGuestEmail() == null || !request.getGuestEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new BadRequestException("Invalid email format");
        }

        // Validate date order
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null
                || !request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        // Check if room exists
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        // Check room availability
        if (room.getAvailable() == null || !room.getAvailable()) {
            throw new BadRequestException("Room is not available");
        }

        // Optional User mapping if userId is passed
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setGuestName(request.getGuestName());
        booking.setGuestEmail(request.getGuestEmail());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());

        long days = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (days <= 0) days = 1;

        booking.setTotalPrice(days * room.getPrice());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found with id: " + id));
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return bookingRepository.findByUser(user);
    }

    @Override
    public Booking updateBookingStatus(Long bookingId, String status) {

        if (status == null || (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED")
                && !status.equalsIgnoreCase("CONFIRMED") && !status.equalsIgnoreCase("CANCELLED")
                && !status.equalsIgnoreCase("PENDING"))) {
            throw new BadRequestException("Invalid status: " + status);
        }

        Booking booking = getBookingById(bookingId);
        BookingStatus newStatus;
        try {
            newStatus = BookingStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        booking.setStatus(newStatus);

        Room room = booking.getRoom();
        if (room != null) {
            if (newStatus == BookingStatus.APPROVED || newStatus == BookingStatus.CONFIRMED) {
                room.setAvailable(false);
                roomRepository.save(room);
            } else if (newStatus == BookingStatus.REJECTED || newStatus == BookingStatus.CANCELLED) {
                room.setAvailable(true);
                roomRepository.save(room);
            }
        }

        return bookingRepository.save(booking);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(BookingStatus.CANCELLED);

        Room room = booking.getRoom();
        if (room != null) {
            room.setAvailable(true);
            roomRepository.save(room);
        }

        bookingRepository.save(booking);
    }
}