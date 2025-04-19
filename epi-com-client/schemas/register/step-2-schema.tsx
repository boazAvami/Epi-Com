import { z } from "zod";
import { ValidationRules } from "@/schemas/validation-utils";

export const registerStep2Schema = z.object({
    firstName: ValidationRules.firstName(),
    lastName: ValidationRules.lastName(),
    phone_number: ValidationRules.phone(),
    date_of_birth: ValidationRules.dateOfBirth(),
    gender: ValidationRules.gender()
});

export type registerStep2Type = z.infer<typeof registerStep2Schema>;