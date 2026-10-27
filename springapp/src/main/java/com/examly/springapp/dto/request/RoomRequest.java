package com.examly.springapp.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomRequest {

    private String roomNumber;
    private String roomType;
    private double price;
    private Integer capacity;
    private Boolean available;

    public RoomRequest(String roomNumber,
                       String roomType,
                       double price,
                       Integer capacity,
                       Boolean available) {

        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.price = price;
        this.capacity = capacity;
        this.available = available;
    }
}