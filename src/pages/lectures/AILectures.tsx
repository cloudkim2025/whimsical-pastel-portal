import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import LectureSidebar from "@/components/ai/LectureSidebar";
import LectureCodePanel from "@/components/ai/LectureCodePanel";
import LectureChatPanel from "@/components/ai/LectureChatPanel";
import AIBootUpAnimation from "@/components/ai/AIBootUpAnimation";
import SessionLoading from "@/components/ai/SessionLoading";
import { Book, PanelLeft, Bot, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
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
  const [activeSession, setActiveSession] = useState<
      ChatSessionMeta | SessionMeta | null
  >(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [activeCode, setActiveCode] = useState<string>(
      "// 아직 코드 분석 내용이 없습니다."
  );
  const [activeSummary, setActiveSummary] = useState<string>(
      "(요약 없음)"
  );
  // 새로 추가된 state: 코드 분석 전용
  const [analysis, setAnalysis] = useState<string>("");

  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarView, setSidebarView] = useState<"history" | "latest_docs">(
      "history"
  );
  const ws = useRef<WebSocket | null>(null);
  const { toast } = useToast();

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
        toast({
          title: "준비되었습니다",
          description: "AI 코드 분석기가 로드되었습니다",
          variant: "default",
        });
      } catch (err) {
        console.error("초기 데이터 로딩 실패:", err);
        toast({
          title: "로드 실패",
          description: "초기 데이터 로딩에 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [isLoading, toast]);

  const fetchChatSessions = async () => {
    try {

      const res = await API.get<ChatSessionMeta[]>("/chat_sessions", {
        params: { user_id: userId },
      });
      setChatSessions(res.data);
    } catch (err) {
      console.error("fetchChatSessions 오류:", err);
      setChatSessions([]);
    }
  };

  const fetchLatestSessions = async () => {
    try {
      const res = await API.get<SessionMeta[]>("/sessions/latest", {
        params: { user_id: userId },
      });
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
      const chatRes = await API.get<Message[]>(
          `/chat_sessions/${session.chat_session_id}/logs`
      );
      messagesRef.current = [...chatRes.data];
      setChatMessages([...messagesRef.current]);
    } catch {
      messagesRef.current = [
        { role: "system", content: "대화 내역 로드 실패" },
      ];
      setChatMessages([...messagesRef.current]);
    }
    setActiveCode(
        `[요약]\n${session.summary || "(요약 없음)"}\n\n[코드]\n${
            session.code || "(코드 없음)"
        }`
    );
    setActiveSummary(session.summary || "(요약 없음)");
    setAnalysis(""); // 초기화
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

      setActiveCode(
          `[요약]\n${newChatSession.summary || "(요약 없음)"}\n\n[코드]\n${
              newChatSession.code || "(코드 없음)"
          }`
      );
      setActiveSummary(newChatSession.summary || "(요약 없음)");
      setAnalysis("");

      messagesRef.current = [
        {
          role: "system",
          content: `"${session.title}" 최신문서를 기반으로 새 대화가 생성되었습니다.`,
        },
      ];
      setChatMessages([...messagesRef.current]);

      connectWebSocket(newChatSession.chat_session_id);
      await fetchChatSessions();
      setSidebarView("history");

      toast({
        title: "새 세션 생성됨",
        description: `"${session.title}" 기반 세션이 생성되었습니다.`,
        variant: "default",
      });
    } catch (e) {
      console.error("최신문서 기반 chat session 생성 실패:", e);
      messagesRef.current = [
        { role: "system", content: "최신문서 기반 세션 생성 실패" },
      ];
      setChatMessages([...messagesRef.current]);
      toast({
        title: "대화 생성 실패",
        description: "최신문서 기반 대화 생성에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const connectWebSocket = (sessionId?: string) => {
    ws.current?.close();
    const url =
        API.defaults.baseURL!.replace(/^http/, "ws") +
        "/aichat/websocket";
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => {
      const payload = sessionId
          ? { user_id: userId, session_id: sessionId }
          : { user_id: userId };
      socket.send(JSON.stringify(payload));
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const type = msg.type;
        if (type === "analysis") {
          const text = String(msg.analysis);
          // 첫 번째 빈 줄 앞까지를 요약으로, 뒤는 코드로 분리
          const [newSummary, ...rest] = text.split("\n\n");
          setActiveSummary(newSummary.trim());                // 요약 업데이트
          setActiveCode(rest.join("\n\n").trim() || "// 코드 없음"); // 코드 업데이트
          setIsProcessing(false);
          return;
        }

        // **1) analysis 타입 처리**
        if (type === "analysis") {
          const analysisText =
              typeof msg.analysis === "string"
                  ? msg.analysis
                  : String(msg.analysis);
          setAnalysis(analysisText);
          console.log("[DEBUG] analysis 패널 업데이트 완료");
          return;
        }

        // **2) chat 요약 타입**
        if (type === "chat") {
          let content =
              typeof msg.summary === "string"
                  ? msg.summary
                  : String(msg.summary);
          content = content.replace(/^요약[:：]?\s*/i, "").trim();
          messagesRef.current.push({
            role: "assistant",
            content,
          });
        }
        // **3) 시스템 메시지**
        else if (type === "system") {
          messagesRef.current.push({
            role: "system",
            content: msg.message,
          });
        }
        // **4) 에러**
        else if (type === "error") {
          console.error("[ERROR] WebSocket error message:", msg.message);
          messagesRef.current.push({
            role: "system",
            content:
                "아이공 분석 실패: 잠시 후 다시 시도해주세요.",
          });
        }
        // **5) 세션 업데이트**
        else if (type === "session_update") {
          setChatSessions((prev) =>
              prev.map((sess) =>
                  sess.chat_session_id === msg.chat_session_id
                      ? { ...sess, title: msg.new_title }
                      : sess
              )
          );
        }
        // **6) code 탭(순수 코드)**
        else if (type === "code") {
          const raw = msg.code || "";
          const [rawSummary, ...rawCodeArr] = raw.split("\n\n");
          setActiveSummary(rawSummary.replace(/^\[요약\]\s*/i, "").trim());
          setActiveCode(rawCodeArr.join("\n\n").trim() || "// 코드 없음");
        }
      } catch (err) {
        console.error("WebSocket JSON parse error:", err);
        messagesRef.current.push({
          role: "system",
          content:
              "아이공 분석 처리 중 오류 발생: 잠시 후 다시 시도해주세요.",
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
    if (
        !activeSession ||
        !userInput.trim() ||
        isProcessing ||
        ws.current?.readyState !== WebSocket.OPEN
    )
      return;
    setIsProcessing(true);
    messagesRef.current = [
      ...messagesRef.current,
      { role: "user", content: userInput },
    ];
    setChatMessages([...messagesRef.current]);
    ws.current.send(
        JSON.stringify({
          question: userInput,
          language: "en",
          include_code: true,
          summary_only: false,
          documents: [],
        })
    );
    setUserInput("");
  };

  const handleRefresh = () => {
    if (!activeSession || ws.current?.readyState !== WebSocket.OPEN) return;

    setAnalysis("");

    messagesRef.current = [
      ...messagesRef.current,
      { role: "user", content: "아이공" },
    ];
    setChatMessages([...messagesRef.current]);
    setIsProcessing(true);
    ws.current.send(
        JSON.stringify({
          question: "아이공",
          language: "en",
          include_code: true,
          summary_only: false,
          documents: [],
        })
    );
  };

  const handleNewChatSession = async () => {
    try {
      const res = await API.post<ChatSessionMeta>("/chat_sessions", {
        user_id: userId,
        initial_question: "",
      });
      setActiveSession(res.data);
      messagesRef.current = [
        { role: "system", content: "새로운 대화가 시작되었습니다." },
      ];
      setChatMessages([...messagesRef.current]);
      setActiveCode(
          `[요약]\n${res.data.summary || "(요약 없음)"}\n\n[코드]\n${
              res.data.code || "(코드 없음)"
          }`
      );
      setActiveSummary(res.data.summary || "(요약 없음)");
      setAnalysis("");
      connectWebSocket(res.data.chat_session_id);
      await fetchChatSessions();
      setSidebarView("history");
      toast({
        title: "새 대화 생성됨",
        description: "새로운 대화가 시작되었습니다.",
        variant: "default",
      });
    } catch (e) {
      console.error("새 세션 생성 실패:", e);
      toast({
        title: "대화 생성 실패",
        description: "새 대화 생성에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return isBooting ? (
      <AIBootUpAnimation onComplete={() => {}} />
  ) : isLoading ? (
      <SessionLoading />
  ) : (
      <motion.div
          className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-indigo-50/50 to-slate-50/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.6 }}
      >
        <Header />
        <div className="pt-[72px] lg:pt-[92px] flex-1 flex overflow-hidden">
          <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#e0e7ff" }}
              whileTap={{ scale: 0.95 }}
              className="fixed top-[100px] z-50 bg-white shadow-md rounded-full p-2 transition-all"
              style={{
                left: sidebarOpen ? "290px" : "20px",
                transition: "left 0.3s ease-in-out",
              }}
              onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? (
                <PanelLeft className="h-5 w-5 text-indigo-600" />
            ) : (
                <Book className="h-5 w-5 text-indigo-600" />
            )}
          </motion.button>

          <LectureSidebar
              sessions={chatSessions}
              latestSessions={latestSessions}
              activeSession={activeSession}
              selectSession={
                sidebarView === "history" ? selectChatSession : selectLatestSession
              }
              sidebarView={sidebarView}
              setSidebarView={setSidebarView}
              isCollapsed={!sidebarOpen}
              toggleSidebar={() => setSidebarOpen((v) => !v)}
          />

          <AnimatePresence mode="wait">
            {!activeSession ? (
                <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-10 text-center"
                >
                  <div className="bg-indigo-100 p-5 rounded-full mb-6">
                    <Bot className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-medium text-slate-800 mb-4">
                    AI 아이공과 함께하는 학습
                  </h1>
                  <p className="text-lg text-slate-600 max-w-md mb-8">
                    최신 개발 문서와 개발 지식을 아주쉽고 간결하게 제공합니다.
                    아이공과 함께, 더 나은 개발자가 되어 보세요.
                  </p>
                  <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNewChatSession}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                  >
                    <Zap className="h-5 w-5" />
                    <span> 공부 시작하기</span>
                  </motion.button>
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col md:flex-row max-w-screen-2xl mx-auto gap-4 p-4"
                >
                  <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-full md:w-[55%] rounded-xl overflow-hidden shadow-lg"
                  >
                    <LectureCodePanel
                        session={activeSession}
                        onRefresh={handleRefresh}
                    />
                  </motion.div>
                  <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-full md:w-[45%] flex flex-col rounded-xl overflow-hidden shadow-lg"
                  >
                    <LectureChatPanel
                        messages={chatMessages}
                        userInput={userInput}
                        setUserInput={setUserInput}
                        isProcessing={isProcessing}
                        onSendMessage={handleSendMessage}
                        onNewChatSession={handleNewChatSession}
                    />
                  </motion.div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
  );
};

export default AILectures;