import api from './api';

const bookingService = {
    // 1. Create a new booking
    createBooking: async (bookingData) => {
        try {
            const response = await api.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error("Failed to create booking.");
        }
    },

    // 2. Fetch bookings for a specific user
    getUserBookings: async (email) => {
        const response = await api.get(`/bookings?userEmail=${email}`);
        return response.data;
    },

    // 3. Fetch ALL bookings (For Admin)
    getAllBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },

    // 4. Update Booking Status (Approve/Reject)
    updateBookingStatus: async (id, status, adminReason = "") => {
        const response = await api.put(`/bookings/${id}/status`, { status, adminReason });
        return response.data;
    },

    // 5. Delete/Cancel a booking
    deleteBooking: async (id) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    }
};

export default bookingService;