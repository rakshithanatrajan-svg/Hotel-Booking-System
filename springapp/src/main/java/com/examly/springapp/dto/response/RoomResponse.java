package com.examly.springapp.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomResponse {

    private Long roomId;
    private String roomNumber;
    private String roomType;
    private double price;
    private Integer capacity;
    private Boolean available;

    public RoomResponse(Long roomId,
                        String roomNumber,
                        String roomType,
                        double price,
                        Integer capacity,
                        Boolean available) {

        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.price = price;
        this.capacity = capacity;
        this.available = available;
    }
}