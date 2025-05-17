import { ValidationRules } from '@/utils/validation-utils';
import { z } from 'zod';

export const registerStep3Schema = z.object({
    allergies: ValidationRules.allergies(),
    //z.array(z.string()).optional(),
});

export type registerStep3Type = z.infer<typeof registerStep3Schema>;