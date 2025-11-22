import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

export interface User {
    id: string;
    email: string;
    fullName?: string;
    cpf?: string;
    role?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

class AuthService {
    async signUp(email: string, password: string, fullName: string, cpf: string): Promise<{ data?: AuthResponse; error?: string }> {
        try {
            console.log('[AuthService] Signing up:', { email, fullName, cpf });
            console.log('[AuthService] API URL:', API_URL);

            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName, cpf }),
            });

            console.log('[AuthService] Response status:', response.status);
            const data = await response.json();
            console.log('[AuthService] Response data:', data);

            if (!response.ok) {
                return { error: data.error || 'Signup failed' };
            }

            // Save token and user
            await AsyncStorage.setItem(TOKEN_KEY, data.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

            console.log('[AuthService] Signup successful!');
            return { data };
        } catch (error: any) {
            console.error('[AuthService] Signup error:', error);
            return { error: error.message || 'Network error' };
        }
    }

    async signIn(email: string, password: string): Promise<{ data?: AuthResponse; error?: string }> {
        try {
            console.log('[AuthService] Signing in:', { email });
            console.log('[AuthService] API URL:', API_URL);

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            console.log('[AuthService] Response status:', response.status);
            const data = await response.json();
            console.log('[AuthService] Response data:', data);

            if (!response.ok) {
                return { error: data.error || 'Login failed' };
            }

            // Save token and user
            await AsyncStorage.setItem(TOKEN_KEY, data.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

            console.log('[AuthService] Login successful!');
            return { data };
        } catch (error: any) {
            console.error('[AuthService] Login error:', error);
            return { error: error.message || 'Network error' };
        }
    }

    async signOut(): Promise<void> {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
    }

    async getToken(): Promise<string | null> {
        return await AsyncStorage.getItem(TOKEN_KEY);
    }

    async getCurrentUser(): Promise<User | null> {
        const userJson = await AsyncStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return !!token;
    }
}

export default new AuthService();
