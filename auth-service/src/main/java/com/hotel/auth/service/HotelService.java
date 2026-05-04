package com.hotel.auth.service;

import com.hotel.auth.model.Hotel;
import com.hotel.auth.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    /** Returns all hotels regardless of available dates. */
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }
}
