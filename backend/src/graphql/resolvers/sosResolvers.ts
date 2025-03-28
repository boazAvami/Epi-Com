import { SOSModel, ISOS } from '../../models/sosModel';
import mongoose from 'mongoose';

export const sosResolvers = {
  Mutation: {
    sendSOS: async (_: any, { userId, location }: { userId: string, location: { latitude: number, longitude: number } }) => {
      const sos = new SOSModel({
        userId: new mongoose.Types.ObjectId(userId),
        location,
        status: 'active',
        responders: [],  // Initially, no responders
      });
      await sos.save();
      return {
        status: 'success',
        message: 'SOS alert sent to nearby EpiPen holders'
      };
    },
    responseToSOS: async (_: any, { userId, sosId, location }: { userId: string, sosId: string, location: { latitude: number, longitude: number } }) => {
      const sos = await SOSModel.findById(sosId);
      if (!sos) {
        throw new Error('SOS not found');
      }
      if (sos.status !== 'active') {
        throw new Error('SOS alert is no longer active');
      }

      // Add the user as a responder
      sos.responders.push(new mongoose.Types.ObjectId(userId));
      await sos.save();

      return {
        status: 'success',
        message: 'SOS response was sent to caller'
      };
    },
    stopSOS: async (_: any, { userId }: { userId: string }) => {
      const sos = await SOSModel.findOne({ userId, status: 'active' });
      if (!sos) {
        throw new Error('No active SOS alert found for this user');
      }

      sos.status = 'stopped';
      await sos.save();

      return {
        status: 'success',
        message: 'SOS alert stopped'
      };
    },
  },
  Query: {
    getResponders: async (_: any, { userId, sosId }: { userId: string, sosId: string }) => {
      const sos = await SOSModel.findById(sosId);
      if (!sos) {
        throw new Error('SOS not found');
      }

      if (sos.userId.toString() !== userId) {
        throw new Error('You are not authorized to view the responders');
      }

      return sos.responders;
    },
  },
};
