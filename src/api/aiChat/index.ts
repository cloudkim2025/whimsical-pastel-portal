import API from "@/utils/apiClient";
import { ChatSessionMeta } from "@/types/userChatSession";
import { SessionMeta } from "@/types/session";
import { Message } from "@/types/chat";

export const aiChatAPI = {
    // 채팅 세션 목록 조회
    fetchChatSessions: () =>
        API.get<ChatSessionMeta[]>("/aichat/chat_sessions"),

    // 최신 세션 목록 조회
    fetchLatestSessions: () =>
        API.get<SessionMeta[]>("/aichat/sessions/latest"),

    // 특정 세션의 대화 로그 조회
    fetchChatLogs: (chatSessionId: string) =>
        API.get<Message[]>(`/aichat/chat_sessions/${chatSessionId}/logs`),

    // 비어있는 새 세션 생성 (user_id 제거)
    createNewSession: () =>
        API.post<ChatSessionMeta>("/aichat/chat_sessions", {
            initial_question: "",
        }),

    // 내용 기반 새 세션 생성 (user_id 제거)
    createChatSession: (payload: {
        initial_question?: string;
        summary?: string;
        code?: string;
    }) => API.post<ChatSessionMeta>("/aichat/chat_sessions", payload),
};
