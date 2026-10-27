package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.dto.request.RoomRequest;
import com.examly.springapp.dto.response.RoomResponse;
import com.examly.springapp.model.Room;

public interface RoomService {

    Room addRoom(RoomRequest request);

    Room updateRoom(Long id, RoomRequest request);

    void deleteRoom(Long id);

    Room getRoomById(Long id);

    List<Room> getAllRooms();

    List<Room> getAvailableRooms();

    List<RoomResponse> searchRooms(String roomType,
                                   Integer capacity,
                                   Double minPrice,
                                   Double maxPrice);
}