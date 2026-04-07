package com.sliit.smartcampus.modules.booking.service;

import com.sliit.smartcampus.modules.booking.model.Booking;
import com.sliit.smartcampus.modules.booking.repository.BookingRepository;
import com.sliit.smartcampus.common.enums.BookingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    // Retrieve all bookings (for Admin view)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Retrieve bookings for a specific user
    public List<Booking> getBookingsByUser(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    // Create a new booking with Conflict Checking
    public Booking createBooking(Booking booking) {
        // CONFLICT CHECK: Are there any overlapping bookings?
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                booking.getFacilityId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Scheduling conflict: The resource is already booked for the selected time range.");
        }

        // Set initial status
        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    // Admin updates the status (Approve or Reject)
    public Booking updateBookingStatus(String bookingId, BookingStatus newStatus, String adminReason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(newStatus);

        // If rejected, an admin reason should be provided
        if (newStatus == BookingStatus.REJECTED && adminReason != null) {
            booking.setAdminReason(adminReason);
        }

        return bookingRepository.save(booking);
    }

    // Delete a booking
    public void deleteBooking(String bookingId) {
        bookingRepository.deleteById(bookingId);
    }
}