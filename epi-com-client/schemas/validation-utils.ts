import { z } from "zod";
import { getValidationMessage } from "@/utils/validation-messages";
import { EGender } from "@shared/types";
import { EPhonePrefix } from "@/shared/enums/phone-prefix.enum";

/**
 * Shared validation rules that can be used across different form schemas
 */
export const ValidationRules = {
  // User identity
  email: () => z
    .string({ required_error: getValidationMessage('email_required') })
    .min(1, getValidationMessage('email_required'))
    .email(getValidationMessage('email_invalid')),

  userName: () => z
    .string({ required_error: getValidationMessage('username_required') })
    .min(2, getValidationMessage('username_min'))
    .max(30, getValidationMessage('username_max')),

  // Password
  password: (isRequired: boolean = true) => {
    const schema = z.string();
    if (isRequired) {
      return schema
        .min(6, getValidationMessage('password_min'))
        .nonempty(getValidationMessage('password_required'));
    }
    return schema.optional();
  },

  // Personal information
  firstName: () => z
    .string({ required_error: getValidationMessage('first_name_required') })
    .min(2, getValidationMessage('first_name_min'))
    .max(30, getValidationMessage('first_name_max')),

  lastName: () => z
    .string({ required_error: getValidationMessage('last_name_required') })
    .min(2, getValidationMessage('last_name_min'))
    .max(30, getValidationMessage('last_name_max')),

  phone: (isRequired: boolean = true) => {
    const schema = z.string();
    if (isRequired) {
      return schema
        .nonempty(getValidationMessage('phone_required'))
        .refine((val) => /^0\d{9}$/.test(val), {
          message: getValidationMessage('phone_invalid'),
        })
        .refine((val) => {
          const prefix = val.slice(0, 3);
          return Object.values(EPhonePrefix).includes(prefix as EPhonePrefix);
        }, {
          message: getValidationMessage('prefix_invalid'),
        });
    }
    return schema.optional().refine(
      (val) => !val || val.length === 0 || /^0\d{9}$/.test(val), 
      {
        message: getValidationMessage('phone_invalid'),
      }
    ).refine(
      (val) => {
        if (!val || val.length === 0) return true;
        const prefix = val.slice(0, 3);
        return Object.values(EPhonePrefix).includes(prefix as EPhonePrefix);
      }, 
      {
        message: getValidationMessage('prefix_invalid'),
      }
    );
  },

  // Other fields
  gender: (isRequired: boolean = true) => {
    if (isRequired) {
      return z.nativeEnum(EGender, {
        message: getValidationMessage('gender_required'),
      });
    }
    return z.nativeEnum(EGender).optional();
  },

  dateOfBirth: (isRequired: boolean = true) => {
    if (isRequired) {
      return z.date({
        required_error: getValidationMessage('dob_required'),
      });
    }
    return z.date().optional();
  },

  // Profile picture
  profilePicture: () => z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || val.startsWith("http") || val.startsWith("file://"),
      {
        message: getValidationMessage('profile_picture_invalid'),
      }
    ),

  // Password match refinement
  passwordsMatch: (schema: z.ZodObject<any>) => {
    return schema.refine(
      (data) => {
        // Only validate if both password fields exist
        if (data.password && data.confirmPassword) {
          return data.password === data.confirmPassword;
        }
        return true;
      },
      {
        message: getValidationMessage('passwords_match'),
        path: ["confirmPassword"],
      }
    );
  }
};

/**
 * Shared emergency contact schemas
 */
export const EmergencyContactSchemas = {
  // Required contact schema for registration
  required: z.object({
    name: z
      .string({ required_error: getValidationMessage('contact_name_required') })
      .min(2, getValidationMessage('contact_name_min'))
      .max(30, getValidationMessage('contact_name_max')),
    phone: z
      .string({ required_error: getValidationMessage('contact_phone_required') })
      .min(10, getValidationMessage('phone_invalid'))
      .regex(/^0[2-9]\d{7,8}$/, getValidationMessage('phone_invalid')),
  }),

  // Optional contact schema for settings - validates when provided
  optional: z.object({
    name: z.string().optional(),
    phone: z.string().optional().refine(
      (val) => !val || val.length === 0 || /^0[2-9]\d{7,8}$/.test(val),
      {
        message: getValidationMessage('phone_invalid'),
      }
    ),
  })
};