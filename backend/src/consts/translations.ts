import {IUser} from "@shared/types";

export const translations = {
    en: {
        sosSent: {
            title: '🚨 SOS Alert',
            body: 'A nearby user needs an EpiPen. Can you help?',
        },
        sosResponse: {
            title: '📍 Someone responded to your SOS',
            body: (responder: IUser) => `${responder.firstName} ${responder.lastName} shared their location and contact info.`,
        },
        sosStopped: {
            title: '❌ SOS Cancelled',
            body: (user: IUser) => `${user.firstName} has cancelled the SOS request.`,
        },
    },
    he: {
        sosSent: {
            title: '🚨 קריאת SOS דחופה',
            body: 'משתמש סמוך אליך זקוק לאפיפן. האם תוכל לסייע?',
        },
        sosResponse: {
            title: '📍 מישהו הגיב לקריאה שלך',
            body: (responder: IUser) => `${responder.firstName} ${responder.lastName} שיתף איתך את מיקומו ופרטי ההתקשרות.`,
        },
        sosStopped: {
            title: '❌ קריאת החירום בוטלה',
            body: (user: IUser) => `${user.firstName} ביטל את קריאת ה-SOS.`,
        },
    },
};