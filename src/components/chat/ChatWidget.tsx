"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Ask me anything...",
  "What's on the menu?",
  "Are you open right now?",
  "Any spicy items?",
  "Where are you located?",
  "Do you deliver?",
];

const GREETINGS = [
  "Craving chai? ☕",
  "Curious about today's menu?",
  "Got a question? Ask away!",
  "I'm here if you need anything 👋",
  "Ask me anything ✨",
];

const QUICK_QUESTIONS = [
  { emoji: "🍵", label: "What's on the menu?" },
  { emoji: "⏰", label: "Are you open right now?" },
  { emoji: "📍", label: "Where are you located?" },
  { emoji: "🚚", label: "Do you deliver?" },
  { emoji: "🌶️", label: "Any spicy items?" },
  { emoji: "💸", label: "What's the price range?" },
];

const WELCOME: ChatMessage = {
  role: "assistant",
  content: `Hi! I'm the ${siteConfig.name} assistant ☕ Ask me about our menu, prices, hours, or anything else about the cafe.`,
};

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
    </span>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasStartedChat = messages.length > 1;

  // Lock page scroll while the full-screen chat is open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Greeting bubble: pop in a couple seconds after load, then periodically
  useEffect(() => {
    if (isOpen) {
      setShowBubble(false);
      return;
    }
    const showTimer = setTimeout(() => {
      setGreetingIndex((i) => (i + 1) % GREETINGS.length);
      setShowBubble(true);
    }, 2000);
    return () => clearTimeout(showTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!showBubble) return;
    const hideTimer = setTimeout(() => setShowBubble(false), 6000);
    return () => clearTimeout(hideTimer);
  }, [showBubble]);

  useEffect(() => {
    if (isOpen || showBubble) return;
    const interval = setInterval(() => {
      setGreetingIndex((i) => (i + 1) % GREETINGS.length);
      setShowBubble(true);
    }, 25000);
    return () => clearInterval(interval);
  }, [isOpen, showBubble]);

  // Rotating input placeholder while the panel is open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % SUGGESTIONS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-scroll to the newest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `Sorry, I'm having trouble connecting right now. Please call us at ${siteConfig.contact.phone}.`,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <>
      {/* Full-screen chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background"
          >
            {/* Decorative color blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="animated-bg-blob-a absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
              <div className="animated-bg-blob-b absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
              <div className="animated-bg-blob-c absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-brand-cream/10 blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-primary to-primary/80 px-4 py-3.5 text-primary-foreground sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 text-xl">
                  ☕
                </span>
                <div>
                  <p className="font-display text-base uppercase tracking-wide">{siteConfig.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online now — ask me anything
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-primary-foreground/15"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="mx-auto flex max-w-2xl flex-col gap-4">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex items-end gap-2", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {m.role === "assistant" && (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base">
                        ☕
                      </span>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                        m.role === "user"
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : "rounded-bl-sm border border-border bg-card text-foreground",
                      )}
                    >
                      {m.content || (isStreaming && i === messages.length - 1 ? <TypingDots /> : null)}
                    </div>
                  </motion.div>
                ))}

                {/* Quick questions — shown before the conversation starts */}
                {!hasStartedChat && (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                    className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"
                  >
                    {QUICK_QUESTIONS.map((q) => (
                      <motion.button
                        key={q.label}
                        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                        onClick={() => sendMessage(q.label)}
                        className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm font-medium shadow-sm transition-colors hover:border-primary hover:bg-primary/5"
                      >
                        <span className="text-lg">{q.emoji}</span>
                        {q.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="relative z-10 border-t border-border bg-background/80 px-4 py-4 backdrop-blur sm:px-6"
            >
              <div className="mx-auto flex max-w-2xl items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={SUGGESTIONS[placeholderIndex]}
                  className="h-12 flex-1 rounded-full border border-input bg-card px-5 text-sm outline-none transition-colors focus:border-primary"
                  disabled={isStreaming}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-opacity disabled:opacity-40"
                  aria-label="Send message"
                >
                  {isStreaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher + greeting bubble (hidden while chat is open) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ opacity: 0, y: -18, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="relative max-w-[16rem] rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 py-2.5 pl-2.5 pr-3.5 shadow-xl shadow-primary/10"
              >
                <button
                  onClick={() => setShowBubble(false)}
                  aria-label="Dismiss"
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-sm transition-colors hover:bg-muted-foreground/20"
                >
                  <X className="h-2.5 w-2.5" />
                </button>

                <button
                  onClick={() => {
                    setIsOpen(true);
                    setShowBubble(false);
                  }}
                  className="flex w-full items-center gap-2.5 text-left"
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base">
                    <span aria-hidden>☕</span>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-foreground">
                    {GREETINGS[greetingIndex]}
                  </span>
                </button>

                {/* speech-bubble tail pointing down at the launcher */}
                <span className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 rounded-[2px] border-b border-r border-primary/20 bg-card" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        </div>
      )}
    </>
  );
}
