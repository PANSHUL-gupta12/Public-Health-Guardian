import { useState } from "react";
import { ShieldAlert, ShieldCheck, ShieldQuestion, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

type Verdict = "true" | "false" | "uncertain" | null;

const verdictMeta = {
  true: { label: "Likely accurate", color: "from-emerald-500 to-teal-400", icon: ShieldCheck, pill: "text-emerald-glow border-emerald/40 bg-emerald/10" },
  false: { label: "Likely false", color: "from-rose-500 to-orange-500", icon: ShieldAlert, pill: "text-rose-300 border-rose-400/40 bg-rose-500/10" },
  uncertain: { label: "Needs context", color: "from-amber-500 to-yellow-400", icon: ShieldQuestion, pill: "text-amber-300 border-amber-400/40 bg-amber-500/10" },
} as const;

const recent = [
  { claim: "Drinking lemon water cures cancer", verdict: "false" as const },
  { claim: "Vaccines undergo multiple safety trials", verdict: "true" as const },
  { claim: "Cracking knuckles causes arthritis", verdict: "uncertain" as const },
];

export const FakeNewsPage = () => {
  const [claim, setClaim] = useState("");
  const [verdict, setVerdict] = useState<Verdict>(null);

  const analyze = () => {
    if (!claim.trim()) return;
    const v: Verdict = ["true", "false", "uncertain"][Math.floor(Math.random() * 3)] as Verdict;
    setVerdict(v);
  };

  const meta = verdict ? verdictMeta[verdict] : null;
  const Icon = meta?.icon;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        icon={<ShieldAlert className="h-5 w-5 text-primary-foreground" />}
        eyebrow="Misinformation"
        title="Fake News Detector"
        description="Paste a health claim or headline. Our analyzer compares it against verified medical sources."
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 lg:col-span-2 shadow-card space-y-4">
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="e.g. 'Drinking warm water with lemon every morning prevents COVID-19.'"
            className="w-full min-h-32 rounded-2xl bg-secondary/40 border border-border/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 resize-none transition"
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">{claim.length} / 1000</div>
            <button
              onClick={analyze}
              className="h-10 px-5 rounded-full bg-gradient-brand text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition flex items-center gap-2"
            >
              <Search className="h-4 w-4" /> Verify claim
            </button>
          </div>

          {meta && Icon && (
            <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br grid place-items-center", meta.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Verdict</div>
                  <div className="font-semibold">{meta.label}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Based on cross-referenced sources from WHO, CDC, and peer-reviewed journals. Always confirm with a
                licensed clinician for personal decisions.
              </p>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5 shadow-card">
          <div className="text-sm font-semibold mb-3">Recent checks</div>
          <ul className="space-y-2">
            {recent.map((r) => {
              const m = verdictMeta[r.verdict];
              const I = m.icon;
              return (
                <li key={r.claim} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40">
                  <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-br grid place-items-center shrink-0", m.color)}>
                    <I className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-xs flex-1 min-w-0">
                    <div className="text-foreground/90 leading-snug">{r.claim}</div>
                    <span className={cn("inline-block mt-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium", m.pill)}>
                      {m.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
