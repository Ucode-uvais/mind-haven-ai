"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Send,
  BotMessageSquare,
  User,
  Loader2,
  Sparkles,
  PlusCircle,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  createChatSession,
  sendChatMessage,
  getChatHistory,
  ChatMessage,
  getAllChatSessions,
  ChatSession,
  deleteChatSession,
} from "@/lib/api/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/api/chat";

const SUGGESTED_QUESTIONS = [
  { text: "How can I manage my anxiety better?" },
  { text: "I've been feeling overwhelmed lately" },
  { text: "Can we talk about improving sleep?" },
  { text: "I need help with work-life balance" },
];

const TYPING_MESSAGES = [
  "Typing...",
  "Reflecting on your words...",
  "Gathering my thoughts...",
  "Thinking...",
];

const glowAnimation: Variants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const TherapyPage = () => {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(
    params.sessionId as string
  );
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [typingIndicator, setTypingIndicator] = useState(TYPING_MESSAGES[0]);

  // Effect to update the typing indicator text randomly
  useEffect(() => {
    if (isTyping) {
      const randomIndex = Math.floor(Math.random() * TYPING_MESSAGES.length);
      setTypingIndicator(TYPING_MESSAGES[randomIndex]);
    }
  }, [isTyping]);

  const loadSessions = async () => {
    try {
      const allSessions = await getAllChatSessions();
      setSessions(allSessions);
      return allSessions;
    } catch (error) {
      console.error("Failed to load sessions:", error);
      toast.error("Failed to load chat sessions.");
      return [];
    }
  };

  const handleNewSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const newSessionId = await createChatSession();
      await loadSessions();
      router.push(`/therapy/${newSessionId}`);
    } catch (error) {
      console.error("Failed to create new session:", error);
      toast.error("Could not create a new session.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Initialize chat session and load history
  useEffect(() => {
    const initChat = async () => {
      const currentSessionId = params.sessionId as string;
      if (!currentSessionId || currentSessionId === "new") {
        setIsLoading(true);
        const allSessions = await loadSessions();
        if (allSessions.length > 0) {
          router.replace(`/therapy/${allSessions[0].sessionId}`);
        } else {
          // This will only be called once if there are no sessions at all
          handleNewSession();
        }
        return;
      }

      try {
        setIsLoading(true);
        setSessionId(currentSessionId);
        const history = await getChatHistory(currentSessionId);
        if (Array.isArray(history)) {
          const formattedHistory = history.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(formattedHistory);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        toast.error("Failed to load chat history.");
        router.push("/therapy/new");
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, [params.sessionId, handleNewSession, router]);

  // Load all sessions on initial mount
  useEffect(() => {
    loadSessions();
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage || isTyping || !sessionId) return;

    setMessage("");
    const userMessage: ChatMessage = {
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response: ApiResponse = await sendChatMessage(
        sessionId,
        currentMessage
      );
      const aiResponse =
        typeof response === "string" ? JSON.parse(response) : response;
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          aiResponse.response ||
          aiResponse.message ||
          "I'm here to support you.",
        timestamp: new Date(),
        metadata: {
          analysis: aiResponse.analysis,
          technique: aiResponse.metadata?.technique || "supportive",
          goal: aiResponse.metadata?.currentGoal || "Provide support",
          progress: aiResponse.metadata?.progress || [],
        },
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, I'm having trouble connecting. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;
    try {
      await deleteChatSession(sessionToDelete);
      const updatedSessions = sessions.filter(
        (s) => s.sessionId !== sessionToDelete
      );
      setSessions(updatedSessions);
      toast.success("Chat session deleted.");

      if (sessionId === sessionToDelete) {
        if (updatedSessions.length > 0) {
          router.push(`/therapy/${updatedSessions[0].sessionId}`);
        } else {
          // The useEffect will handle creating a new session
          router.push("/therapy/new");
        }
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete chat session.");
    } finally {
      setSessionToDelete(null);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSuggestedQuestion = (text: string) => {
    setMessage(text);
    // Use a timeout to allow state to update before submitting
    setTimeout(() => {
      const form = document.getElementById("chat-form") as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }, 0);
  };

  const handleSessionSelect = (selectedSessionId: string) => {
    if (selectedSessionId !== sessionId) {
      router.push(`/therapy/${selectedSessionId}`);
    }
  };

  return (
    <>
      <div className="relative max-w-full mx-auto px-4">
        <div className="flex h-[calc(100vh-4rem)] mt-20 gap-6">
          {/* Sidebar with chat history */}

          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0, x: -50 }}
                animate={{ width: 320, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-80 flex-shrink-0 flex flex-col border-r bg-muted/30"
              >
                <div className="p-4 border-b flex-shrink-0">
                  <Button
                    className="w-full justify-start gap-2 cursor-pointer"
                    onClick={handleNewSession}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <PlusCircle className="w-4 h-4" />
                    )}
                    New Session
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full p-2">
                    <div className="space-y-1">
                      {sessions.map((session) => (
                        <div
                          key={session.sessionId}
                          className={cn(
                            "p-3 rounded-lg text-sm cursor-pointer hover:bg-primary/5 transition-colors relative group",
                            session.sessionId === sessionId
                              ? "bg-primary/10"
                              : "bg-transparent"
                          )}
                          onClick={() => handleSessionSelect(session.sessionId)}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSessionToDelete(session.sessionId);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="font-medium truncate pr-8">
                            {session.messages[0]?.content || "New Chat"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(session.updatedAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background rounded-lg border">
            <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
                </Button>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <BotMessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">
                    Mind Haven Therapist
                  </h2>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
            </div>

            {/* This div now correctly handles the scrolling content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="max-w-2xl w-full space-y-8">
                    <div className="text-center space-y-4">
                      <div className="relative inline-flex flex-col items-center">
                        <motion.div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-32 bg-primary/10 blur-3xl rounded-full"
                          initial="initial"
                          animate="animate"
                          variants={glowAnimation}
                        />
                        <div className="relative flex items-center gap-2 text-2xl font-semibold">
                          <div className="relative">
                            <Sparkles className="w-6 h-6 text-primary" />
                            <motion.div
                              className="absolute inset-0 text-primary"
                              initial="initial"
                              animate="animate"
                              variants={glowAnimation}
                            >
                              <Sparkles className="w-6 h-6" />
                            </motion.div>
                          </div>
                          <h1 className="bg-gradient-to-r from-emerald-600 via-primary to-primary bg-clip-text text-transparent dark:from-primary dark:to-primary/80">
                            Mind Haven Therapist
                          </h1>
                        </div>
                        <p className="text-muted-foreground mt-2">
                          I'm here to listen, support, and help you navigate
                          your thoughts. How can I guide you today?
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {SUGGESTED_QUESTIONS.map((q, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.05 }}>
                          <Button
                            variant="outline"
                            className="w-full h-auto text-left justify-start p-4 bg-muted/50 hover:bg-muted cursor-pointer"
                            onClick={() => handleSuggestedQuestion(q.text)}
                          >
                            {q.text}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={`${msg.timestamp.toISOString()}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex items-start gap-4")}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          msg.role === "assistant"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <BotMessageSquare size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div
                        className={cn(
                          "p-3 rounded-lg max-w-xl prose prose-sm dark:prose-invert",
                          msg.role === "assistant"
                            ? "bg-muted/50"
                            : "bg-primary/10"
                        )}
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <BotMessageSquare size={18} />
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 prose prose-sm dark:prose-invert">
                        <p className="animate-pulse text-muted-foreground italic">
                          {typingIndicator}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t p-4 flex-shrink-0 bg-background/95 backdrop-blur-sm">
              <form id="chat-form" onSubmit={handleSubmit} className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me what is on your mind"
                  className="w-full resize-none rounded-full border bg-muted p-3 pl-4 pr-14 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  rows={1}
                  disabled={isTyping}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <AnimatePresence>
                  {message.trim() && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", duration: 0.4 }}
                      className="absolute right-2.5 bottom-[9px]"
                    >
                      <Button
                        type="submit"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        disabled={isTyping || !message.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <div className="mt-2 text-xs text-center text-muted-foreground">
                Press{" "}
                <kbd className="px-2 py-0.5 rounded bg-muted">Enter ↵</kbd> to
                send,
                <kbd className="px-2 py-0.5 rounded bg-muted ml-1">
                  Shift + Enter
                </kbd>{" "}
                for new line
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog
        open={!!sessionToDelete}
        onOpenChange={() => setSessionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat session. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSessionToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSession}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TherapyPage;
