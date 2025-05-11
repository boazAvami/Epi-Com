import axios from 'axios';
import {userModel} from "../models/userModel";
import {ESOSNotificationType, ILocation, IUser} from "@shared/types";
import {ISOS} from "../models/sosModel";
import { EpiPenModel } from '../models/epipenModel';
import mongoose from "mongoose";
const PUSH_REQUESTS_URL: string = 'https://exp.host/--/api/v2/push/send';

const createSendSOSPayload = (token: string, sosId: string, userId: string, userLocation: ILocation) => {
    return {
        to: token,
        title: '🚨 קריאת SOS דחופה',
        body: 'משתמש סמוך אליך זקוק לאפיפן. האם תוכל לסייע?',
        sound: 'default',
        priority: 'high',
        data: {
            type: ESOSNotificationType.SOS_SENT,
            sosId,
            userId,
            location: userLocation,
            timestamp: Date.now()
        }
    };
}

const createSOSResponsePayload = (token: string, responder: IUser, userLocation: ILocation) => {
    return {
        to: token,
        title: '📍 מישהו הגיב לקריאה שלך',
        body: `${responder.firstName + ' ' + responder.lastName} שיתף איתך את מיקומו ופרטי ההתקשרות.`,
        sound: 'default',
        priority: 'high',
        data: {
            type: ESOSNotificationType.SOS_RESPONSE,
            responder,
            location: userLocation,
            timestamp: Date.now()
        }
    };
}

const createSOSStoppedPayload = (token: string, sosUser: IUser) => {
    return {
        to: token,
        title: '❌ קריאת החירום בוטלה',
        body: `${sosUser.firstName} ביטל את קריאת ה-SOS.`,
        sound: 'default',
        priority: 'default',
        data: {
            type: ESOSNotificationType.SOS_STOPPED,
            user: sosUser,
            timestamp: Date.now()
        }
    };
};

async function sendPushNotification(payload: any) {
    if (!payload.to.startsWith('ExponentPushToken')) return;

    await axios.post(PUSH_REQUESTS_URL, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
}

export async function getNearbyUserIdsWithEpipens(
    location: ILocation,
    radiusInMeters: number = 1000,
    excludeUserId: string
): Promise<string[]> {
    const nearbyEpipens = await EpiPenModel.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: 'Point',
                    coordinates: [location.longitude, location.latitude],
                },
                $maxDistance: radiusInMeters,
            },
        },
    });

    return [
        ...new Set(
            nearbyEpipens
                .map(epi => epi.userId.toString())
                .filter(id => id !== excludeUserId)
        ),
    ];
}

export function filterAlreadyNotifiedUsers(nearbyUserIds: string[], sos: ISOS, callerId: string): string[] {
    const already = new Set((sos as any).notifiedUserIds?.map(id => id.toString()) ?? []);

    return nearbyUserIds.filter(id => id !== callerId && !already.has(id));
}

export async function notifyUsersAndUpdateSOS(
    userIds: string[],
    sos: ISOS,
    location: ILocation,
    senderId: string,
    sosId: string
): Promise<number> {
    if (userIds.length === 0) return 0;

    const users = await userModel.find({
        _id: { $in: userIds },
        pushToken: { $exists: true, $ne: null },
    });

    for (const user of users) {
        await sendPushNotification(
            createSendSOSPayload(user.pushToken, sosId, senderId, location)
        );
    }

    sos.notifiedUserIds = [...(sos.notifiedUserIds ?? []), ...userIds.map(id => new mongoose.Types.ObjectId(id))];
    await sos.save();

    return users.length;
}

export async function notifyUserResponse(responderId: string, sos: ISOS, location: ILocation): Promise<void> {
    const sosUser: IUser = await userModel.findOne({_id: sos.userId});
    const responder: IUser = await userModel.findOne({_id: responderId});

    if (sosUser) {
        await sendPushNotification(createSOSResponsePayload(sosUser.pushToken, responder, location));
    } else {
        throw new Error('Error while trying to respond to SOS - SOS user not found');
    }
}

export async function notifyRespondersSOSStopped(sos: ISOS): Promise<void> {
    const sosUser: IUser | null = await userModel.findOne({ _id: sos.userId });
    if (!sosUser) throw new Error('SOS user not found');

    const recipients = sos.responders ?? [];

    if (!recipients || recipients.length === 0) {
        console.log('No recipients to notify');
        return;
    }

    const users = await userModel.find({
        _id: { $in: recipients },
        pushToken: { $exists: true, $ne: null },
    });

    for (const user of users) {
        await sendPushNotification(createSOSStoppedPayload(user.pushToken, sosUser));
    }
}

