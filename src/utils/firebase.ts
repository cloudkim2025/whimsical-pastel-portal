// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: 'AIzaSyA_365G1vjkdVAIXSqVgdrc6AT9pSiBxJ0',
    authDomain: 'aigongbu-a9d0a.firebaseapp.com',
    projectId: 'aigongbu-a9d0a',
    messagingSenderId: '982087722375',
    appId: '1:982087722375:web:4779c19a53b1a66f9c1f22',
};

const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);

export const getFcmToken = async (): Promise<string | null> => {
    try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const token = await getToken(messaging, {
            vapidKey: 'BNUDqNlqpFsHAUfjf-gnwI6xobW8wrUXE5RHPK-zmQ2yUv9M8zciZNc2CR79T9luBUgesWOjeZR9YNs3RcbEMyo',
            serviceWorkerRegistration: registration,
        });
        return token;
    } catch (err) {
        console.error('FCM 토큰 발급 실패:', err);
        return null;
    }
};
