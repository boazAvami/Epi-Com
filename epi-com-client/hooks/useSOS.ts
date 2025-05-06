import { useState } from 'react';
import { Coordinate } from '@/types';
import {sendSOSMutation} from "@/services/graphql/graphqlSosService";
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

    return {
        sendSOS,
        loading,
        error,
        success,
    };
}
