"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Send,
  BotMessageSquare,
  User,
  Loader2,
  Sparkles,
  X,
  Trophy,
  Star,
  Clock,
  Smile,
  PlusCircle,
  MessageSquare,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, animate, easeInOut } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BreathingGame } from "@/components/games/breathing-game";
import { ZenGarden } from "@/components/games/zen-garden";
import { ForestGame } from "@/components/games/forest-game";
import { OceanWaves } from "@/components/games/ocean-waves";
import { Badge } from "@/components/ui/badge";

const glowAnimation = {
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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  //const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatPaused, setIsChatPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stressPrompt, setStressPrompt] = useState<any[] | null>(null);
  const [showActivity, setShowActivity] = useState(false);
  const [showNFTCelebration, setShowNFTCelebration] = useState(false);
  const [isCompletingSession, setIsCompletingSession] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    if (!isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  return (
    <div className="relatice max-w-7xl mx-auto px-4">
      <div className="flex h-[calc(100vh-4rem)] mt-20 gap-6">
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-background rounded-lg border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <BotMessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Mind Haven Therapist</h2>
              <p className="text-sm text-muted-foreground">
                {messages.length} messages
              </p>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                  <div className="relative inline-flex flex-col items-center">
                    <motion.div
                      className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
                      initial="initial"
                      animate="animate"
                      variants={glowAnimation as any}
                    />

                    <div className="relative flex items-center gap-2 text-2xl font-semibold">
                      <div className="relative">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <motion.div
                          className="absolute inset-0 text-primary"
                          initial="initial"
                          animate="animate"
                          variants={glowAnimation as any}
                        >
                          <Sparkles className="w-6 h-6" />
                        </motion.div>
                      </div>
                      <span className="bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                        Mind Haven Therapist
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      I'm here to listen, support, and help you navigate your
                      thoughts. How can I guide you today?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <div className="max-w-3xl mx-auto">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.timestamp.toISOString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "px-6 py-8",
                        msg.role === "assistant"
                          ? "bg-muted/30"
                          : "bg-background"
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="w-8 h-8 shrink-0 mt-1">
                          {msg.role === "assistant" ? (
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                              <BotMessageSquare className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden min-h-[2rem]">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {msg.role === "assistant"
                                ? "Mind Haven Therapist"
                                : "You"}
                            </p>
                            {msg.metadata?.technique && (
                              <Badge variant="secondary" className="text-xs">
                                {msg.metadata.technique}
                              </Badge>
                            )}
                          </div>
                          <div className="prose prose-sm dark:prose-invert leading-relaxed">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                          {msg.metadata?.goal && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Goal: {msg.metadata.goal}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-6 py-8 flex gap-4 bg-muted/30"
                  >
                    <div className="w-8 h-8 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-medium text-sm">
                        Mind Haven Therapist
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Reflecting on your words...
                      </p>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* form to submit chat msg */}

          <div className="border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-4">
            <form
              onSubmit={() => {}}
              className="max-w-3xl mx-auto flex gap-4 items-end relative"
            >
              <div className="flex-1 relative group">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isChatPaused
                      ? "Complete the activity to continue..."
                      : "Tell me what's on your mind..."
                  }
                  className={cn(
                    "w-full resize-none rounded-2xl border bg-background",
                    "p-3 pr-12 min-h-[48px] max-h-[200px]",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    "transition-all duration-200",
                    "placeholder:text-muted-foreground/70",
                    (isTyping || isChatPaused) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                  rows={1}
                  disabled={isTyping || isChatPaused}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      //handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    "absolute right-1.5 bottom-3.5 h-[36px] w-[36px]",
                    "rounded-xl transition-all duration-200",
                    "bg-primary hover:bg-primary/90",
                    "shadow-sm shadow-primary/20",
                    (isTyping || isChatPaused || !message.trim()) &&
                      "opacity-50 cursor-not-allowed",
                    "group-hover:scale-105 group-focus-within:scale-105"
                  )}
                  disabled={isTyping || isChatPaused || !message.trim()}
                  onClick={(e) => {
                    e.preventDefault();
                    //handleSubmit(e);
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <div className="mt-2 text-xs text-center text-muted-foreground">
              Press <kbd className="px-2 py-0.5 rounded bg-muted">Enter ↵</kbd>{" "}
              to send,
              <kbd className="px-2 py-0.5 rounded bg-muted ml-1">
                Shift + Enter
              </kbd>{" "}
              for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyPage;
