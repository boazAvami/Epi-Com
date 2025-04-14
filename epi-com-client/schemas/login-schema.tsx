import {z} from "zod";
import { getValidationMessage } from "@/utils/validation-messages";

export const loginSchema = z.object({
    email: z
        .string({ required_error: getValidationMessage('email_required') })
        .min(1, getValidationMessage('email_required'))
        .email(getValidationMessage('email_invalid')),

    password: z
        .string({ required_error: getValidationMessage('password_required') })
        .min(3, getValidationMessage('password_min')),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
