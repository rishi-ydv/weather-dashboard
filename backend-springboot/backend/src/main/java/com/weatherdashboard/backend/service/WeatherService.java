package com.weatherdashboard.backend.service;

import com.weatherdashboard.backend.exception.WeatherNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

@Service
public class WeatherService {

    @Value("${visualcrossing.api.key}")
    private String apiKey;

    private final String baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ Get current and forecast weather (Visual Crossing returns both)
    public String getWeather(String city) {
        // Include today + next 5 days
        String url = baseUrl + city + "?unitGroup=metric&key=" + apiKey + "&include=current,days,alerts";

        try {
            String response = restTemplate.getForObject(url, String.class);
            if (response == null || response.isEmpty()) {
                throw new WeatherNotFoundException("Unable to fetch weather for this location. Check city name or coordinates.");
            }
            return response;
        } catch (RestClientException e) {
            throw new WeatherNotFoundException("Unable to fetch weather for this location. Check city name or coordinates.");
        }
    }

    // ✅ Historical weather from Visual Crossing
    public String getHistoricalWeather(String city, LocalDate date) {
        String url = baseUrl + city + "/" + date.toString() + "/" + date.toString()
                + "?unitGroup=metric&key=" + apiKey + "&include=hours,alerts";

        try {
            String response = restTemplate.getForObject(url, String.class);
            if (response == null || response.isEmpty()) {
                throw new WeatherNotFoundException("Unable to fetch historical weather. Check city or date.");
            }
            return response;
        } catch (RestClientException e) {
            throw new WeatherNotFoundException("Unable to fetch historical weather. Check city or date.");
        }
    }

    // ✅ Weather alerts (Visual Crossing provides alerts in response)
    public String getWeatherAlerts(String city) {
        String url = baseUrl + city + "?unitGroup=metric&key=" + apiKey + "&include=alerts";

        try {
            String response = restTemplate.getForObject(url, String.class);
            if (response == null || response.isEmpty() || !response.contains("alerts")) {
                return "{\"alerts\":[],\"message\":\"No active weather alerts for this location.\"}";
            }
            return response;
        } catch (RestClientException e) {
            return "{\"alerts\":[],\"message\":\"Unable to fetch alert data. Please check city or API key.\"}";
        }
    }

    // 🔒 Internal reusable method (optional)
    private String fetchWeatherData(String url) {
        try {
            return restTemplate.getForObject(url, String.class);
        } catch (RestClientException e) {
            throw new WeatherNotFoundException("Unable to fetch weather data from Visual Crossing.");
        }
    }
}
