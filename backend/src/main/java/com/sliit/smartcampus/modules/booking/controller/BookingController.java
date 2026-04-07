package com.sliit.smartcampus.modules.booking.controller;

import com.sliit.smartcampus.modules.booking.model.Booking;
import com.sliit.smartcampus.modules.booking.service.BookingService;
import com.sliit.smartcampus.common.enums.BookingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // 1. GET Endpoint: Fetch all bookings or filter by user email
    @GetMapping
    public ResponseEntity<List<Booking>> getBookings(@RequestParam(required = false) String userEmail) {
        if (userEmail != null && !userEmail.isEmpty()) {
            return ResponseEntity.ok(bookingService.getBookingsByUser(userEmail));
        }
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // 2. POST Endpoint: Create a new booking (Conflict checking is triggered here)
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking createdBooking = bookingService.createBooking(booking);
            return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Return 400 Bad Request if a scheduling conflict occurs
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // 3. PUT Endpoint: Update booking status (e.g., Admin Approves or Rejects)
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody) {

        BookingStatus newStatus = BookingStatus.valueOf(requestBody.get("status").toUpperCase());
        String adminReason = requestBody.get("adminReason"); // This can be null if approved

        Booking updatedBooking = bookingService.updateBookingStatus(id, newStatus, adminReason);
        return ResponseEntity.ok(updatedBooking);
    }

    // 4. DELETE Endpoint: Cancel or remove a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}