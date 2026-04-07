package com.sliit.smartcampus.modules.booking.model;

import com.sliit.smartcampus.common.enums.BookingStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String facilityId;
    private String userEmail;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String purpose;
    private int expectedAttendees;

    private BookingStatus status;
    private String adminReason;
}