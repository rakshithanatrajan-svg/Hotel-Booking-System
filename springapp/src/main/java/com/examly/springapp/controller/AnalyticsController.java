package com.examly.springapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.dto.response.AnalyticsResponse;
import com.examly.springapp.service.AnalyticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Endpoints for retrieving system metrics and analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @Operation(summary = "Get dashboard analytics", description = "Fetches analytics summary including total users, total rooms, bookings, and revenue")
    public ResponseEntity<AnalyticsResponse> getDashboardAnalytics() {

        return ResponseEntity.ok(
                analyticsService.getDashboardAnalytics());
    }
}