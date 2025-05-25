import { z } from "zod";
import { ValidationRules } from "@/utils/validation-utils"

export const registerStep1Schema = z
    .object({
        email: ValidationRules.email(),
        userName: ValidationRules.userName(),
        password: ValidationRules.password(),
        confirmPassword: ValidationRules.password(),
    });

// Apply password match refinement
export const registerStep1SchemaWithRefinements = ValidationRules.passwordsMatch(registerStep1Schema);
export type registerStep1Type = z.infer<typeof registerStep1SchemaWithRefinements>;