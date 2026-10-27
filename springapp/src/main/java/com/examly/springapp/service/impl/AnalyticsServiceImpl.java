package com.examly.springapp.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.dto.response.AnalyticsResponse;
import com.examly.springapp.model.Booking;
import com.examly.springapp.model.Room;
import com.examly.springapp.repository.BookingRepository;
import com.examly.springapp.repository.RoomRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.AnalyticsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    @Override
    public AnalyticsResponse getDashboardAnalytics() {

        long totalUsers = userRepository.count();
        long totalRooms = roomRepository.count();
        long totalBookings = bookingRepository.count();

        long availableRooms = roomRepository.findByAvailable(true).size();

        double revenue = 0;

        List<Booking> bookings = bookingRepository.findAll();

        for (Booking booking : bookings) {
            if (booking.getTotalPrice() != null) {
                revenue += booking.getTotalPrice();
            }
        }

        AnalyticsResponse response = new AnalyticsResponse();

        response.setTotalUsers(totalUsers);
        response.setTotalRooms(totalRooms);
        response.setAvailableRooms(availableRooms);
        response.setTotalBookings(totalBookings);
        response.setTotalRevenue(revenue);

        return response;
    }
}