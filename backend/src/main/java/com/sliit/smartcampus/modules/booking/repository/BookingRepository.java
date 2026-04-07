package com.sliit.smartcampus.modules.booking.repository;

import com.sliit.smartcampus.modules.booking.model.Booking;
import com.sliit.smartcampus.common.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // Fetch all bookings for a specific user
    List<Booking> findByUserEmail(String userEmail);

    // Custom query to find overlapping bookings for conflict checking
    // It checks if the requested facility is already booked on the requested date
    // AND if the requested time range overlaps with any existing APPROVED or PENDING booking
    @Query("{ 'facilityId': ?0, 'bookingDate': ?1, 'status': { $in: ['APPROVED', 'PENDING'] }, " +
            "$or: [ " +
            "{ $and: [ {'startTime': { $lte: ?2 }}, {'endTime': { $gt: ?2 }} ] }, " +
            "{ $and: [ {'startTime': { $lt: ?3 }}, {'endTime': { $gte: ?3 }} ] }, " +
            "{ $and: [ {'startTime': { $gte: ?2 }}, {'endTime': { $lte: ?3 }} ] } " +
            "] }")
    List<Booking> findConflictingBookings(String facilityId, LocalDate bookingDate, LocalTime startTime, LocalTime endTime);
}