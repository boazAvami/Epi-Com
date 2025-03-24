// src/models/User.ts
import mongoose, { Document } from "mongoose";

// Define the interface for the User model
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  allergies: string[];
  emergencyContacts: { name: string; phone: string }[];
}

// Define the User schema with the new fields
const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },  // Added phone field
  allergies: { type: [String], required: false },  // Added allergies array field
  emergencyContacts: {  // Added emergencyContacts array of objects
    type: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
      },
    ],
    required: false,
  },
});

export default mongoose.model<IUser>("User", UserSchema);
