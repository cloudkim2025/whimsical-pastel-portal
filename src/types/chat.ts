export type ChatRole = "system" | "user" | "assistant";

export interface Message {
    role: ChatRole;
    content: string;
    timestamp?: string; // 필요 없으면 생략 가능
}