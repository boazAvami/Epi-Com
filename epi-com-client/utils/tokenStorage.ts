import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';

export const saveToken = async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const deleteToken = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const saveRefreshToken = async (token: string) => {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = async () => {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const deleteRefreshToken = async () => {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const saveUserId = async (user: any) => {
    await SecureStore.setItemAsync(USER_ID_KEY, JSON.stringify(user));
};

export const getUserId = async () => {
    const json = await SecureStore.getItemAsync(USER_ID_KEY);
    return json ? JSON.parse(json) : null;
};

export const deleteUserId = async () => {
    await SecureStore.deleteItemAsync(USER_ID_KEY);
};