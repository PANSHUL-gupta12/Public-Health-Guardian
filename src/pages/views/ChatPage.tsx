import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, Activity, Pill, Heart, Siren, Info } from "lucide-react";
import { useAuth, roleMeta } from "@/context/AuthContext";
import { pages } from "@/config/pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Msg { id: number; from: "bot" | "user"; text: string; }

const initialMessages: Msg[] = [
  { id: 1, from: "bot", text: "Hi! I'm your Health Assistant. Ask me about symptoms, medications, or healthy habits — I'll point you in the right direction. ⚕️" },
];

const quickActions = [
  { label: "Common Symptoms", icon: Activity, prompt: "What are common symptoms of seasonal flu?" },
  { label: "Medication Info", icon: Pill, prompt: "Tell me about ibuprofen dosage for adults." },
  { label: "Healthy Habits", icon: Heart, prompt: "Suggest 5 daily healthy habits." },
  { label: "Emergency Info", icon: Siren, prompt: "What should I do during a suspected stroke?" },
];

export const ChatPage = () => {
  const { role, hasAccess } = useAuth();
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
    const userMsg: Msg = { id: Date.now(), from: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text: `Here's general guidance on "${trimmed}". For personal medical advice, always consult a licensed clinician. Would you like me to expand on any point?`,
        },
      ]);
    }, 600);
  };

  const accessible = pages.filter((p) => hasAccess(p.id)).map((p) => p.label);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Chat header */}
      <div className="glass rounded-2xl p-4 flex items-center gap-4 shadow-card">
        <div className="relative">
          <div className="h-12 w-12 rounded-2xl bg-gradient-brand grid place-items-center shadow-glow">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald ring-2 ring-background" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold flex items-center gap-2">
            Health Assistant AI <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="text-xs text-muted-foreground">Online • Responses are educational, not diagnostic</div>
        </div>
        <div className="hidden md:flex gap-2">
          <Badge variant="secondary" className="bg-secondary/70">Health Focused</Badge>
          <Badge variant="secondary" className="bg-secondary/70">24/7 Available</Badge>
        </div>
      </div>

      {/* Role notice */}
      <div className="glass rounded-2xl p-4 flex gap-3 items-start shadow-card">
        <div className={cn("h-9 w-9 rounded-xl bg-gradient-to-br grid place-items-center shrink-0", meta.from, meta.to)}>
          <Info className="h-4 w-4 text-white" />
        </div>
        <div className="text-sm">
          <div className="font-medium">
            Signed in as <span className="capitalize">{meta.label}</span>
          </div>
          <div className="text-muted-foreground mt-0.5">
            You can access: <span className="text-foreground/90">{accessible.join(" · ")}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Tip: switch your role from the top-right menu to explore other features.
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 glass rounded-2xl shadow-card flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3 animate-fade-in", m.from === "user" && "flex-row-reverse")}>
              <div
                className={cn(
                  "h-9 w-9 rounded-xl grid place-items-center shrink-0",
                  m.from === "bot" ? "bg-gradient-brand text-primary-foreground" : cn("bg-gradient-to-br text-white", meta.from, meta.to),
                )}
              >
                {m.from === "bot" ? <Bot className="h-4 w-4" /> : meta.label[0]}
              </div>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.from === "bot"
                    ? "bg-secondary/70 border border-border/60"
                    : "bg-brand-soft border border-primary/30",
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Quick actions */}
        <div className="px-5 pt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => send(a.prompt)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/60 text-xs text-left transition-colors"
            >
              <a.icon className="h-3.5 w-3.5 text-primary" />
              <span className="truncate">{a.label}</span>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="p-4 flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about symptoms, medications, healthy habits…"
            className="bg-secondary/40 border-border/60 h-11 rounded-xl"
          />
          <Button type="submit" className="h-11 px-4 bg-gradient-brand text-primary-foreground hover:opacity-90 shadow-glow">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
