import { EGender } from '@/shared/enums/gender.enum';

export type RegisterData = {
    email: string;
    password: string;
    userName: string;
    phone_number: string;
    allergies: string[];
    emergencyContacts: string[];
    firstName: string | null;
    lastName: string | null;
    date_of_birth: string | null;
    profile_picture_uri: string | null;
    gender: EGender | null;
};
