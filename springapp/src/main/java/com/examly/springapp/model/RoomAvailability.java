package com.examly.springapp.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class RoomAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long availabilityId;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    private LocalDate date;

    private Boolean available;

    public RoomAvailability(Long availabilityId, Room room,
                            LocalDate date, Boolean available) {
        this.availabilityId = availabilityId;
        this.room = room;
        this.date = date;
        this.available = available;
    }
}
