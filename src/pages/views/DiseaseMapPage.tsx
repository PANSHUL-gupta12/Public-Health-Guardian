import { Map, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const alerts = [
  { region: "Northern District", disease: "Influenza A", level: "High", trend: "+18%", color: "from-rose-500 to-orange-500" },
  { region: "Coastal Area", disease: "Dengue", level: "Moderate", trend: "+6%", color: "from-amber-500 to-yellow-400" },
  { region: "Central Metro", disease: "Common Cold", level: "Low", trend: "-3%", color: "from-emerald-500 to-teal-400" },
  { region: "Western Hills", disease: "Allergic Rhinitis", level: "Moderate", trend: "+9%", color: "from-amber-500 to-yellow-400" },
];

const hotspots = [
  { x: "22%", y: "30%", size: 120, color: "bg-rose-500/40" },
  { x: "60%", y: "55%", size: 90, color: "bg-amber-500/40" },
  { x: "75%", y: "25%", size: 70, color: "bg-emerald-500/40" },
  { x: "40%", y: "70%", size: 100, color: "bg-rose-500/30" },
];

export const DiseaseMapPage = () => (
  <div className="space-y-6">
    <PageHeader
      icon={<Map className="h-5 w-5 text-primary-foreground" />}
      eyebrow="Surveillance"
      title="Disease Map"
      description="Live view of outbreaks and health alerts across your region."
    />

    <div className="grid lg:grid-cols-3 gap-5">
      <div className="glass rounded-2xl p-2 shadow-card lg:col-span-2 overflow-hidden">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[radial-gradient(ellipse_at_center,hsl(var(--teal)/0.1),transparent_70%)] border border-border/60">
          {/* faux grid */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* faux land masses */}
          <div className="absolute left-[10%] top-[15%] w-[55%] h-[55%] rounded-[40%] bg-secondary/60 blur-sm" />
          <div className="absolute right-[8%] top-[20%] w-[30%] h-[40%] rounded-[50%] bg-secondary/60 blur-sm" />
          <div className="absolute left-[30%] bottom-[10%] w-[40%] h-[30%] rounded-[40%] bg-secondary/50 blur-sm" />
          {/* hotspots */}
          {hotspots.map((h, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: h.x, top: h.y, width: h.size, height: h.size }}
            >
              <div className={`absolute inset-0 rounded-full ${h.color} animate-pulse-soft`} />
              <div className={`absolute inset-1/3 rounded-full ${h.color.replace("/40", "/70").replace("/30", "/70")}`} />
            </div>
          ))}
          <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-primary" /> Updated 5 min ago
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 shadow-card">
        <div className="text-sm font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" /> Local alerts
        </div>
        <ul className="space-y-3">
          {alerts.map((a) => (
            <li key={a.region} className="rounded-xl border border-border/60 p-3 bg-secondary/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{a.disease}</div>
                  <div className="text-xs text-muted-foreground">{a.region}</div>
                </div>
                <div className={`text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r text-white ${a.color}`}>
                  {a.level}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {a.trend} this week
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
