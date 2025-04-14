import {z} from "zod";

export const loginSchema = z.object({
    email: z
        .string({ required_error: "יש להזין כתובת מייל" })
        .min(1, "יש להזין כתובת מייל")
        .email("כתובת המייל אינה תקינה"),

    password: z
        .string({ required_error: "יש להזין סיסמה" })
        .min(3, "הסיסמה חייבת להכיל לפחות 3 תווים"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
