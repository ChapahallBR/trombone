import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User } from '@/services/authService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error?: string }>;
    signUp: (email: string, password: string, fullName: string, cpf: string) => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await authService.signIn(email, password);
            if (error) {
                setLoading(false);
                return { error };
            }
            if (data) {
                setUser(data.user);
            }
            setLoading(false);
            return {};
        } catch (error: any) {
            setLoading(false);
            return { error: error.message };
        }
    };

    const signUp = async (email: string, password: string, fullName: string, cpf: string) => {
        setLoading(true);
        try {
            const { data, error } = await authService.signUp(email, password, fullName, cpf);
            if (error) {
                setLoading(false);
                return { error };
            }
            if (data) {
                setUser(data.user);
            }
            setLoading(false);
            return {};
        } catch (error: any) {
            setLoading(false);
            return { error: error.message };
        }
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
