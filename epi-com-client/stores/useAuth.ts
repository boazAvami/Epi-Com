import { create } from 'zustand';
import { login as loginApi, logout as logoutApi } from '../services/authService';
import * as tokenStorage from '../utils/tokenStorage';
import {GetLoggedUser} from "@/services/graphql/graphqlUserService";
import {IUser} from "@shared/types";


type AuthState = {
    userId: string | null;
    user: IUser | null;
    token: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    getUserInfo: () => Promise<void>;
    logout: () => Promise<void>;
    loadStoredAuth: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
    userId: null,
    token: null,
    refreshToken: null,
    user: null,

    login: async (email, password) => {
        try {
            const { _id, accessToken, refreshToken } = await loginApi(email, password);
            await tokenStorage.saveToken(accessToken);
            await tokenStorage.saveRefreshToken(refreshToken);
            await tokenStorage.saveUserId(_id);
            set({ userId: _id, token: accessToken, refreshToken: refreshToken });
        } catch (err) {
            throw err;
        }
    },

    logout: async () => {
        const { refreshToken } = useAuth.getState();
        if (refreshToken) {
            await logoutApi(refreshToken);
        }
        await tokenStorage.deleteToken();
        await tokenStorage.deleteUserId();
        set({ userId: null, token: null });
    },

    getUserInfo: async () => {
        try {
            const { me }: {me: IUser} = await GetLoggedUser();
            set({ user: me });
        } catch (err) {
            throw err;
        }
    },

    loadStoredAuth: async () => {
        const [token, userId] = await Promise.all([
            tokenStorage.getToken(),
            tokenStorage.getUserId(),
        ]);
        if (token && userId) {
            set({ token, userId });
        }
    },
}));
