package com.hotel.auth.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private String hotelId;
    private String date; // ISO format: "YYYY-MM-DD"
}
