package com.examly.springapp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Room;
import com.examly.springapp.model.RoomAvailability;

@Repository
public interface RoomAvailabilityRepository extends JpaRepository<RoomAvailability, Long> {

    List<RoomAvailability> findByRoom(Room room);

    List<RoomAvailability> findByDate(LocalDate date);

    List<RoomAvailability> findByRoomAndDate(Room room, LocalDate date);
}
