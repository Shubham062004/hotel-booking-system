package com.hotel.auth.repository;

import com.hotel.auth.model.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HotelRepository extends MongoRepository<Hotel, String> {
    boolean existsByName(String name);
}
