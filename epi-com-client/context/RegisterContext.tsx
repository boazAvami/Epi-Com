import React, { createContext, useContext, useState } from 'react';
import {RegisterData} from "@/shared/types/register-data.type";

type RegisterContextType = {
    formData: RegisterData;
    setFormData: (data: Partial<RegisterData>) => void;
};

const defaultRegisterData: RegisterData = {
    email: '',
    password: '',
    userName: '',
    phone_number: '',
    allergies: [],
    emergencyContacts: [],
    firstName: null,
    lastName: null,
    date_of_birth: null,
    profile_picture_uri: null,
    gender: null,
};

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormDataState] = useState<RegisterData>(defaultRegisterData);

    const setFormData = (data: Partial<RegisterData>) => {
        console.log('Setting form data in RegisterContext:', data);
        setFormDataState((prev: any) => {
            const updated = { ...prev, ...data };
            console.log('Updated form data:', updated);
            return updated;
        });
    };

    return (
        <RegisterContext.Provider value={{ formData, setFormData }}>
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = (): RegisterContextType => {
    const context = useContext(RegisterContext);
    
    if (!context) {
        throw new Error('useRegister must be used within a RegisterProvider');
    }
    
    console.log('Accessing form data from RegisterContext:', context.formData);
    return context;
};
