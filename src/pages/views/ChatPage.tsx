import { useState, useRef, useEffect } from "react";
import { Bot, Send, Heart, Activity, User } from "lucide-react";
import { useAuth, roleMeta } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface Msg { id: number; from: "bot" | "user"; text: string; time: string; }

const now = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const initialMessages: Msg[] = [
  {
    id: 1,
    from: "bot",
    text: "Hello! I'm your Public Health Guardian AI assistant. How can I help you with your health questions today?",
    time: "2:30 PM",
  },
  {
    id: 2,
    from: "user",
    text: "I've been feeling tired lately. What could be causing this?",
    time: "2:31 PM",
  },
  {
    id: 3,
    from: "bot",
    text:
      "Fatigue can have many causes. Let me help you understand some common reasons:\n\n• Lack of sleep (7–9 hours recommended)\n• Dehydration\n• Poor nutrition\n• Stress or anxiety\n• Lack of physical activity\n\nI'd recommend starting with improving your sleep schedule and staying hydrated. If fatigue persists for more than 2 weeks, consider consulting a healthcare provider.",
    time: "2:32 PM",
  },
];

const quickActions = [
  { label: "Common Symptoms", color: "text-teal border-teal/40 hover:bg-teal/10" },
  { label: "Medication Info", color: "text-sky-300 border-sky-400/40 hover:bg-sky-400/10" },
  { label: "Healthy Habits", color: "text-emerald-glow border-emerald/40 hover:bg-emerald/10" },
  { label: "Emergency Info", color: "text-fuchsia-300 border-fuchsia-400/40 hover:bg-fuchsia-400/10" },
];

export const ChatPage = () => {
  const { role } = useAuth();
  const meta = roleMeta[role];
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Msg = { id: Date.now(), from: "user", text: trimmed, time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text: `Here's general guidance on "${trimmed}". For personal medical advice, always consult a licensed clinician. Want me to expand on any point?`,
          time: now(),
        },
      ]);
    }, 600);
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
            Online & Ready
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
          <div key={m.id} className={cn("flex gap-3 animate-fade-in", m.from === "user" && "flex-row-reverse")}>
            {m.from === "bot" ? (
              <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center shrink-0 shadow-glow">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            ) : (
              <div className={cn("h-9 w-9 rounded-full bg-gradient-to-br grid place-items-center shrink-0", meta.from, meta.to)}>
                <User className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed border whitespace-pre-line",
                m.from === "bot"
                  ? "bg-secondary/40 border-border/60"
                  : "bg-secondary/60 border-border/60",
              )}
            >
              <div className="text-foreground/95">{m.text}</div>
              <div className={cn("text-[11px] text-muted-foreground mt-2", m.from === "user" && "text-right")}>
                {m.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick actions */}
      <div className="px-5 pt-2 pb-1 flex flex-wrap gap-2">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => send(a.label + "?")}
            className={cn(
              "px-4 py-1.5 rounded-full border text-xs font-medium transition-colors",
              a.color,
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
          className="flex-1 h-12 px-5 rounded-full bg-secondary/40 border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
        />
        <button
          type="submit"
          className="h-12 w-12 rounded-full bg-gradient-brand grid place-items-center text-primary-foreground shadow-glow hover:opacity-90 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
