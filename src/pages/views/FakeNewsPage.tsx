import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Search,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getFactCheckModel } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type Verdict = "true" | "false" | "uncertain";

interface FactResult {
  verdict: Verdict;
  label: string;
  explanation: string;
  sources: string[];
}

const verdictMeta = {
  true: {
    label: "Likely accurate",
    color: "from-emerald-500 to-teal-400",
    icon: ShieldCheck,
    pill: "text-emerald-glow border-emerald/40 bg-emerald/10",
  },
  false: {
    label: "Likely false",
    color: "from-rose-500 to-orange-500",
    icon: ShieldAlert,
    pill: "text-rose-300 border-rose-400/40 bg-rose-500/10",
  },
  uncertain: {
    label: "Needs context",
    color: "from-amber-500 to-yellow-400",
    icon: ShieldQuestion,
    pill: "text-amber-300 border-amber-400/40 bg-amber-500/10",
  },
} as const;

interface RecentCheck {
  claim: string;
  verdict: Verdict;
}

export const FakeNewsPage = () => {
  const { profile } = useAuth();
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<FactResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<RecentCheck[]>([
    { claim: "Drinking lemon water cures cancer", verdict: "false" },
    { claim: "Vaccines undergo multiple safety trials", verdict: "true" },
    {
      claim: "Cracking knuckles causes arthritis",
      verdict: "uncertain",
    },
  ]);

  const analyze = async () => {
    if (!claim.trim() || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const model = getFactCheckModel();
      const response = await model.generateContent(
        `Analyze this health claim for accuracy: "${claim.trim()}"`
      );
      const text = response.response.text();

      // Parse JSON response from Gemini
      let parsed: FactResult;
      try {
        // Clean potential markdown fences
        const cleaned = text
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
        parsed = JSON.parse(cleaned);
      } catch {
        // Fallback if JSON parsing fails
        parsed = {
          verdict: "uncertain",
          label: "Needs more context",
          explanation: text,
          sources: [],
        };
      }

      setResult(parsed);

      // Add to recent checks
      setRecent((prev) => [
        { claim: claim.trim(), verdict: parsed.verdict },
        ...prev.slice(0, 4),
      ]);

      // Save to Supabase if logged in
      if (profile) {
        supabase
          .from("fact_checks")
          .insert({
            user_id: profile.id,
            claim: claim.trim(),
            verdict: parsed.verdict,
            explanation: parsed.explanation,
            sources: parsed.sources,
          })
          .then(() => {});
      }
    } catch (err: unknown) {
      console.error("Fact check error:", err);
      const errorObj = err instanceof Error ? err : null;
      if (
        errorObj?.message?.includes("API key") ||
        errorObj?.message?.includes("placeholder")
      ) {
        setError(
          "Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file."
        );
      } else {
        setError(errorObj?.message || "Failed to analyze claim. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const meta = result ? verdictMeta[result.verdict] : null;
  const Icon = meta?.icon;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        icon={<ShieldAlert className="h-5 w-5 text-primary-foreground" />}
        eyebrow="Misinformation"
        title="Fake News Detector"
        description="Paste a health claim or headline. Our AI analyzer compares it against verified medical sources using Gemini."
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
            <div className="text-xs text-muted-foreground">
              {claim.length} / 1000
            </div>
            <button
              onClick={analyze}
              disabled={loading || !claim.trim()}
              className={cn(
                "h-10 px-5 rounded-full bg-gradient-brand text-primary-foreground text-sm font-medium shadow-glow transition flex items-center gap-2",
                loading || !claim.trim()
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:opacity-90"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" /> Verify claim
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300 animate-fade-in">
              {error}
            </div>
          )}

          {meta && Icon && result && (
            <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-11 w-11 rounded-xl bg-gradient-to-br grid place-items-center",
                    meta.color
                  )}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Verdict</div>
                  <div className="font-semibold">{meta.label}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {result.explanation}
              </p>
              {result.sources && result.sources.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    Sources:
                  </div>
                  {result.sources.map((s, i) => (
                    <div key={i} className="text-xs text-primary/80">
                      • {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5 shadow-card">
          <div className="text-sm font-semibold mb-3">Recent checks</div>
          <ul className="space-y-2">
            {recent.map((r, idx) => {
              const m = verdictMeta[r.verdict];
              const I = m.icon;
              return (
                <li
                  key={`${r.claim}-${idx}`}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40"
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg bg-gradient-to-br grid place-items-center shrink-0",
                      m.color
                    )}
                  >
                    <I className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-xs flex-1 min-w-0">
                    <div className="text-foreground/90 leading-snug truncate">
                      {r.claim}
                    </div>
                    <span
                      className={cn(
                        "inline-block mt-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium",
                        m.pill
                      )}
                    >
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
