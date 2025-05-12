
// Chat session metadata interface
export interface ChatSessionMeta {
  chat_session_id: string;
  user_id: string;
  title: string;
  summary?: string;
  code?: string;
  created_at?: string;
  updated_at?: string;
}
