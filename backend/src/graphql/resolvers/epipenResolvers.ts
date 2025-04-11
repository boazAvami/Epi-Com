// epipenResolvers.ts
import { AddEpiPenInput, DeleteEpiPenInput, EpiPenModel, IEpiPen, NearbyEpiPenInput, UpdateEpiPenInput } from '../../models/epipenModel';
import mongoose from 'mongoose';
import { calculateDistance } from '../../utils/geoUtils';


export const epiPenResolvers = {
  Mutation: {
    addEpiPen: async (_: any, { input }: { input: AddEpiPenInput }, { userId }: { userId?: string }) => {
      if (!userId) {
        throw new Error('User ID is required for adding EpiPen.');
      }
    
      // Check if the serialNumber already exists
      const existingEpiPen = await EpiPenModel.findOne({ serialNumber: input.serialNumber });
      if (existingEpiPen) {
        throw new Error(`EpiPen with serial number ${input.serialNumber} already exists.`);
      }
    
      // Proceed with adding the EpiPen
      const epiPen = new EpiPenModel({
        userId: userId,
        location: input.location,
        description: input.description,
        expiryDate: new Date(input.expiryDate),
        contact: input.contact,
        image: input.image,
        serialNumber: input.serialNumber,
      });
    
      await epiPen.save();
      return { message: 'EpiPen location added successfully', _id: epiPen._id };
    },
    
    updateEpiPen: async (_: any, { input }: { input: UpdateEpiPenInput }, { userId }: { userId?: string }) => {
      if (!userId) {
        throw new Error('User ID is required for updating EpiPen.');
      }

      const epiPenToUpdate = await EpiPenModel.findById(input._id);

      if (!epiPenToUpdate) {
        throw new Error('EpiPen not found');
      }

      if (epiPenToUpdate.userId.toString() !== userId) {
        throw new Error('You are not authorized to update this EpiPen.');
      }

      await EpiPenModel.findByIdAndUpdate(input._id, {
        location: input.location,
        description: input.description,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
        contact: input.contact,
        image: input.image,
        serialNumber: input.serialNumber,
      });
      return { message: 'EpiPen location updated successfully' , _id : input._id};
    },
    deleteEpiPen: async (_: any, { input }: { input: DeleteEpiPenInput }, { userId }: { userId?: string }) => {
      if (!userId) {
        throw new Error('User ID is required for deleting EpiPen.');
      }

      const epiPenToDelete = await EpiPenModel.findById(input._id);

      if (!epiPenToDelete) {
        throw new Error('EpiPen not found');
      }

      if (epiPenToDelete.userId.toString() !== userId) {
        throw new Error('You are not authorized to delete this EpiPen.');
      }

      await EpiPenModel.findByIdAndDelete(input._id);
      return { message: 'EpiPen location deleted successfully' };
    },
  },
  Query: {
    epiPenById: async (_: any, { _id }: { _id: string }, {userId}:{userId?: string}) => {

      const epipen = await EpiPenModel.findById(_id);

      if(!epipen){
        throw new Error("EpiPen not found");
      }

      if(epipen.userId.toString() !== userId){
        throw new Error("You are not authorized to view this EpiPen")
      }

      return epipen;
    },
    epiPensByUser: async (_: any, {}, { userId }: { userId?: string }) => {
      if (!userId) {
        throw new Error('User ID is required.');
      }
      return await EpiPenModel.find({ userId: new mongoose.Types.ObjectId(userId) });
    },
    nearbyEpiPens: async (_: any, { input }: { input: NearbyEpiPenInput }) => {
      const nearbyEpiPens = await EpiPenModel.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [input.location.longitude, input.location.latitude],
            },
            $maxDistance: input.radius * 1000, // Convert kilometers to meters
          },
        },
      });

      return nearbyEpiPens.map((epiPen) => ({
        userId: epiPen.userId,
        epiPenId: epiPen._id,
        location: epiPen.location,
        contact: epiPen.contact,
        distance: calculateDistance(
          input.location.latitude,
          input.location.longitude,
          epiPen.location.latitude,
          epiPen.location.longitude
        ),
        description: epiPen.description,
      }));
    },
  },
};