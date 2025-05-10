import axios from 'axios';
import {API_URL} from "@/constants/Env";
import {getToken} from "@/utils/tokenStorage";
import {RegisterData} from "@/shared/types/register-data.type";

export const login = async (email: string, password: string) => {
    return axios.post(`${API_URL}/auth/login`, { email, password }).then(res => {
        console.log(res.data)
        return res.data;
    }).catch(err => {
        throw (err.response.data || 'Login failed');
    });
};

export const googleLogin = async (credential: string) => {
    const res = await axios.post(`${API_URL}/auth/google`, { credential });
    return res.data;
};

export const logout = async (token: string) => {
    const accessToken: string | null = await getToken();

    await axios.post(`${API_URL}/auth/logout`, {refreshToken: token}, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

export const register = async (userData: RegisterData) => {
    return axios.post(`${API_URL}/auth/register`, userData).then(res => {
        return res.data;
    }).catch(err => {
        throw (err.response.data || 'Login failed');
    });
};
