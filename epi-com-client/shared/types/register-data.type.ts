import {EGender, IEmergencyContact} from "@shared/types";

export type RegisterData = {
    email: string;
    password: string;
    userName: string;
    phone_number: string;
    allergies: string[];
    emergencyContacts: IEmergencyContact[] | null;
    firstName: string | null;
    lastName: string | null;
    date_of_birth: Date | null;
    profile_picture_uri: string | null;
    gender: EGender | null;
    language: string | null;
    pushToken?: string
};
