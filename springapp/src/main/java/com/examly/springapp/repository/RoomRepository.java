package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByAvailable(Boolean available);

    List<Room> findByRoomType(String roomType);

    List<Room> findByCapacityGreaterThanEqual(Integer capacity);
}