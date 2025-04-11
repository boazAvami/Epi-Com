import axios from 'axios';
import {API_URL} from "@/constants/Env";
import {getToken} from "@/utils/tokenStorage";

export const login = async (email: string, password: string) => {
    return axios.post(`${API_URL}/auth/login`, { email, password }).then(res => {
        return res.data;
    }).catch(err => {
        throw (err.response.data || 'Login failed');
    });
};

export const logout = async (token: string) => {
    const accessToken: string | null = await getToken();

    await axios.post(`${API_URL}/auth/logout`, {refreshToken: token}, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};
