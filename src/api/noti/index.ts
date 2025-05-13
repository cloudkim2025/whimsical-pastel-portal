import API from '@/utils/apiClient';

export type RecipientType = 'ALL' | 'INSTRUCTORS' | 'STUDENTS';

// 공통 타입 정의
interface BaseMessagePayload {
    recipientType: RecipientType;
}

interface EmailPayload extends BaseMessagePayload {
    subject: string;
    content: string;
}

interface PushPayload extends BaseMessagePayload {
    title: string;
    body: string;
}

interface ScheduledPayload {
    scheduleTime: string; // ISO 8601: e.g., "2025-05-13T09:10:00"
}

export const notiAPI = {
    // 이메일 즉시 전송
    sendEmail: (payload: EmailPayload) =>
        API.post('/noti/emails', payload),

    // 이메일 예약 전송
    sendScheduledEmail: (payload: EmailPayload & ScheduledPayload) =>
        API.post('/noti/emails/scheduled', payload),

    // 푸시 즉시 전송
    sendPushNotification: (payload: PushPayload) =>
        API.post('/noti/push', payload),

    // 푸시 예약 전송
    sendScheduledPushNotification: (payload: PushPayload & ScheduledPayload) =>
        API.post('/noti/push/scheduled', payload),
};
