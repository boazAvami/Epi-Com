import { EGender } from '../enums/gender.enum';

export interface IUser {
    _id?: string;
    userName: string;
    password: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone_number?: string | null;
    date_of_birth?: Date | null;
    date_joined?: Date | null;
    profile_picture_uri?: string;
    allergies: string[];
    is_connected?: boolean;
    gender: EGender;
    refreshToken?: string[];
    emergencyContacts: { name: string; phone: string }[];
}
