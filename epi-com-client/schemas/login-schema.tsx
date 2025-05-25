import { z } from "zod";
import { ValidationRules } from "@/utils/validation-utils";
import { getValidationMessage } from "@/utils/validation-messages";

export const loginSchema = z.object({
    email: ValidationRules.email(),
    // Using custom validation for password since login has different requirements than registration
    password: ValidationRules.password()
});

export type LoginSchemaType = z.infer<typeof loginSchema>;