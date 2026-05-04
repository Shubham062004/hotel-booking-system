package com.hotel.auth.repository;

import com.hotel.auth.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    boolean existsByHotelIdAndDate(String hotelId, String date);
    List<Booking> findByUsername(String username);
}
