package com.examly.springapp.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.dto.request.RoomRequest;
import com.examly.springapp.dto.response.RoomResponse;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Room;
import com.examly.springapp.repository.RoomRepository;
import com.examly.springapp.service.RoomService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public Room addRoom(RoomRequest request) {

        Room room = new Room();

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setAvailable(request.getAvailable());

        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(Long id, RoomRequest request) {

        Room room = getRoomById(id);

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setAvailable(request.getAvailable());

        return roomRepository.save(room);
    }

    @Override
    public void deleteRoom(Long id) {

        Room room = getRoomById(id);

        roomRepository.delete(room);
    }

    @Override
    public Room getRoomById(Long id) {

        return roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found with id: " + id));
    }

    @Override
    public List<Room> getAllRooms() {

        return roomRepository.findAll();
    }

    @Override
    public List<Room> getAvailableRooms() {

        return roomRepository.findByAvailable(true);
    }

    @Override
    public List<RoomResponse> searchRooms(String roomType,
                                          Integer capacity,
                                          Double minPrice,
                                          Double maxPrice) {

        List<RoomResponse> result = new ArrayList<>();

        for (Room room : roomRepository.findAll()) {

            boolean match = true;

            if (roomType != null &&
                    !room.getRoomType().equalsIgnoreCase(roomType))
                match = false;

            if (capacity != null &&
                    room.getCapacity() < capacity)
                match = false;

            if (minPrice != null &&
                    room.getPrice() < minPrice)
                match = false;

            if (maxPrice != null &&
                    room.getPrice() > maxPrice)
                match = false;

            if (match) {

                result.add(new RoomResponse(
                        room.getRoomId(),
                        room.getRoomNumber(),
                        room.getRoomType(),
                        room.getPrice(),
                        room.getCapacity(),
                        room.getAvailable()));
            }
        }

        return result;
    }
}