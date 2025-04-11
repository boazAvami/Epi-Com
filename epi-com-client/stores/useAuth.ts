import { create } from 'zustand';
import { login as loginApi, logout as logoutApi } from '../services/authService';
import * as tokenStorage from '../utils/tokenStorage';


type AuthState = {
    userId: string | null;
    token: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loadStoredAuth: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
    userId: null,
    token: null,
    refreshToken: null,

    login: async (email, password) => {
        try {
            const { _id, accessToken, refreshToken } = await loginApi(email, password);
            await tokenStorage.saveToken(accessToken);
            await tokenStorage.saveRefreshToken(refreshToken);
            await tokenStorage.saveUser(_id);
            set({ userId: _id, token: accessToken, refreshToken: refreshToken });
        } catch (err) {
            throw err;
        }
    },

    logout: async () => {
        const { token } = useAuth.getState();
        if (token) {
            await logoutApi(token);
        }
        await tokenStorage.deleteToken();
        await tokenStorage.deleteUser();
        set({ userId: null, token: null });
    },

    loadStoredAuth: async () => {
        const [token, userId] = await Promise.all([
            tokenStorage.getToken(),
            tokenStorage.getUser(),
        ]);
        if (token && userId) {
            set({ token, userId });
        }
    },
}));
