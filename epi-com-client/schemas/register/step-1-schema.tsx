import {z} from "zod";

export const registerStep1Schema = z.object({
    email: z.string().min(1, "יש להזין כתובת מייל").email(),
    userName: z.string().min(1, "יש להזין שם משתמש"),
    password: z.string().min(1, "יש להזין סיסמה"),
    confirmPassword: z.string().min(1, "יש להזין אישור סיסמה"),
});

export type registerStep1Type = z.infer<typeof registerStep1Schema>;
