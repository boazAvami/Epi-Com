import { z } from "zod";
import {EPhonePrefix} from "@/shared/enums/phone-prefix.enum";
import {EGender} from "@shared/types";

export const registerStep2Schema = z.object({
    firstName: z
        .string()
        .min(2, "שם פרטי חייב להכיל לפחות 2 תווים")
        .max(50, "שם פרטי לא יכול להכיל יותר מ־50 תווים"),

    lastName: z
        .string()
        .min(2, "שם משפחה חייב להכיל לפחות 2 תווים")
        .max(50, "שם משפחה לא יכול להכיל יותר מ־50 תווים"),

    phone_number: z
        .string()
        .refine((val) => /^0\d{9}$/.test(val), {
            message: 'מספר טלפון לא תקין',
        })
        .refine((val) => {
            const prefix = val.slice(0, 3);
            return Object.values(EPhonePrefix).includes(prefix as EPhonePrefix);
        }, {
            message: 'הקידומת אינה תקפה',
        }),
    date_of_birth: z
        .string()
        .refine((val) => {
            return /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[0-2])\.\d{4}$/.test(val);
        }, {
            message: "יש להזין תאריך"
        }),
    gender: z.nativeEnum(EGender, {
        message: 'יש לבחור מגדר',
    })
});

export type registerStep2Type = z.infer<typeof registerStep2Schema>;
