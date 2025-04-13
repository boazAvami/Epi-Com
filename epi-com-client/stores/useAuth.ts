import { create } from 'zustand';
import { login as loginApi, logout as logoutApi, googleLogin as googleLoginApi } from '../services/authService';
import * as tokenStorage from '../utils/tokenStorage';
import { GetLoggedUser } from "@/services/graphql/graphqlUserService";
import { IUser } from "@shared/types";

type AuthState = {
    userId: string | null;
    user: IUser | null;
    token: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    googleLogin: (credential: string) => Promise<void>;
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
        const { _id, accessToken, refreshToken } = await loginApi(email, password);
        await tokenStorage.saveToken(accessToken);
        await tokenStorage.saveRefreshToken(refreshToken);
        await tokenStorage.saveUserId(_id);
        set({ userId: _id, token: accessToken, refreshToken });
    },

    googleLogin: async (credential) => {
        const res = await googleLoginApi(credential); // מבצע POST לשרת
        const { _id, accessToken, refreshToken } = res;
        await tokenStorage.saveToken(accessToken);
        await tokenStorage.saveRefreshToken(refreshToken);
        await tokenStorage.saveUserId(_id);
        set({ userId: _id, token: accessToken, refreshToken });
    },

    logout: async () => {
        const { refreshToken } = useAuth.getState();
        if (refreshToken) {
            await logoutApi(refreshToken);
        }
        await tokenStorage.deleteToken();
        await tokenStorage.deleteUserId();
        set({ userId: null, token: null, refreshToken: null, user: null });
    },

    getUserInfo: async () => {
        const { me }: { me: IUser } = await GetLoggedUser();
        set({ user: me });
    },

    loadStoredAuth: async () => {
        const [token, userId, refreshToken] = await Promise.all([
            tokenStorage.getToken(),
            tokenStorage.getUserId(),
            tokenStorage.getRefreshToken()
        ]);
        if (token && userId) {
            set({ token, userId, refreshToken });
        }
    },
}));
