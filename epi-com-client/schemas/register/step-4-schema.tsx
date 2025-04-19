import { z } from "zod";
import { EmergencyContactSchemas } from "@/schemas/validation-utils";
import { getValidationMessage } from "@/utils/validation-messages";

export const registerStep4Schema = z.object({
    emergencyContacts: z
        .array(EmergencyContactSchemas.required)
        .min(1, getValidationMessage('emergency_contact_required'))
});

export type registerStep4Type = z.infer<typeof registerStep4Schema>;