import { z } from "zod";
import {EPhonePrefix} from "@/shared/enums/phone-prefix.enum";
import {EGender} from "@shared/types";
import { getValidationMessage } from "@/utils/validation-messages";

export const registerStep2Schema = z.object({
    firstName: z
        .string({ required_error: getValidationMessage('first_name_required') })
        .min(2, getValidationMessage('first_name_min'))
        .max(30, getValidationMessage('first_name_max')),

    lastName: z
        .string({ required_error: getValidationMessage('last_name_required') })
        .min(2, getValidationMessage('last_name_min'))
        .max(30, getValidationMessage('last_name_max')),

    phone_number: z
        .string({ required_error: getValidationMessage('phone_required') })
        .refine((val) => /^0\d{9}$/.test(val), {
            message: getValidationMessage('phone_invalid'),
        })
        .refine((val) => {
            const prefix = val.slice(0, 3);
            return Object.values(EPhonePrefix).includes(prefix as EPhonePrefix);
        }, {
            message: getValidationMessage('prefix_invalid'),
        }),
    date_of_birth: z.date({
        required_error: getValidationMessage('dob_required'),
    }),
    gender: z.nativeEnum(EGender, {
        message: getValidationMessage('gender_required'),
    })
});

export type registerStep2Type = z.infer<typeof registerStep2Schema>;
