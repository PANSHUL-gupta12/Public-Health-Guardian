import { Settings2, Users, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Active users", value: "12,480", delta: "+4.2%", icon: Users, accent: "text-teal border-teal/40" },
  { label: "Daily queries", value: "38,210", delta: "+11.7%", icon: Activity, accent: "text-sky-300 border-sky-400/40" },
  { label: "Open alerts", value: "7", delta: "-2", icon: AlertTriangle, accent: "text-amber-300 border-amber-400/40" },
  { label: "System health", value: "99.98%", delta: "stable", icon: ShieldCheck, accent: "text-emerald-glow border-emerald/40" },
];

const audit = [
  { time: "10:42", actor: "Dr. Lin Hayes", action: "Viewed record PT-2841" },
  { time: "10:31", actor: "System", action: "Pushed model update v2.4.1" },
  { time: "10:18", actor: "Avery Stone", action: "Granted moderator role to N. Patel" },
  { time: "09:55", actor: "Alert engine", action: "Flagged misinformation cluster #312" },
];

const days = ["M", "T", "W", "T", "F", "S", "S"];
const volume = [42, 58, 36, 72, 68, 88, 76];

export const AdminPanelPage = () => (
  <div className="max-w-6xl mx-auto">
    <PageHeader
      icon={<Settings2 className="h-5 w-5 text-primary-foreground" />}
      eyebrow="Operations"
      title="Admin Panel"
      description="Real-time system health, user activity, and audit trail."
    />

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="glass rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">{s.label}</div>
              <div className={cn("h-7 w-7 rounded-lg border bg-secondary/40 grid place-items-center", s.accent)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl font-semibold mt-2">{s.value}</div>
            <span className="text-[10px] mt-1.5 inline-block px-2 py-0.5 rounded-full border border-emerald/40 text-emerald-glow bg-emerald/10 font-medium">
              {s.delta}
            </span>
          </div>
        );
      })}
    </div>

    <div className="grid lg:grid-cols-3 gap-4">
      <div className="glass rounded-2xl p-5 shadow-card lg:col-span-2">
        <div className="flex items-center justify-between mb-5">
          <div className="font-semibold">Query volume</div>
          <span className="text-xs px-3 py-1 rounded-full bg-secondary/60 border border-border/60 text-muted-foreground">
            Last 7 days
          </span>
        </div>
        <div className="h-48 flex items-end gap-3">
          {volume.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-gradient-brand opacity-90 hover:opacity-100 transition-opacity"
                style={{ height: `${v}%` }}
              />
              <div className="text-[10px] text-muted-foreground">{days[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 shadow-card">
        <div className="font-semibold mb-3">Audit log</div>
        <ul className="space-y-3">
          {audit.map((a, i) => (
            <li key={i} className="text-xs flex gap-3 p-2.5 rounded-xl bg-secondary/30 border border-border/40">
              <span className="text-muted-foreground w-10 shrink-0 font-mono">{a.time}</span>
              <div className="min-w-0">
                <div className="font-medium text-foreground/90 truncate">{a.actor}</div>
                <div className="text-muted-foreground truncate">{a.action}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
