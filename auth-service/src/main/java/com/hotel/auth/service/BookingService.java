package com.hotel.auth.service;

import com.hotel.auth.dto.BookingRequest;
import com.hotel.auth.dto.BookingResponse;
import com.hotel.auth.exception.DateNotAvailableException;
import com.hotel.auth.exception.ResourceNotFoundException;
import com.hotel.auth.model.Booking;
import com.hotel.auth.model.Hotel;
import com.hotel.auth.repository.BookingRepository;
import com.hotel.auth.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;

    /**
     * Books a hotel for the given date.
     * Guards:
     *   1. Hotel must exist.
     *   2. Requested date must be in hotel.availableDates.
     *   3. No existing booking for the same hotelId + date (double-booking guard).
     * On success: removes the date from availableDates and persists the booking.
     */
    public BookingResponse book(String username, BookingRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found: " + request.getHotelId()));

        // Guard 1: date must be listed as available
        if (!hotel.getAvailableDates().contains(request.getDate())) {
            throw new DateNotAvailableException(
                    "Hotel '" + hotel.getName() + "' is not available on " + request.getDate());
        }

        // Guard 2: prevent double booking at the DB level
        if (bookingRepository.existsByHotelIdAndDate(request.getHotelId(), request.getDate())) {
            throw new DateNotAvailableException(
                    "'" + request.getDate() + "' is already booked for hotel '" + hotel.getName() + "'");
        }

        // Persist booking (snapshot price at booking time)
        Booking booking = Booking.builder()
                .hotelId(hotel.getId())
                .username(username)
                .date(request.getDate())
                .amount(hotel.getPrice())
                .build();
        bookingRepository.save(booking);

        // Mark date as consumed
        hotel.getAvailableDates().remove(request.getDate());
        hotelRepository.save(hotel);

        return new BookingResponse(true,
                "Booking confirmed for '" + hotel.getName() + "' on " + request.getDate()
                        + ". Amount: $" + hotel.getPrice());
    }

    /** Returns all bookings — admin-only, enforced at the controller/security layer. */
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
