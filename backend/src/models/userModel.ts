import mongoose from "mongoose";
import {EGender, IUser} from '@shared/types';

const userSchema = new mongoose.Schema<IUser>({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  phone_number: {
    type: String,
    default: null,
  },
  date_of_birth: {
    type: Date,
    default: null,
  },
  date_joined: {
    type: Date,
    default: Date.now,
  },
  profile_picture_uri: {
    type: String,
    default: null,
  },
  is_connected: {
    type: Boolean,
    default: true,
  },
  gender: {
    type: String,
    enum: Object.values(EGender), // Restrict to valid gender values
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that emails are unique
    trim: true,
    lowercase: true
  },
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
  refreshToken: {
    type: [String],
    default: [],
  },
  pushToken: {
    type: String,
    default: null,
  }
});

/** 
 * Mongoose Middleware for cascading delete when a user is deleted 
 */
userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getFilter()["_id"]; // Get the user ID being deleted
  if (userId) {
    // await postModel.deleteMany({ ownerId: userId }); // Delete all posts by this user
    // await commentModel.deleteMany({ ownerId: userId }); // Delete all comments by this user
    // await likeModel.deleteMany({ownerId: userId }) // Delete all likes by this user
  }
  next();
});


export const userModel = mongoose.model<IUser>("Users", userSchema);