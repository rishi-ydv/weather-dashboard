package com.weatherdashboard.backend.controller;

import com.weatherdashboard.backend.exception.WeatherNotFoundException;
import com.weatherdashboard.backend.service.WeatherService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    // ✅ 1. Current weather + forecast (Visual Crossing returns both)
    @GetMapping("/{city}")
    public ResponseEntity<?> getCurrentWeather(@PathVariable String city) {
        try {
            String data = weatherService.getWeather(city);
            return ResponseEntity.ok(data);
        } catch (WeatherNotFoundException e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    // ✅ 2. Historical weather
    @GetMapping("/history")
    public ResponseEntity<?> getHistoricalWeather(
            @RequestParam String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        try {
            if (date == null) {
                date = LocalDate.now().minusDays(1); // default to yesterday
            }

            String data = weatherService.getHistoricalWeather(city, date);
            return ResponseEntity.ok(data);

        } catch (WeatherNotFoundException e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    // ✅ 3. Weather alerts (Visual Crossing returns alerts in response)
    @GetMapping("/alerts")
    public ResponseEntity<?> getWeatherAlerts(@RequestParam String city) {
        String data = weatherService.getWeatherAlerts(city);
        return ResponseEntity.ok(data);
    }

    // 🔒 Helper for consistent error response
    private ResponseEntity<Map<String, Object>> buildErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Weather data not found");
        error.put("message", message);
        error.put("timestamp", Instant.now());
        error.put("status", 404);
        return ResponseEntity.status(404).body(error);
    }
}
