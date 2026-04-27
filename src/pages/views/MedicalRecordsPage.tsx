import { FileHeart, Search, Calendar, Pill, Activity } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

const records = [
  { name: "Jordan Rivera", age: 34, id: "PT-2841", condition: "Asthma — controlled", lastVisit: "2025-04-12", status: "Stable", meds: 2 },
  { name: "Mei Tanaka", age: 58, id: "PT-3017", condition: "Type 2 Diabetes", lastVisit: "2025-04-08", status: "Monitoring", meds: 3 },
  { name: "Samuel Okafor", age: 42, id: "PT-2298", condition: "Hypertension", lastVisit: "2025-03-29", status: "Stable", meds: 1 },
  { name: "Priya Desai", age: 27, id: "PT-3411", condition: "Migraine", lastVisit: "2025-04-19", status: "Follow-up", meds: 2 },
];

const statusPill: Record<string, string> = {
  Stable: "text-emerald-glow border-emerald/40 bg-emerald/10",
  Monitoring: "text-amber-300 border-amber-400/40 bg-amber-500/10",
  "Follow-up": "text-sky-300 border-sky-400/40 bg-sky-500/10",
};

export const MedicalRecordsPage = () => (
  <div className="max-w-6xl mx-auto">
    <PageHeader
      icon={<FileHeart className="h-5 w-5 text-primary-foreground" />}
      eyebrow="Clinical"
      title="Medical Records"
      description="Patient files visible to authorized clinicians and admins."
    />

    <div className="glass rounded-2xl p-3 shadow-card mb-4">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search patients..."
          className="w-full h-11 pl-11 pr-4 rounded-full bg-secondary/40 border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
        />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      {records.map((r) => (
        <div key={r.name} className="glass rounded-2xl p-5 shadow-card hover:border-primary/40 transition-colors border border-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 grid place-items-center text-white font-semibold">
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="font-semibold leading-tight">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Age {r.age} · ID #{r.id}</div>
              </div>
            </div>
            <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full border", statusPill[r.status])}>
              {r.status}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-secondary/40 border border-border/40 p-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Activity className="h-3 w-3" /> Condition
              </div>
              <div className="mt-1 font-medium truncate">{r.condition}</div>
            </div>
            <div className="rounded-xl bg-secondary/40 border border-border/40 p-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" /> Last visit
              </div>
              <div className="mt-1 font-medium">{r.lastVisit}</div>
            </div>
            <div className="rounded-xl bg-secondary/40 border border-border/40 p-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Pill className="h-3 w-3" /> Meds
              </div>
              <div className="mt-1 font-medium">{r.meds} active</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
