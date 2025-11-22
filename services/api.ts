import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://onspace-api.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token if we decide to use custom auth later
// For now, we are just using the public API or we can pass the Supabase token if needed for verification
api.interceptors.request.use(
    async (config) => {
        // Placeholder for token logic if we implement JWT verification on backend using Supabase tokens
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const reportService = {
    createReport: async (data: any) => {
        const response = await api.post('/api/reports', data);
        return response.data;
    },

    getAllReports: async () => {
        const response = await api.get('/api/reports');
        return response.data;
    },

    getUserReports: async (userId: string) => {
        const response = await api.get(`/api/reports/user/${userId}`);
        return response.data;
    },
};

export default api;
