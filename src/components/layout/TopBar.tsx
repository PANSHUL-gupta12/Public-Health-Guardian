import { Search, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { Role, roleMeta, useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const roles: Role[] = ["patient", "doctor", "admin", "guest"];

export const TopBar = () => {
  const { role, setRole, user } = useAuth();
  const meta = roleMeta[role];
  const [q, setQ] = useState("");
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <header className="h-16 shrink-0 glass border-b border-border/60 flex items-center gap-4 px-4 md:px-6 relative z-20">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center shadow-glow shrink-0">
          <span className="text-sm font-bold text-primary-foreground tracking-tight">PH</span>
        </div>
        <div className="min-w-0 hidden sm:block">
          <div className="text-sm font-semibold leading-tight truncate">
            <span className="text-gradient-brand">Public Health</span> Guardian
          </div>
          <div className="text-[11px] text-muted-foreground leading-tight">Trusted health intelligence</div>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for health information..."
            className="pl-9 bg-secondary/40 border-border/60 focus-visible:ring-primary/40 h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "group flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full glass border border-border/60 hover:border-primary/40 transition-colors",
              )}
            >
              <span
                className={cn(
                  "h-6 w-6 rounded-full bg-gradient-to-br grid place-items-center text-[10px] font-bold text-white",
                  meta.from,
                  meta.to,
                )}
              >
                {meta.label[0]}
              </span>
              <span className="text-sm font-medium hidden sm:inline">{meta.label}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 glass border-border/60">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Switch role
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((r) => {
              const m = roleMeta[r];
              const active = r === role;
              return (
                <DropdownMenuItem
                  key={r}
                  onClick={() => setRole(r)}
                  className="flex items-start gap-3 cursor-pointer py-2.5"
                >
                  <span
                    className={cn(
                      "h-7 w-7 rounded-full bg-gradient-to-br grid place-items-center text-[11px] font-bold text-white shrink-0",
                      m.from,
                      m.to,
                    )}
                  >
                    {m.label[0]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{m.description}</div>
                  </div>
                  {active && <Check className="h-4 w-4 text-primary mt-1.5" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className={cn("p-[2px] rounded-full bg-gradient-to-br", meta.from, meta.to)}>
          <div className="h-9 w-9 rounded-full bg-background grid place-items-center text-sm font-semibold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};
