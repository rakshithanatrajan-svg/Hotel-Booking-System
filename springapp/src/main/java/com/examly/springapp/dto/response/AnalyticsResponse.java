package com.examly.springapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private long totalUsers;
    private long totalRooms;
    private long availableRooms;
    private long totalBookings;
    private double totalRevenue;
}