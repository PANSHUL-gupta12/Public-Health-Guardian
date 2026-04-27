import { Stethoscope } from "lucide-react";
import { useAuth, PageId } from "@/context/AuthContext";
import { pages } from "@/config/pages";
import { cn } from "@/lib/utils";

interface Props {
  active: PageId;
  onSelect: (id: PageId) => void;
}

export const Sidebar = ({ active, onSelect }: Props) => {
  const { hasAccess } = useAuth();
  const visible = pages.filter((p) => hasAccess(p.id));

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col glass border-r border-border/60 relative z-10">
      <div className="p-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-brand grid place-items-center shadow-glow">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold leading-tight">Health Assistant</div>
            <div className="text-xs text-muted-foreground">Your AI Health Companion</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
        {visible.map((p) => {
          const Icon = p.icon;
          const isActive = active === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={cn(
                "w-full group flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300",
                isActive
                  ? "bg-gradient-brand text-primary-foreground shadow-glow"
                  : "hover:bg-secondary/70 text-foreground/80 hover:text-foreground",
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg grid place-items-center shrink-0 transition-colors",
                  isActive ? "bg-black/15" : "bg-secondary/80 group-hover:bg-secondary",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className={cn("text-sm font-medium leading-tight", isActive && "text-primary-foreground")}>
                  {p.label}
                </div>
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

      <div className="p-4 border-t border-border/60">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald animate-ping opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald" />
          </span>
          AI Assistant Online
        </div>
      </div>
    </aside>
  );
};
