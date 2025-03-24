import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findById(user.id);
    }
  },
  Mutation: {
    register: async (
      _: any,
      { username, email, password, phone, allergies, emergencyContacts }: any
    ) => {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword,
        phone,
        allergies,
        emergencyContacts
      });

      // Save user to the database
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h"
      });

      return { token, user };
    },
    login: async (_: any, { email, password }: any) => {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      // Compare passwords
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h"
      });

      return { token, user };
    },
    deleteUser: async (_: any, __: any, { user }: any) => {
      // Check if user is authenticated
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Delete the user from the database
      await User.deleteOne({ _id: user.id });
      return true;  // Return true if the user was successfully deleted
    },
    updateUser: async (
      _: any,
      { username, email, phone, allergies, emergencyContacts }: any,
      { user }: any
    ) => {
      // Check if the user is authenticated
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Find the user in the database
      const userToUpdate = await User.findById(user.id);
      if (!userToUpdate) throw new Error("User not found");

      // Update the user's fields if they are provided
      if (username) userToUpdate.username = username;
      if (email) userToUpdate.email = email;
      if (phone) userToUpdate.phone = phone;
      if (allergies) userToUpdate.allergies = allergies;
      if (emergencyContacts) userToUpdate.emergencyContacts = emergencyContacts;

      // Save the updated user
      await userToUpdate.save();

      return userToUpdate;
    }
  }
};
