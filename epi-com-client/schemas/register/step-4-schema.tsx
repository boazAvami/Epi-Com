import { z } from "zod";
import { getValidationMessage } from "@/utils/validation-messages";

export const emergencyContactSchema = z.object({
    name: z
        .string({ required_error: getValidationMessage('contact_name_required') })
        .min(1, getValidationMessage('contact_name_required')),
    phone: z
        .string({ required_error: getValidationMessage('contact_phone_required') })
        .min(10, getValidationMessage('phone_invalid'))
        .regex(/^0[2-9]\d{7,8}$/, getValidationMessage('phone_invalid')),
});

export const registerStep4Schema = z.object({
    emergencyContacts: z
        .array(emergencyContactSchema)
        .min(1, getValidationMessage('emergency_contact_required'))
});

export type registerStep4Type = z.infer<typeof registerStep4Schema>;
