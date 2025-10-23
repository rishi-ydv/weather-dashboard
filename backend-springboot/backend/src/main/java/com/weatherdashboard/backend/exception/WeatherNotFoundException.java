package com.weatherdashboard.backend.exception;

public class WeatherNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public WeatherNotFoundException(String message) {
        super(message);
    }

    public WeatherNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
