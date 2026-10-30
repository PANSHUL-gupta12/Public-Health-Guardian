import { Stethoscope } from "lucide-react";
import { useAuth, PageId } from "@/context/AuthContext";
import { pages } from "@/config/pages";
import { cn } from "@/lib/utils";

interface Props {
  active: PageId;
  onSelect: (id: PageId) => void;
}

export const Sidebar = ({ active, onSelect }: Props) => {
  const visible = pages;

  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col p-4 gap-4 relative z-10">
      {/* Header card */}
      <div className="glass rounded-2xl p-4 flex items-center gap-3 shadow-card">
        <div className="h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shadow-glow shrink-0">
          <Stethoscope className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">Health Assistant</div>
          <div className="text-xs text-muted-foreground">Your AI Health Companion</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin space-y-1.5 pr-1">
        {visible.map((p) => {
          const Icon = p.icon;
          const isActive = active === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={cn(
                "w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200",
                isActive
                  ? "bg-gradient-brand text-primary-foreground shadow-glow"
                  : "hover:bg-secondary/60 text-foreground/85",
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg grid place-items-center shrink-0 transition-colors",
                  isActive ? "bg-black/20" : "bg-secondary/70 group-hover:bg-secondary",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className={cn("text-sm font-semibold leading-tight")}>{p.label}</div>
                <div
                  className={cn(
                    "text-[11px] leading-tight mt-0.5 truncate",
                    isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {p.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer card */}
      <div className="glass rounded-2xl p-4 shadow-card">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald animate-ping opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald" />
          </span>
          <span className="text-sm font-medium">AI Assistant Online</span>
        </div>
        <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
          Ready to help with your health questions
        </div>
      </div>
    </aside>
  );
};
