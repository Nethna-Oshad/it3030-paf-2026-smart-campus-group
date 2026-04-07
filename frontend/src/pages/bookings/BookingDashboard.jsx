import React, { useState, useEffect, useContext } from 'react';
import bookingService from '../../services/bookingService';
import { AuthContext } from '../../context/AuthContext';

const BookingDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, [user]);

    const loadBookings = async () => {
        setLoading(true);
        try {
            let data = [];
            if (user.role === 'ADMIN') {
                // Admin sees everything
                data = await bookingService.getAllBookings();
            } else {
                // Regular users only see their own
                data = await bookingService.getUserBookings(user.email);
            }
            setBookings(data);
        } catch (error) {
            console.error("Error loading bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        let reason = "";
        if (newStatus === 'REJECTED') {
            reason = window.prompt("Please enter a reason for rejection:");
            if (reason === null) return; // User cancelled the prompt
        }

        try {
            await bookingService.updateBookingStatus(id, newStatus, reason);
            loadBookings(); // Refresh list
        } catch (error) {
            alert("Failed to update status.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to completely delete this booking?")) {
            try {
                await bookingService.deleteBooking(id);
                loadBookings(); // Refresh list
            } catch (error) {
                alert("Failed to delete booking.");
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#0d6efd' }}>Loading Bookings...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#084298', marginBottom: '20px' }}>
                {user.role === 'ADMIN' ? 'All System Bookings' : 'My Bookings'}
            </h1>

            {bookings.length === 0 ? (
                <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '8px', textAlign: 'center', border: '1px solid #cfe2ff' }}>
                    <p style={{ color: '#6c757d', margin: 0 }}>No bookings found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {bookings.map(booking => (
                        <div key={booking.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #cfe2ff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            
                            {/* Booking Info */}
                            <div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#084298' }}>Date: {booking.bookingDate}</h3>
                                <p style={{ margin: '0 0 5px 0' }}><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                                <p style={{ margin: '0 0 5px 0' }}><strong>Purpose:</strong> {booking.purpose} ({booking.expectedAttendees} Attendees)</p>
                                {user.role === 'ADMIN' && <p style={{ margin: '0 0 5px 0' }}><strong>Requested By:</strong> {booking.userEmail}</p>}
                                
                                {booking.adminReason && (
                                    <p style={{ margin: '10px 0 0 0', color: '#842029', fontSize: '14px', backgroundColor: '#f8d7da', padding: '5px 10px', borderRadius: '4px', display: 'inline-block' }}>
                                        <strong>Reason:</strong> {booking.adminReason}
                                    </p>
                                )}
                            </div>

                            {/* Status & Actions */}
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: '15px', fontWeight: 'bold', marginBottom: '15px',
                                    backgroundColor: booking.status === 'APPROVED' ? '#d1e7dd' : booking.status === 'REJECTED' ? '#f8d7da' : '#fff3cd',
                                    color: booking.status === 'APPROVED' ? '#0f5132' : booking.status === 'REJECTED' ? '#842029' : '#856404' }}>
                                    {booking.status}
                                </span>

                                {/* Admin Action Buttons */}
                                {user.role === 'ADMIN' && booking.status === 'PENDING' && (
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => handleStatusUpdate(booking.id, 'APPROVED')} style={{ padding: '8px 15px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                                        <button onClick={() => handleStatusUpdate(booking.id, 'REJECTED')} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                                    </div>
                                )}
                                
                                {/* Delete/Cancel Button */}
                                <div style={{ marginTop: '10px' }}>
                                    <button onClick={() => handleDelete(booking.id)} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        {user.role === 'ADMIN' ? 'Delete Record' : 'Cancel Booking'}
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingDashboard;