// In @shared/types/index.ts or a similar file
export interface IEpiPen {
    _id: string;
    userId: string;
    location: {
        latitude: number;
        longitude: number;
    };
    description: string;
    expiryDate: string;
    contact: string;
    image?: string;
    serialNumber: string;
}

export interface NearbyEpiPen {
    userId: string;
    epiPenId: string;
    location: {
        latitude: number;
        longitude: number;
    };
    contact: string;
    distance: number;
    description: string;
}