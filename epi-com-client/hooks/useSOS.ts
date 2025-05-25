import { useState } from 'react';
import { Coordinate } from '@/types';
import {
    responseToSOSMutation,
    sendExpandSOSRangeMutation,
    sendSOSMutation,
    stopSOSMutation
} from "@/services/graphql/graphqlSosService";
import {useAuth} from "@/stores/useAuth";

type SendSOSParams = {
    location: Coordinate;
};

type SendExpandSOSParams = {
    location: Coordinate;
    sosId: string;
    newRange: number;
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

            const res = await sendSOSMutation(userId as string, location);
            setSuccess(true);

            return res.sendSOS;
        } catch (err: any) {
            console.error('Failed to send SOS', err);
            setError(err?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const sendExpandSOSRange = async ({ sosId, location, newRange }: SendExpandSOSParams) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await sendExpandSOSRangeMutation(userId as string, sosId as string, location, newRange );

            setSuccess(true);
        } catch (err: any) {
            console.error('Failed to expand SOS range', err);
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
        sendExpandSOSRange,
        loading,
        error,
        success,
    };
}
