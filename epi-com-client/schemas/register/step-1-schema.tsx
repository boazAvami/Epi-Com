import { z } from "zod";

export const registerStep1Schema = z
    .object({
        email: z
            .string({ required_error: "יש להזין כתובת מייל" })
            .min(1, "יש להזין כתובת מייל")
            .email("כתובת מייל לא תקינה"),

        userName: z
            .string({ required_error: "יש להזין שם משתמש" })
            .min(2, "שם המשתמש חייב להכיל לפחות 2 תווים")
            .max(30, "שם המשתמש לא יכול להכיל יותר מ־30 תווים"),

        password: z
            .string({ required_error: "יש להזין סיסמה" })
            .min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),

        confirmPassword: z
            .string({ required_error: "יש להזין אישור סיסמה" })
            .min(6, "אישור הסיסמה חייב להכיל לפחות 6 תווים"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "הסיסמה ואישור הסיסמה אינן תואמות",
        path: ["confirmPassword"],
    });

export type registerStep1Type = z.infer<typeof registerStep1Schema>;
