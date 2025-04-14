import { z } from "zod";

export const registerStep5Schema = z.object({
    profile_picture_uri: z
        .string()
        .optional()
        .refine(
            (val) =>
                !val || val.startsWith("http") || val.startsWith("file://"),
            {
                message: "כתובת התמונה אינה תקינה",
            }
        ),
});

export type registerStep5Type = z.infer<typeof registerStep5Schema>;
