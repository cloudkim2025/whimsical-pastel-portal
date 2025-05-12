// src/types/session.ts

export interface OutlinePart {
    part_id: string;
    title: string;
    description: string;
    lines?: number[];
}

export interface SessionMeta {
    session_id: string;
    user_id: string;
    title: string;
    summary: string;
    outline: OutlinePart[];
    documents?: string[];
    code?: string;
    language?: string;
    created_at: string;
}
