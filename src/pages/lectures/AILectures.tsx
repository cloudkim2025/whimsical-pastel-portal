import React, {useEffect, useRef, useState} from "react";
import Header from "@/components/Header";
import LectureSidebar from "@/components/ai/LectureSidebar";
import LectureCodePanel from "@/components/ai/LectureCodePanel";
import LectureChatPanel from "@/components/ai/LectureChatPanel";
import AIBootUpAnimation from "@/components/ai/AIBootUpAnimation";
import SessionLoading from "@/components/ai/SessionLoading";
import {Book, Bot, PanelLeft, Zap} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import {useToast} from "@/hooks/use-toast";
import API from "@/utils/apiClient";
import {ChatSessionMeta} from "@/types/userChatSession";
import {SessionMeta} from "@/types/session";
import {useAuth} from "@/contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {aiChatAPI} from "@/api/aiChat";
import { Message } from "@/types/chat";
import { tokenManager } from "@/utils/tokenManager";
import {GatewayURL} from "@/utils/baseURL.ts";

const AILectures: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const userId = 41;


  // ✅ 부팅 애니메이션 타이머 처리
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

// ✅ 사용자 로그인 여부 검사
  useEffect(() => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "계속하려면 로그인해주세요.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, toast, navigate]);

// ✅ 초기 데이터 로딩 (세션 목록 + 최신 문서)
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
        console.error("[초기 로딩 실패]", err);
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

// ✅ WebSocket 연결 시도 (userId, sessionId 둘 다 있을 때만)
//   useEffect(() => {
//     if (!user?.userId) return;              // 아직 user 없음
//     if (!activeSession?.chat_session_id) return;  // 아직 세션 없음
//
//     const token = tokenManager.getToken();
//     if (!token) {
//       console.warn("[WebSocket] 토큰이 아직 없음 → 500ms 후 재시도");
//       const retry = setTimeout(() => {
//         connectWebSocket(activeSession.chat_session_id);
//       }, 500);
//
//       return () => clearTimeout(retry);
//     }
//
//     connectWebSocket(activeSession.chat_session_id);
//   }, [user?.userId, activeSession?.chat_session_id]);

  // 🔹 1. 채팅 세션 목록 불러오기
  const fetchChatSessions = async () => {
    try {
      const res = await aiChatAPI.fetchChatSessions();
      console.log("[DEBUG] ChatSessions:", res.data);
      setChatSessions(res.data);
    } catch (err) {
      console.error("[ERROR] fetchChatSessions 실패:", err);
      setChatSessions([]);
    }
  };

// 🔹 2. 최신 문서 기반 세션 불러오기
  const fetchLatestSessions = async () => {
    try {
      const res = await aiChatAPI.fetchLatestSessions();
      console.log("[DEBUG] LatestSessions:", res.data);
      setLatestSessions(res.data);
    } catch (err) {
      console.error("[ERROR] fetchLatestSessions 실패:", err);
      setLatestSessions([]);
    }
  };

// 🔹 3. 기존 세션 선택 시
  const selectChatSession = async (session: ChatSessionMeta) => {
    console.log("[INFO] 기존 세션 선택됨:", session.chat_session_id);
    setActiveSession(session);
    messagesRef.current = [];

    try {
      const chatRes = await aiChatAPI.fetchChatLogs(session.chat_session_id);
      messagesRef.current = [...chatRes.data];
      setChatMessages([...messagesRef.current]);
    } catch (err) {
      console.error("[ERROR] 채팅 로그 불러오기 실패:", err);
      messagesRef.current = [
        { role: "system", content: "대화 내역 로드 실패" },
      ];
      setChatMessages([...messagesRef.current]);
    }

    setActiveCode(formatCodeBlock(session.summary, session.code));
    setActiveSummary(session.summary || "(요약 없음)");
    setAnalysis("");
    connectWebSocket(session.chat_session_id);
  };

// 🔹 4. 최신 문서 기반 세션 생성 시
  const selectLatestSession = async (session: SessionMeta) => {
    console.log("[INFO] 최신 문서 기반 세션 생성 시도:", session.title);
    
    setIsProcessing(true);
    try {
      // 최대 3번까지 재시도
      let retryCount = 0;
      let success = false;
      let newChatSession;
      
      while (retryCount < 3 && !success) {
        try {
          const res = await aiChatAPI.createChatSession({
            initial_question: session.title,
            summary: session.summary,
            code: session.code,
          });
          
          newChatSession = res.data;
          success = true;
        } catch (error) {
          console.warn(`[RETRY ${retryCount + 1}/3] 세션 생성 재시도 중...`);
          retryCount++;
          
          if (retryCount >= 3) throw error;
          
          // 재시도 전 잠시 대기
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (success && newChatSession) {
        setActiveSession(newChatSession);
        setActiveCode(formatCodeBlock(newChatSession.summary, newChatSession.code));
        setActiveSummary(newChatSession.summary || "(요약 없음)");
        setAnalysis("");

        messagesRef.current = [
          {
            role: "system",
            content: `"${session.title}" 최신 문서를 기반으로 새 대화가 생성되었습니다.`,
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
      }
    } catch (err) {
      console.error("[ERROR] 최신 문서 기반 세션 생성 실패:", err);
      messagesRef.current = [
        { role: "system", content: "서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요." },
      ];
      setChatMessages([...messagesRef.current]);

      toast({
        title: "대화 생성 실패",
        description: "서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

// 🔸 유틸 함수 (가독성 보완용)
  const formatCodeBlock = (summary?: string, code?: string): string => {
    return `[요약]\n${summary || "(요약 없음)"}\n\n[코드]\n${code || "(코드 없음)"}`;
  };


  const connectWebSocket = (sessionId?: string) => {
    const accessToken = tokenManager.getToken();

    if (!userId || !accessToken) {
      console.error("[WebSocket] 유저 정보 또는 토큰 없음 → 연결 생략");
      return;
    }

    // 기존 연결 종료
    ws.current?.close();

    // Base URL 가져오기
    const baseHttp = API.defaults.baseURL || GatewayURL.local;

    // 프로토콜 변환 로직 수정
    let wsUrl;
    if (baseHttp.startsWith("https://")) {
      // HTTPS -> WSS (보안 웹소켓)
      wsUrl = baseHttp.replace(/^https:\/\//, "wss://");
    } else if (baseHttp.startsWith("http://")) {
      // HTTP -> WS (일반 웹소켓)
      wsUrl = baseHttp.replace(/^http:\/\//, "ws://");
    } else {
      // 프로토콜이 없는 경우 현재 페이지 프로토콜 기준으로 결정
      const isSecure = window.location.protocol === "https:";
      wsUrl = `${isSecure ? "wss" : "ws"}://${baseHttp}`;
    }

    // 쿼리 파라미터 생성
    const query = new URLSearchParams({
      token: accessToken,
      user_id: String(userId),
      ...(sessionId ? { session_id: sessionId } : {}),
    });

    // WebSocket URL 생성
    const fullWsUrl = `${wsUrl}/aichat/websocket?${query.toString()}`;

    console.log("[WebSocket] 연결 시도:", fullWsUrl);

    try {
      const socket = new WebSocket(fullWsUrl);
      ws.current = socket;

      // 연결 성공 핸들러
      socket.onopen = () => {
        console.log("[WebSocket] 연결 성공!");
      };

      console.log("[WebSocket] 연결 시도:", socket.url);

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log("[WebSocket 메시지 수신]:", msg);
          const type = msg.type;

          switch (type) {
            case "analysis":
              const [summary, ...rest] = String(msg.analysis).split("\n\n");
              setActiveSummary(summary.trim());
              setActiveCode(rest.join("\n\n").trim() || "// 코드 없음");
              break;

            case "chat":
              messagesRef.current.push({
                role: "assistant",
                content: String(msg.summary).replace(/^요약[:：]?\s*/i, "").trim(),
              });
              break;

            case "system":
              messagesRef.current.push({ role: "system", content: msg.message });
              break;

            case "error":
              console.error("[WebSocket ERROR]:", msg.message);
              messagesRef.current.push({
                role: "system",
                content: "아이공 분석 실패: 잠시 후 다시 시도해주세요.",
              });
              break;

            case "session_update":
              setChatSessions((prev) =>
                  prev.map((s) =>
                      s.chat_session_id === msg.chat_session_id
                          ? { ...s, title: msg.new_title }
                          : s
                  )
              );
              break;

            case "code":
              const [codeSummary, ...codeBody] = String(msg.code || "").split("\n\n");
              setActiveSummary(codeSummary.replace(/^\[요약\]\s*/i, "").trim());
              setActiveCode(codeBody.join("\n\n").trim() || "// 코드 없음");
              break;

            default:
              console.warn("[WebSocket] 알 수 없는 타입:", type);
          }
        } catch (err) {
          console.error("WebSocket 메시지 처리 실패:", err);
          messagesRef.current.push({
            role: "system",
            content: "아이공 분석 처리 중 오류 발생: 잠시 후 다시 시도해주세요.",
          });
        } finally {
          setChatMessages([...messagesRef.current]);
          setIsProcessing(false);
        }
      };

      socket.onerror = (err) => {
        console.error("[WebSocket ERROR]:", err);
        setIsProcessing(false);
      };

      socket.onclose = () => {
        console.warn("[WebSocket] 연결 종료됨");
      };
    } catch (error) {
      console.error("[WebSocket] 연결 시도 중 오류:", error);
      setIsProcessing(false);
    }
  };


  const handleSendMessage = () => {
    if (
        !activeSession ||
        !userInput.trim() ||
        isProcessing ||
        ws.current?.readyState !== 1 /* WebSocket.OPEN */
    ) {
      return;
    }

    setIsProcessing(true);

    messagesRef.current.push({ role: "user", content: userInput });
    setChatMessages([...messagesRef.current]);

    ws.current?.send(
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
    if (!activeSession || ws.current?.readyState !== 1 /* WebSocket.OPEN */) return;

    setAnalysis("");
    setIsProcessing(true);

    messagesRef.current.push({ role: "user", content: "아이공" });
    setChatMessages([...messagesRef.current]);

    try {
      ws.current?.send(
          JSON.stringify({
            question: "아이공",
            language: "en",
            include_code: true,
            summary_only: false,
            documents: [],
          })
      );
    } catch (err) {
      console.error("WebSocket 메시지 처리 실패:", err);
      messagesRef.current.push({
        role: "system",
        content: "아이공 분석 처리 중 오류 발생: 잠시 후 다시 시도해주세요.",
      });
      setChatMessages([...messagesRef.current]);
      setIsProcessing(false);
    }
  };

  const handleNewChatSession = async () => {
    setIsProcessing(true);
    try {
      // 최대 3번까지 재시도
      let retryCount = 0;
      let success = false;
      let newSession;
      
      while (retryCount < 3 && !success) {
        try {
          const res = await aiChatAPI.createNewSession();
          newSession = res.data;
          success = true;
        } catch (error) {
          console.warn(`[RETRY ${retryCount + 1}/3] 새 세션 생성 재시도 중...`);
          retryCount++;
          
          if (retryCount >= 3) throw error;
          
          // 재시도 전 잠시 대기
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (success && newSession) {
        setActiveSession(newSession);

        messagesRef.current = [
          { role: "system", content: "새로운 대화가 시작되었습니다." },
        ];
        setChatMessages([...messagesRef.current]);

        setActiveSummary(newSession.summary || "(요약 없음)");
        setActiveCode(`[요약]\n${newSession.summary || "(요약 없음)"}\n\n[코드]\n${newSession.code || "(코드 없음)"}`);      
        setAnalysis("");

        connectWebSocket(newSession.chat_session_id);
        await fetchChatSessions();
        setSidebarView("history");
        
        toast({
          title: "새 대화 생성됨",
          description: "새로운 대화가 시작되었습니다.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("[ERROR] 새 세션 생성 실패:", err);
      toast({
        title: "대화 생성 실패",
        description: "서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
      // 오류 발생 시 빈 메시지 표시
      messagesRef.current = [
        { role: "system", content: "서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요." },
      ];
      setChatMessages([...messagesRef.current]);
    } finally {
      setIsProcessing(false);
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