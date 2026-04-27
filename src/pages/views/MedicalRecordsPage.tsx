import { FileHeart, Search, Calendar, Pill, Activity } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const records = [
  { name: "Jordan Rivera", age: 34, condition: "Asthma — controlled", lastVisit: "2025-04-12", status: "Stable" },
  { name: "Mei Tanaka", age: 58, condition: "Type 2 Diabetes", lastVisit: "2025-04-08", status: "Monitoring" },
  { name: "Samuel Okafor", age: 42, condition: "Hypertension", lastVisit: "2025-03-29", status: "Stable" },
  { name: "Priya Desai", age: 27, condition: "Migraine", lastVisit: "2025-04-19", status: "Follow-up" },
];

const statusColor: Record<string, string> = {
  Stable: "bg-emerald/20 text-emerald-glow border-emerald/30",
  Monitoring: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Follow-up": "bg-sky-500/20 text-sky-300 border-sky-500/30",
};

export const MedicalRecordsPage = () => (
  <div className="space-y-6">
    <PageHeader
      icon={<FileHeart className="h-5 w-5 text-primary-foreground" />}
      eyebrow="Clinical"
      title="Medical Records"
      description="Patient files visible to authorized clinicians and admins."
    />

    <div className="glass rounded-2xl p-4 shadow-card">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search patients..." className="pl-9 bg-secondary/40 border-border/60 h-10 rounded-xl" />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      {records.map((r) => (
        <div key={r.name} className="glass rounded-2xl p-5 shadow-card hover:border-primary/40 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 grid place-items-center text-white font-semibold">
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">Age {r.age} · ID #PT-{(Math.random() * 9000 + 1000).toFixed(0)}</div>
              </div>
            </div>
            <Badge className={`border ${statusColor[r.status]} bg-transparent`}>{r.status}</Badge>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-secondary/40 p-2.5">
              <div className="flex items-center gap-1 text-muted-foreground"><Activity className="h-3 w-3" /> Condition</div>
              <div className="mt-1 font-medium truncate">{r.condition}</div>
            </div>
            <div className="rounded-lg bg-secondary/40 p-2.5">
              <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /> Last visit</div>
              <div className="mt-1 font-medium">{r.lastVisit}</div>
            </div>
            <div className="rounded-lg bg-secondary/40 p-2.5">
              <div className="flex items-center gap-1 text-muted-foreground"><Pill className="h-3 w-3" /> Meds</div>
              <div className="mt-1 font-medium">{Math.ceil(Math.random() * 3)} active</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
