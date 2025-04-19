import { z } from "zod";
import { ValidationRules, EmergencyContactSchemas } from "./validation-utils";

/**
 * Profile settings form validation schema
 * 
 * Using the shared validation rules to create a form schema
 * specifically for the profile settings screen.
 */
export const profileSettingsSchema = ValidationRules.passwordsMatch(
  z.object({
    // User identity fields (required)
    userName: ValidationRules.userName(),
    firstName: ValidationRules.firstName(),
    lastName: ValidationRules.lastName(),
    email: ValidationRules.email(),
    
    // Optional fields
    phone_number: ValidationRules.phone(false),
    gender: ValidationRules.gender(false),
    date_of_birth: ValidationRules.dateOfBirth(false),
    
    // Allergies list
    allergies: z.array(z.string()).optional(),
    
    // Emergency contacts - using the optional schema from shared validation
    emergencyContacts: z.array(EmergencyContactSchemas.required),
    
    // Password fields (optional for settings)
    password: ValidationRules.password(false),
    confirmPassword: ValidationRules.password(false),
    
    // Profile picture
    profile_picture_uri: ValidationRules.profilePicture()
  })
);

// Type for the profile settings form data
export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;