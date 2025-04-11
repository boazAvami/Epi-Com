import { getToken } from '@/utils/tokenStorage';
import {GRAPHQL_URL} from "@/constants/Env";

type GraphQLResponse<T> = {
    data?: T;
    errors?: { message: string }[];
};

export const graphqlRequest = async <T = any>(
    query: string,
    variables?: Record<string, any>
): Promise<T> => {
    const token: string | null = await getToken();

    const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ query, variables }),
    });

    const json: GraphQLResponse<T> = await res.json();

    if (!res.ok || json.errors?.length) {
        const errorMessage = json.errors?.[0]?.message || 'GraphQL request failed';
        throw new Error(errorMessage);
    }

    return json.data as T;
};
