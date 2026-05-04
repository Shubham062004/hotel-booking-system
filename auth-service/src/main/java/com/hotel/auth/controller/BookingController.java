package com.hotel.auth.controller;

import com.hotel.auth.dto.BookingRequest;
import com.hotel.auth.dto.BookingResponse;
import com.hotel.auth.model.Booking;
import com.hotel.auth.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /**
     * POST /book
     * Body: { "hotelId": "...", "date": "YYYY-MM-DD" }
     * Requires: valid JWT (any role).
     * Username is resolved from the security context — never trusted from the request body.
     */
    @PostMapping("/book")
    public ResponseEntity<BookingResponse> book(@RequestBody BookingRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bookingService.book(username, request));
    }

    /**
     * GET /bookings
     * Returns all bookings.
     * Requires: ADMIN role (enforced by SecurityConfig).
     */
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}
