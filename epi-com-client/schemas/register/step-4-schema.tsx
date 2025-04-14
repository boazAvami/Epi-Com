import { z } from "zod";

export const emergencyContactSchema = z.object({
    name: z
        .string({ required_error: "יש להזין שם איש קשר" })
        .min(1, "יש להזין שם איש קשר"),
    phone: z
        .string({ required_error: "יש להזין מספר טלפון" })
        .min(10, "מספר הטלפון חייב להכיל 10 ספרות")
        .regex(/^0[2-9]\d{7,8}$/, "מספר טלפון לא תקין"),
});

export const registerStep4Schema = z.object({
    emergencyContacts: z
        .array(emergencyContactSchema)
        .min(1, "יש להזין לפחות איש קשר אחד לחירום")
});

export type registerStep4Type = z.infer<typeof registerStep4Schema>;
