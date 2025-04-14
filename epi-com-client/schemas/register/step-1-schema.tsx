import { z } from "zod";
import { getValidationMessage } from "@/utils/validation-messages";

export const registerStep1Schema = z
    .object({
        email: z
            .string({ required_error: getValidationMessage('email_required') })
            .min(1, getValidationMessage('email_required'))
            .email(getValidationMessage('email_invalid')),

        userName: z
            .string({ required_error: getValidationMessage('username_required') })
            .min(2, getValidationMessage('username_min'))
            .max(30, getValidationMessage('username_max')),

        password: z
            .string({ required_error: getValidationMessage('password_required') })
            .min(6, getValidationMessage('password_min')),

        confirmPassword: z
            .string({ required_error: getValidationMessage('confirm_password_required') })
            .min(6, getValidationMessage('confirm_password_min')),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: getValidationMessage('passwords_match'),
        path: ["confirmPassword"],
    });

export type registerStep1Type = z.infer<typeof registerStep1Schema>;
