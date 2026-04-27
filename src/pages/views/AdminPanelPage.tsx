import { Settings2, Users, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const stats = [
  { label: "Active users", value: "12,480", delta: "+4.2%", icon: Users },
  { label: "Daily queries", value: "38,210", delta: "+11.7%", icon: Activity },
  { label: "Open alerts", value: "7", delta: "-2", icon: AlertTriangle },
  { label: "System health", value: "99.98%", delta: "stable", icon: ShieldCheck },
];

const audit = [
  { time: "10:42", actor: "Dr. Lin Hayes", action: "Viewed record PT-2841" },
  { time: "10:31", actor: "System", action: "Pushed model update v2.4.1" },
  { time: "10:18", actor: "Avery Stone", action: "Granted moderator role to N. Patel" },
  { time: "09:55", actor: "Alert engine", action: "Flagged misinformation cluster #312" },
];

export const AdminPanelPage = () => (
  <div className="space-y-6">
    <PageHeader
      icon={<Settings2 className="h-5 w-5 text-primary-foreground" />}
      eyebrow="Operations"
      title="Admin Panel"
      description="Real-time system health, user activity, and audit trail."
    />

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="glass rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-semibold mt-1.5">{s.value}</div>
            <div className="text-xs text-emerald mt-0.5">{s.delta}</div>
          </div>
        );
      })}
    </div>

    <div className="grid lg:grid-cols-3 gap-5">
      <div className="glass rounded-2xl p-5 shadow-card lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Query volume</div>
          <div className="text-xs text-muted-foreground">Last 7 days</div>
        </div>
        <div className="h-48 flex items-end gap-2">
          {[42, 58, 36, 72, 68, 88, 76].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-lg bg-gradient-brand opacity-90" style={{ height: `${v}%` }} />
              <div className="text-[10px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 shadow-card">
        <div className="font-semibold mb-3">Audit log</div>
        <ul className="space-y-3">
          {audit.map((a, i) => (
            <li key={i} className="text-xs flex gap-3">
              <span className="text-muted-foreground w-10 shrink-0">{a.time}</span>
              <div>
                <div className="font-medium text-foreground/90">{a.actor}</div>
                <div className="text-muted-foreground">{a.action}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
