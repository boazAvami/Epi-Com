import { useState } from 'react';
import { Coordinate } from '@/types';
import {responseToSOSMutation, sendSOSMutation, stopSOSMutation} from "@/services/graphql/graphqlSosService";
import {useAuth} from "@/stores/useAuth";

type SendSOSParams = {
    location: Coordinate;
};

export function useSOS() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { userId } = useAuth();

    const sendSOS = async ({ location }: SendSOSParams) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await sendSOSMutation(userId as string, location);

            setSuccess(true);
        } catch (err: any) {
            console.error('Failed to send SOS', err);
            setError(err?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const stopSOS = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await stopSOSMutation(userId as string,);

            setSuccess(true);
        } catch (err: any) {
            console.error('Failed to stop SOS', err);
            setError(err?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const responseToSOS = async (sosId: string, location: { latitude: number, longitude: number }) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await responseToSOSMutation(userId as string, sosId, location);

            setSuccess(true);
        } catch (err: any) {
            console.error('Failed to stop SOS', err);
            setError(err?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return {
        sendSOS,
        stopSOS,
        responseToSOS,
        loading,
        error,
        success,
    };
}
