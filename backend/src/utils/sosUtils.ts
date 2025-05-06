import axios from 'axios';
import {userModel} from "../models/userModel";

async function sendPushNotification(pushToken: string, sosId: string, location: { latitude: number, longitude: number }) {
    if (!pushToken.startsWith('ExponentPushToken')) return;

    await axios.post('https://exp.host/--/api/v2/push/send', {
        to: pushToken,
        title: '🚨 קריאת SOS דחופה',
        body: 'משתמש סמוך אליך זקוק לאפיפן. האם תוכל לסייע?',
        sound: 'default',
        priority: 'high',
        data: {
            type: 'sos',
            screen: 'SOSMap',
            sosId,
            location,
            timestamp: Date.now()
        }
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
}

export async function findAndNotifyNearbyUsers(userId: string, sosId: string, location: { latitude: number, longitude: number }): Promise<void> {
    const nearbyUsers = await userModel.find({
        // _id: { $ne: userId },
        pushToken: { $exists: true, $ne: null }
    });

    for (const user of nearbyUsers) {
        await sendPushNotification(user.pushToken, sosId, location);
    }
}
