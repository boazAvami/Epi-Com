import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';

const setItem = async (key: string, value: string): Promise<void> => {
    if (isWeb) {
        await AsyncStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

const getItem = async (key: string): Promise<string | null> => {
    if (isWeb) {
        return await AsyncStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

const deleteItem = async (key: string): Promise<void> => {
    if (isWeb) {
        await AsyncStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};

export const saveToken = async (token: string) => {
    await setItem(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
    return await getItem(TOKEN_KEY);
};

export const deleteToken = async () => {
    await deleteItem(TOKEN_KEY);
};

export const saveRefreshToken = async (token: string) => {
    await setItem(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = async (): Promise<string | null> => {
    return await getItem(REFRESH_TOKEN_KEY);
};

export const deleteRefreshToken = async () => {
    await deleteItem(REFRESH_TOKEN_KEY);
};

export const saveUserId = async (userId: string) => {
    await setItem(USER_ID_KEY, userId);
};

export const getUserId = async (): Promise<string | null> => {
    return await getItem(USER_ID_KEY);
};

export const deleteUserId = async () => {
    await deleteItem(USER_ID_KEY);
};
