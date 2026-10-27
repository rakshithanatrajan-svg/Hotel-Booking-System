package com.examly.springapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.request.BookingRequest;
import com.examly.springapp.dto.response.StatusUpdateRequest;
import com.examly.springapp.model.Booking;
import com.examly.springapp.service.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Endpoints for managing hotel room bookings")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Book a room", description = "Creates a new room booking reservation")
    public ResponseEntity<Booking> bookRoom(
            @RequestBody BookingRequest request) {

        return new ResponseEntity<>(
                bookingService.bookRoom(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all bookings", description = "Fetches a list of all room bookings in the system")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID", description = "Fetches details of a specific booking by its ID")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get bookings by user", description = "Fetches all bookings made by a specific user using their user ID")
    public ResponseEntity<List<Booking>> getBookingsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByUser(userId));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update booking status", description = "Changes the status of an existing booking (e.g., CONFIRMED, CANCELLED, PENDING)")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {

        return ResponseEntity.ok(
                bookingService.updateBookingStatus(
                        id,
                        request.getStatus()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel a booking", description = "Cancels a room reservation by booking ID")
    public ResponseEntity<String> cancelBooking(
            @PathVariable Long id) {

        bookingService.cancelBooking(id);

        return ResponseEntity.ok("Booking cancelled successfully");
    }
}