
import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import LectureSidebar from "@/components/ai/LectureSidebar";
import LectureCodePanel from "@/components/ai/LectureCodePanel";
import LectureChatPanel from "@/components/ai/LectureChatPanel";
import AIBootUpAnimation from "@/components/ai/AIBootUpAnimation";
import SessionLoading from "@/components/ai/SessionLoading";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import API from "@/utils/AIapiClient";
import { ChatSessionMeta } from "@/types/userChatSession";
import { SessionMeta } from "@/types/session";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp?: string;
}

const AILectures: React.FC = () => {
  const userId = "test_user";
  const [isBooting, setIsBooting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSessionMeta[]>([]);
  const [latestSessions, setLatestSessions] = useState<SessionMeta[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSessionMeta | SessionMeta | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [activeCode, setActiveCode] = useState<string>("// 아직 코드 분석 내용이 없습니다.");
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarView, setSidebarView] = useState<"history" | "latest_docs">("history");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
      setIsLoading(true);
    }, 2000);
    return () => {
      clearTimeout(timer);
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchChatSessions(), fetchLatestSessions()]);
        setShowContent(true);
      } catch (err) {
        console.error("초기 데이터 로딩 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [isLoading]);

  const fetchChatSessions = async () => {
    try {
      const res = await API.get<ChatSessionMeta[]>("/chat_sessions", { params: { user_id: userId } });
      setChatSessions(res.data);
    } catch (err) {
      console.error("fetchChatSessions 오류:", err);
      setChatSessions([]);
    }
  };

  const fetchLatestSessions = async () => {
    try {
      const res = await API.get<SessionMeta[]>("/sessions/latest", { params: { user_id: userId } });
      setLatestSessions(res.data);
    } catch (err) {
      console.error("fetchLatestSessions 오류:", err);
      setLatestSessions([]);
    }
  };

  const selectChatSession = async (session: ChatSessionMeta) => {
    setActiveSession(session);
    messagesRef.current = [];
    try {
      const chatRes = await API.get<Message[]>(`/chat_sessions/${session.chat_session_id}/logs`);
      messagesRef.current = [...chatRes.data];
      setChatMessages([...messagesRef.current]);
    } catch {
      messagesRef.current = [{ role: "system", content: "대화 내역 로드 실패" }];
      setChatMessages([...messagesRef.current]);
    }
    setActiveCode(`[요약]\n${session.summary || "(요약 없음)"}\n\n[코드]\n${session.code || "(코드 없음)"}`);
    connectWebSocket(session.chat_session_id);
  };

  const selectLatestSession = async (session: SessionMeta) => {
    try {
      const createRes = await API.post<ChatSessionMeta>("/chat_sessions", {
        user_id: userId,
        initial_question: session.title,
        summary: session.summary,
        code: session.code,
      });

      const newChatSession = createRes.data;
      setActiveSession(newChatSession);

      setActiveCode(`[요약]\n${newChatSession.summary || "(요약 없음)"}\n\n[코드]\n${newChatSession.code || "(코드 없음)"}`);

      messagesRef.current = [
        { role: "system", content: `"${session.title}" 최신문서를 기반으로 새 대화가 생성되었습니다.` },
      ];
      setChatMessages([...messagesRef.current]);

      connectWebSocket(newChatSession.chat_session_id);
      await fetchChatSessions();
      setSidebarView("history");
    } catch (e) {
      console.error("최신문서 기반 chat session 생성 실패:", e);
      messagesRef.current = [{ role: "system", content: "최신문서 기반 세션 생성 실패" }];
      setChatMessages([...messagesRef.current]);
    }
  };

  const connectWebSocket = (sessionId?: string) => {
    ws.current?.close();
    const url = API.defaults.baseURL!.replace(/^http/, "ws") + "/aichat/websocket";
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => {
      const payload = sessionId ? { user_id: userId, session_id: sessionId } : { user_id: userId };
      socket.send(JSON.stringify(payload));
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const type = msg.type;

        if (type === "chat") {
          let content = typeof msg.summary === "string" ? msg.summary : String(msg.summary);
          content = content.replace(/^요약[:：]?\s*/i, "").trim();
          messagesRef.current.push({ role: "assistant", content });
        } else if (type === "system") {
          messagesRef.current.push({ role: "system", content: msg.message });
        } else if (type === "error") {
          console.error("[ERROR] WebSocket error message:", msg.message);
          messagesRef.current.push({
            role: "system",
            content: "아이공 분석 실패: 잠시 후 다시 시도해주세요."
          });
        } else if (type === "session_update") {
          setChatSessions((prev) =>
              prev.map((sess) =>
                  sess.chat_session_id === msg.chat_session_id ? { ...sess, title: msg.new_title } : sess
              )
          );
        } else if (type === "code") {
          setActiveCode(`${msg.code || "(코드 없음)"}`);
        }
      } catch (err) {
        console.error("WebSocket JSON parse error:", err);
        messagesRef.current.push({
          role: "system",
          content: "아이공 분석 처리 중 오류 발생: 잠시 후 다시 시도해주세요."
        });
      } finally {
        setChatMessages([...messagesRef.current]);
        setIsProcessing(false);
      }
    };

    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
      setIsProcessing(false);
    };

    socket.onclose = () => {
      console.warn("WebSocket closed");
    };
  };

  const handleSendMessage = () => {
    if (!activeSession || !userInput.trim() || isProcessing || ws.current?.readyState !== WebSocket.OPEN) return;
    setIsProcessing(true);
    messagesRef.current = [...messagesRef.current, { role: "user", content: userInput }];
    setChatMessages([...messagesRef.current]);
    const payload = { question: userInput, language: "en", include_code: true, summary_only: false, documents: [] };
    ws.current.send(JSON.stringify(payload));
    setUserInput("");
  };

  const handleNewChatSession = async () => {
    try {
      const res = await API.post<ChatSessionMeta>("/chat_sessions", { user_id: userId, initial_question: "" });
      setActiveSession(res.data);
      messagesRef.current = [{ role: "system", content: "새로운 대화가 시작되었습니다." }];
      setChatMessages([...messagesRef.current]);
      setActiveCode(`[요약]\n${res.data.summary || "(요약 없음)"}\n\n[코드]\n${res.data.code || "(코드 없음)"}`);
      connectWebSocket(res.data.chat_session_id);
      await fetchChatSessions();
      setSidebarView("history");
    } catch (e) {
      console.error("새 세션 생성 실패:", e);
    }
  };

  return isBooting ? (
      <AIBootUpAnimation onComplete={() => {}} />
  ) : isLoading ? (
      <SessionLoading />
  ) : (
      <motion.div
          className="h-screen overflow-hidden flex flex-col bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
      >
        <Header />
        <div className="pt-[72px] lg:pt-[92px] flex-1 flex overflow-hidden">
          <Button
              variant="ghost"
              size="icon"
              className={`fixed top-[100px] z-50 transition-all ${sidebarOpen ? "left-[210px]" : "left-2"}`}
              onClick={() => setSidebarOpen((v) => !v)}
          >
            <Book className="h-5 w-5 text-ghibli-forest" />
          </Button>
          <LectureSidebar
              sessions={chatSessions}
              latestSessions={latestSessions}
              activeSession={activeSession}
              selectSession={sidebarView === "history" ? selectChatSession : selectLatestSession}
              sidebarView={sidebarView}
              setSidebarView={setSidebarView}
              isCollapsed={!sidebarOpen}
              toggleSidebar={() => setSidebarOpen((v) => !v)}
          />
          <div className="flex-1 flex flex-col md:flex-row max-w-screen-2xl mx-auto">
            <div className="w-full md:w-1/2 border-r bg-black mr-10">
              <LectureCodePanel session={activeSession} />
            </div>
            <div className="w-full md:w-1/2 flex flex-col border border-gray-300 rounded">
              <LectureChatPanel
                  messages={chatMessages}
                  userInput={userInput}
                  setUserInput={setUserInput}
                  isProcessing={isProcessing}
                  onSendMessage={handleSendMessage}
                  onNewChatSession={handleNewChatSession}
              />
            </div>
          </div>
        </div>
      </motion.div>
  );
};

export default AILectures;
