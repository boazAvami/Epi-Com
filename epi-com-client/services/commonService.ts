import axios from 'axios';
import {API_URL} from "@/constants/Env";
import {getToken} from "@/utils/tokenStorage";

export async function updatePushToken(pushToken: string) {
    const accessToken: string | null = await getToken();

    try {
        const response = await axios.put(
            `${API_URL}/auth/push-token`,
            {pushToken},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("🔴 Error sending push token to server:", error);
        throw error;
    }
}
