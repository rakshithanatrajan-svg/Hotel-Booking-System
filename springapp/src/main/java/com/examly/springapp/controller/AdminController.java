package com.examly.springapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.request.RoomRequest;
import com.examly.springapp.dto.response.StatusUpdateRequest;
import com.examly.springapp.model.Booking;
import com.examly.springapp.model.Room;
import com.examly.springapp.service.BookingService;
import com.examly.springapp.service.RoomService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Endpoints restricted to users with ADMIN role")
public class AdminController {

    private final RoomService roomService;
    private final BookingService bookingService;

    @GetMapping("/dashboard")
    @Operation(summary = "Admin dashboard message", description = "Returns a welcome message for authenticated administrators")
    public ResponseEntity<String> dashboard() {
        return ResponseEntity.ok("Welcome Admin");
    }

    @GetMapping("/health")
    @Operation(summary = "Application health status", description = "Checks and returns the running health status of the application")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Application is running successfully");
    }

    // SRS Page 10 Endpoint: GET /api/admin/rooms
    @GetMapping("/rooms")
    @Operation(summary = "Get all rooms for admin", description = "Retrieves all rooms for administrative management")
    public ResponseEntity<List<Room>> getAllRoomsForAdmin() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // SRS Page 10 Endpoint: POST /api/admin/rooms
    @PostMapping("/rooms")
    @Operation(summary = "Create room as admin", description = "Creates a new room in the system")
    public ResponseEntity<Room> createRoomByAdmin(@RequestBody RoomRequest request) {
        return new ResponseEntity<>(roomService.addRoom(request), HttpStatus.CREATED);
    }

    // SRS Page 10 Endpoint: PUT /api/admin/rooms/{id}
    @PutMapping("/rooms/{id}")
    @Operation(summary = "Update room as admin", description = "Updates the details of an existing room")
    public ResponseEntity<Room> updateRoomByAdmin(
            @PathVariable Long id,
            @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    // SRS Page 10 Endpoint: DELETE /api/admin/rooms/{id}
    @DeleteMapping("/rooms/{id}")
    @Operation(summary = "Delete room as admin", description = "Deletes an existing room by ID")
    public ResponseEntity<String> deleteRoomByAdmin(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Room deleted successfully");
    }

    // SRS Page 10 Endpoint: GET /api/admin/bookings
    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings for admin", description = "Retrieves a list of all bookings in the system")
    public ResponseEntity<List<Booking>> getAllBookingsForAdmin() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // SRS Page 10 Endpoint: PUT /api/admin/bookings/{id}/status
    @PutMapping("/bookings/{id}/status")
    @Operation(summary = "Update booking status as admin", description = "Allows an ADMIN to update the status of a booking")
    public ResponseEntity<Booking> updateBookingStatusByAdmin(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request.getStatus()));
    }
}