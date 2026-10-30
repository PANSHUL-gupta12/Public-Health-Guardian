import { useState, useRef, useEffect } from "react";
import { Bot, Send, Heart, Activity, User, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getChatModel } from "@/lib/gemini";
import { cn } from "@/lib/utils";

interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
}

const now = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const welcomeMessage: Msg = {
  id: 1,
  from: "bot",
  text: "Hello! I'm your Public Health Guardian AI assistant powered by Gemini. How can I help you with your health questions today?",
  time: now(),
};

const quickActions = [
  {
    label: "Common Symptoms",
    color: "text-teal border-teal/40 hover:bg-teal/10",
  },
  {
    label: "Medication Info",
    color: "text-sky-300 border-sky-400/40 hover:bg-sky-400/10",
  },
  {
    label: "Healthy Habits",
    color: "text-emerald-glow border-emerald/40 hover:bg-emerald/10",
  },
  {
    label: "Emergency Info",
    color: "text-fuchsia-300 border-fuchsia-400/40 hover:bg-fuchsia-400/10",
  },
];

export const ChatPage = () => {
  const [messages, setMessages] = useState<Msg[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Msg = {
      id: Date.now(),
      from: "user",
      text: trimmed,
      time: now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Initialize chat session if needed
      if (!chatRef.current) {
        const model = getChatModel();
        chatRef.current = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "Hello" }],
            },
            {
              role: "model",
              parts: [
                {
                  text: "Hello! I'm your Public Health Guardian AI. How can I help you today?",
                },
              ],
            },
          ],
        });
      }

      const result = await chatRef.current.sendMessage(trimmed);
      const response = result.response.text();

      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text: response,
          time: now(),
        },
      ]);
    } catch (error: unknown) {
      console.error("Gemini API error:", error);
      const err = error instanceof Error ? error : null;
      const errorMsg =
        err?.message?.includes("API key") ||
        err?.message?.includes("placeholder")
          ? "⚠️ Gemini API key is not configured. Please add your VITE_GEMINI_API_KEY to the .env file."
          : `⚠️ Sorry, I encountered an error. Please try again. (${err?.message || "Unknown error"})`;

      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text: errorMsg,
          time: now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass rounded-2xl shadow-card overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/60">
        <div className="h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shadow-glow shrink-0">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold leading-tight">Health Assistant AI</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Powered by Gemini
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Heart className="h-3.5 w-3.5 text-rose-400" /> Health Focused
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-emerald" /> 24/7 Available
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              m.from === "user" && "flex-row-reverse"
            )}
          >
            {m.from === "bot" ? (
              <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center shrink-0 shadow-glow">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            ) : (
              <div
                className={cn(
                  "h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 grid place-items-center shrink-0",
                )}
              >
                <User className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed border whitespace-pre-line",
                m.from === "bot"
                  ? "bg-secondary/40 border-border/60"
                  : "bg-secondary/60 border-border/60"
              )}
            >
              <div className="text-foreground/95">{m.text}</div>
              <div
                className={cn(
                  "text-[11px] text-muted-foreground mt-2",
                  m.from === "user" && "text-right"
                )}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center shrink-0 shadow-glow">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-secondary/40 border border-border/60 flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">
                Thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Quick actions */}
      <div className="px-5 pt-2 pb-1 flex flex-wrap gap-2">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => send(a.label + "?")}
            disabled={isTyping}
            className={cn(
              "px-4 py-1.5 rounded-full border text-xs font-medium transition-colors",
              a.color,
              isTyping && "opacity-50 cursor-not-allowed"
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-4 flex gap-2 items-center"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health question here..."
          disabled={isTyping}
          className="flex-1 h-12 px-5 rounded-full bg-secondary/40 border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className={cn(
            "h-12 w-12 rounded-full bg-gradient-brand grid place-items-center text-primary-foreground shadow-glow transition",
            isTyping || !input.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90"
          )}
        >
          {isTyping ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};
