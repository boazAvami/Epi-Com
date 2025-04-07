import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "יש להזין כתובת מייל").email(),
    password: z.string().min(1, "יש להזין סיסמה"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
