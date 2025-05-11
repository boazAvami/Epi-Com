import { userModel } from "../../models/userModel";
import { IUser } from '@shared/types';

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, { userId }: any) => { // Use userId from context
      return await userModel.findById(userId);
    },
    user: async (_: any, {}, { userId }: {userId?: string}) => {
          return userModel.findById(userId);
    },
  },
  Mutation: {
    deleteUser: async (_: any, __: any, { userId }: any) => { // Use userId from context

      await userModel.deleteOne({ _id: userId });
      return true;
    },
    updateUser: async (
      _: any,
      {
        userName,
        email,
        phone_number,
        allergies,
        emergencyContacts,
        firstName,
        lastName,
        date_of_birth,
        profile_picture_uri,
        gender,
      }: Partial<IUser>,
      { userId }: any // Use userId from context
    ) => {

      const userToUpdate = await userModel.findById(userId);
      if (!userToUpdate) throw new Error("User not found");

      if (userName) userToUpdate.userName = userName;
      if (email) userToUpdate.email = email;
      if (phone_number) userToUpdate.phone_number = phone_number;
      if (allergies) userToUpdate.allergies = allergies;
      if (emergencyContacts) userToUpdate.emergencyContacts = emergencyContacts;
      if (firstName) userToUpdate.firstName = firstName;
      if (lastName) userToUpdate.lastName = lastName;
      if (date_of_birth) userToUpdate.date_of_birth = date_of_birth;
      if (gender) userToUpdate.gender = gender;
      if (profile_picture_uri !== undefined) {
        // Set the value, which could be null to remove the picture
        userToUpdate.profile_picture_uri = profile_picture_uri;
      }

      await userToUpdate.save();

      return userToUpdate;
    }, 
  },
};