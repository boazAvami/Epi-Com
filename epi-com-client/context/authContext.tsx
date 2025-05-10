import React, { createContext, useContext, useState, useEffect, ReactNode, Context } from 'react';
import { useAuth as useAuthStore } from '../stores/useAuth';

type AuthContextType = {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<void>;
    loading: boolean;
};

const AuthContext: Context<AuthContextType | undefined> = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { userId, login: storeLogin, logout: storeLogout, loadStoredAuth, getUserInfo } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await loadStoredAuth();
            setLoading(false);
        };
        init();
    }, []);

    const login = async (email: string, password: string) => {
        await storeLogin(email, password);
    };

    const logout = async () => {
        await storeLogout();
    };

    const isAuthenticated = !!userId;

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, getUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
