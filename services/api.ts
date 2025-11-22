import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://onspace-api.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
