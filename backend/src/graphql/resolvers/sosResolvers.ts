import { SOSModel, ISOS } from '../../models/sosModel';
import mongoose from 'mongoose';
import {
  filterAlreadyNotifiedUsers,
  getNearbyUserIdsWithEpipens,
  notifyRespondersSOSStopped,
  notifyUserResponse, notifyUsersAndUpdateSOS
} from "../../utils/sosUtils";
import {ILocation} from "@shared/types";

export const sosResolvers = {
  Mutation: {
    sendSOS: async (_: any, { userId, location }: { userId: string, location: ILocation }) => {
      const sos = new SOSModel({
        userId: new mongoose.Types.ObjectId(userId),
        location,
        status: 'active',
        responders: [],
      });
      await sos.save();
      const DEFAULT_RADIUS: number = 1000;
      const nearbyUserIds = await getNearbyUserIdsWithEpipens(location, DEFAULT_RADIUS, userId);
      await notifyUsersAndUpdateSOS(nearbyUserIds, sos, location, userId, sos._id.toString());
      return {
        status: 'success',
        message: 'SOS alert sent to nearby EpiPen holders',
        sosId: sos._id.toString()
      };
    },
    expandSOSRange: async (_: any, {userId, sosId, location, newRadiusInMeters}: {
          userId: string;
          sosId: string;
          location: ILocation;
          newRadiusInMeters: number;
        }
    ) => {
      const sos = await SOSModel.findById(sosId);
      if (!sos) throw new Error('SOS not found');
      if (sos.status !== 'active') throw new Error('SOS is not active');
      if (sos.userId.toString() !== userId) throw new Error('Unauthorized');

      const nearbyUserIds = await getNearbyUserIdsWithEpipens(location, newRadiusInMeters, userId);
      const userIdsToNotify = filterAlreadyNotifiedUsers(nearbyUserIds, sos, userId);
      const notifiedCount = await notifyUsersAndUpdateSOS(userIdsToNotify, sos, location, userId, sosId);

      return {
        status: 'success',
        message: `Sent SOS to ${notifiedCount} more users in extended radius`,
      };
    },
    responseToSOS: async (_: any, { userId, sosId, location }: { userId: string, sosId: string, location: ILocation }) => {
      const sos = await SOSModel.findById(sosId);
      if (!sos) {
        throw new Error('SOS not found');
      }

      if (sos.status !== 'active') {
        throw new Error('SOS alert is no longer active');
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      if (!sos.responders.some(id => id.equals(userObjectId))) {
        sos.responders.push(userObjectId);
        await sos.save();
      }

      await notifyUserResponse(userId, sos, location);

      return {
        status: 'success',
        message: 'SOS response was sent to caller',
      };
    },
    stopSOS: async (_: any, { userId }: { userId: string }) => {
      const sos = await SOSModel.findOne({ userId, status: 'active' });
      if (!sos) {
        throw new Error('No active SOS alert found for this user');
      }

      sos.status = 'stopped';
      await sos.save();
      await notifyRespondersSOSStopped(sos);
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
