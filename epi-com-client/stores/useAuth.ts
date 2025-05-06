import { create } from 'zustand';
import {
    login as loginApi,
    logout as logoutApi,
    googleLogin as googleLoginApi,
    refreshAccessToken
} from '../services/authService';
import * as tokenStorage from '../utils/tokenStorage';
import { GetLoggedUser } from "@/services/graphql/graphqlUserService";
import { IUser } from "@shared/types";
import { jwtDecode } from "jwt-decode";
type JwtPayload = {
    exp: number;
};
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
        const res = await googleLoginApi(credential);
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
        let [token, userId, refreshToken] = await Promise.all([
            tokenStorage.getToken(),
            tokenStorage.getUserId(),
            tokenStorage.getRefreshToken()
        ]);

        if (!userId || !refreshToken) return;

        try {
            let shouldRefresh = false;

            if (token) {
                const { exp } = jwtDecode<JwtPayload>(token);
                const now = Date.now() / 1000;
                if (exp < now) {
                    shouldRefresh = true;
                }
            } else {
                shouldRefresh = true;
            }

            if (shouldRefresh) {
                const newAccessToken = await refreshAccessToken(refreshToken);
                await tokenStorage.saveToken(newAccessToken.accessToken);
                await tokenStorage.saveRefreshToken(newAccessToken.refreshToken);
                token = newAccessToken.accessToken;
            }

            set({ token, userId, refreshToken });

            const { me }: { me: IUser } = await GetLoggedUser();
            set({ user: me });
        } catch (error) {
            await tokenStorage.deleteToken();
            await tokenStorage.deleteRefreshToken();
            await tokenStorage.deleteUserId();
            set({ userId: null, token: null, refreshToken: null, user: null });
        }
    }

}));
