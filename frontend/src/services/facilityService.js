import api from './api';

const facilityService = {
    // 1. Get all facilities
    getAllFacilities: async () => {
        const response = await api.get('/facilities');
        return response.data;
    },

    // 2. Get a single facility by ID (MEKA THAMAYI MISS WELA THIBBE)
    getFacilityById: async (id) => {
        const response = await api.get(`/facilities/${id}`);
        return response.data;
    },
    
    // 3. Create a new facility
    createFacility: async (facilityData) => {
        const response = await api.post('/facilities', facilityData);
        return response.data;
    },

    // 4. Update an existing facility
    updateFacility: async (id, facilityData) => {
        const response = await api.put(`/facilities/${id}`, facilityData);
        return response.data;
    },

    // 5. Delete a facility
    deleteFacility: async (id) => {
        await api.delete(`/facilities/${id}`);
    },

    // 6. Upload an image
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/facilities/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data; 
    }
};

export default facilityService;