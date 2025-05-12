// types/userChatSession.ts

export interface OutlinePart {
    part_id: string;
    title: string;
    description: string;
    lines?: number[] | null;
}

export interface ChatSessionMeta {
    chat_session_id: string;
    user_id: string;
    title: string;
    summary?: string;
    outline: OutlinePart[];
    code?: string;
    created_at: string;
}
