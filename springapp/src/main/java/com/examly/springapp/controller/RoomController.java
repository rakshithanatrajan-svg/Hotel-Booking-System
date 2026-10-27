package com.examly.springapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.request.RoomRequest;
import com.examly.springapp.dto.response.RoomResponse;
import com.examly.springapp.model.Room;
import com.examly.springapp.service.RoomService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Rooms", description = "Endpoints for managing rooms, availability, and searching rooms")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    @Operation(summary = "Add a new room", description = "Adds a new room to the hotel system (Requires authentication)")
    public ResponseEntity<Room> addRoom(@RequestBody RoomRequest request) {
        return new ResponseEntity<>(roomService.addRoom(request), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all rooms", description = "Fetches a list of all registered rooms in the hotel")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room by ID", description = "Fetches details of a specific room using its ID")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update room details", description = "Modifies details of an existing room using its ID")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long id,
            @RequestBody RoomRequest request) {

        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a room", description = "Removes a room from the system using its ID")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {

        roomService.deleteRoom(id);

        return ResponseEntity.ok("Room deleted successfully");
    }

    @GetMapping("/available")
    @Operation(summary = "Get available rooms", description = "Fetches all rooms that are currently marked as available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @GetMapping("/search")
    @Operation(summary = "Search and filter rooms", description = "Searches for rooms by type, capacity, minimum price, and maximum price")
    public ResponseEntity<List<RoomResponse>> searchRooms(

            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        return ResponseEntity.ok(
                roomService.searchRooms(
                        roomType,
                        capacity,
                        minPrice,
                        maxPrice));
    }
}