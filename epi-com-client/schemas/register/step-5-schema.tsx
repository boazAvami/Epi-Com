import { z } from "zod";
import { getValidationMessage } from "@/utils/validation-messages";

export const registerStep5Schema = z.object({
    profile_picture_uri: z
        .string()
        .optional()
        .refine(
            (val) =>
                !val || val.startsWith("http") || val.startsWith("file://"),
            {
                message: getValidationMessage('profile_picture_invalid'),
            }
        ),
});

export type registerStep5Type = z.infer<typeof registerStep5Schema>;
