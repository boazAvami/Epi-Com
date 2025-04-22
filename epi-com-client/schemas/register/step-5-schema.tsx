import { z } from "zod";
import { ValidationRules } from "@/utils/validation-utils";

export const registerStep5Schema = z.object({
    profile_picture_uri: ValidationRules.profilePicture()
});

export type registerStep5Type = z.infer<typeof registerStep5Schema>;