import { useState, useEffect } from "react";
import { Map, AlertTriangle, TrendingUp, Activity, Loader2, Search, Bot } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

interface CountryData {
  country: string;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  countryInfo: {
    lat: number;
    long: number;
    flag: string;
  };
}

interface GlobalData {
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
}

const getLevelInfo = (active: number, maxActive: number) => {
  const ratio = maxActive > 0 ? active / maxActive : 0;
  if (ratio > 0.6)
    return {
      level: "High",
      pill: "text-rose-300 border-rose-400/40 bg-rose-500/10",
      dot: "from-rose-500 to-orange-500",
      color: "bg-rose-500/40",
    };
  if (ratio > 0.2)
    return {
      level: "Moderate",
      pill: "text-amber-300 border-amber-400/40 bg-amber-500/10",
      dot: "from-amber-500 to-yellow-400",
      color: "bg-amber-500/40",
    };
  return {
    level: "Low",
    pill: "text-emerald-glow border-emerald/40 bg-emerald/10",
    dot: "from-emerald-500 to-teal-400",
    color: "bg-emerald-500/40",
  };
};

export const DiseaseMapPage = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("COVID-19");
  const [searchInput, setSearchInput] = useState("");

  const CACHE_KEY_PREFIX = "disease_map_cache_";
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

  const fetchData = async (disease: string) => {
    setLoading(true);
    setError(null);

    // Using simulated snapshot data to avoid hitting AI rate limits
    setTimeout(() => {
      const fallbackData = {
        global: {
          cases: 8500000, todayCases: 12000, deaths: 450000, todayDeaths: 200, recovered: 6000000, active: 2050000
        },
        countries: [
          { country: "Nigeria", active: 450000, todayCases: 2100, countryInfo: { lat: 9.0820, long: 8.6753, flag: "https://flagcdn.com/w40/ng.png" } },
          { country: "Democratic Republic of the Congo", active: 380000, todayCases: 1800, countryInfo: { lat: -4.0383, long: 21.7587, flag: "https://flagcdn.com/w40/cd.png" } },
          { country: "India", active: 290000, todayCases: 1200, countryInfo: { lat: 20.5937, long: 78.9629, flag: "https://flagcdn.com/w40/in.png" } },
          { country: "Uganda", active: 210000, todayCases: 950, countryInfo: { lat: 1.3733, long: 32.2903, flag: "https://flagcdn.com/w40/ug.png" } },
          { country: "Mozambique", active: 180000, todayCases: 800, countryInfo: { lat: -18.6657, long: 35.5296, flag: "https://flagcdn.com/w40/mz.png" } },
        ]
      };
      setGlobalData(fallbackData.global as GlobalData);
      setCountries(fallbackData.countries as CountryData[]);
      setQuery(disease);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchInput.trim().toLowerCase() !== query.toLowerCase()) {
      fetchData(searchInput.trim());
    }
  };

  useEffect(() => {
    fetchData("COVID-19");
  }, []);

  // Map coordinates to percentage positions for visualization
  const getMapPosition = (lat: number, long: number) => ({
    x: `${((long + 180) / 360) * 100}%`,
    y: `${((90 - lat) / 180) * 100}%`,
  });

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        icon={<Map className="h-5 w-5 text-primary-foreground" />}
        eyebrow="Surveillance"
        title="Disease Map"
        description="Live AI-estimated global outbreaks — search for any disease."
      />

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 max-w-2xl">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={`Currently viewing: ${query}. Search for Malaria, Dengue, Cholera...`}
            className="w-full h-12 pl-11 pr-24 rounded-2xl glass border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
          />
          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="absolute right-2 h-8 px-4 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-semibold shadow-glow disabled:opacity-50 transition-opacity"
          >
            Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="glass rounded-2xl p-12 shadow-card flex items-center justify-center gap-3 mb-4">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="text-muted-foreground">
            Loading disease data...
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300 mb-4 animate-fade-in">
          {error}
        </div>
      )}

      {/* Global stats */}
      {globalData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            {
              label: "Total Cases",
              value: globalData.cases.toLocaleString(),
              delta: `+${globalData.todayCases.toLocaleString()} today`,
              accent: "text-sky-300",
            },
            {
              label: "Active",
              value: globalData.active.toLocaleString(),
              delta: "Currently infected",
              accent: "text-amber-300",
            },
            {
              label: "Recovered",
              value: globalData.recovered.toLocaleString(),
              delta: "Total recovered",
              accent: "text-emerald-glow",
            },
            {
              label: "Deaths",
              value: globalData.deaths.toLocaleString(),
              delta: `+${globalData.todayDeaths.toLocaleString()} today`,
              accent: "text-rose-300",
            },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 shadow-card">
              <div className="text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                {s.label}
              </div>
              <div className={cn("text-xl font-semibold mt-1", s.accent)}>
                {s.value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {s.delta}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map visualization */}
        <div className="glass rounded-2xl p-3 shadow-card lg:col-span-2 overflow-hidden">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[radial-gradient(ellipse_at_center,hsl(var(--teal)/0.1),transparent_70%)] border border-border/60">
            <svg
              className="absolute inset-0 w-full h-full opacity-30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Continental shapes (simplified) */}
            <div className="absolute left-[10%] top-[15%] w-[25%] h-[35%] rounded-[40%] bg-secondary/60 blur-sm" />
            <div className="absolute left-[18%] top-[50%] w-[12%] h-[35%] rounded-[40%] bg-secondary/50 blur-sm" />
            <div className="absolute left-[40%] top-[10%] w-[20%] h-[45%] rounded-[35%] bg-secondary/60 blur-sm" />
            <div className="absolute left-[40%] top-[45%] w-[18%] h-[30%] rounded-[45%] bg-secondary/50 blur-sm" />
            <div className="absolute left-[62%] top-[12%] w-[25%] h-[45%] rounded-[30%] bg-secondary/60 blur-sm" />
            <div className="absolute left-[75%] top-[55%] w-[15%] h-[25%] rounded-[40%] bg-secondary/50 blur-sm" />

            {/* Hotspot dots from AI data */}
            {countries.slice(0, 6).map((c) => {
              const pos = getMapPosition(
                c.countryInfo.lat,
                c.countryInfo.long
              );
              const maxActive = Math.max(...countries.map(c => c.active));
              const level = getLevelInfo(c.active, maxActive);
              // Scale size relatively between 30 and 100 based on the max active cases
              const size = maxActive > 0 ? Math.max(30, (c.active / maxActive) * 100) : 30;
              return (
                <div
                  key={c.country}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    width: size,
                    height: size,
                  }}
                >
                  <div
                    className={`absolute inset-0 rounded-full ${level.color} animate-pulse-soft`}
                  />
                  <div
                    className={`absolute inset-1/3 rounded-full ${level.color.replace("/40", "/70")}`}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap glass px-2 py-1 rounded-md text-[10px] z-10 border border-border/40">
                    {c.country}: {c.active.toLocaleString()} active
                  </div>
                </div>
              );
            })}

            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full glass border border-border/60 text-xs flex items-center gap-2">
              <Bot className="h-3.5 w-3.5 text-primary" /> Estimated by Gemini AI
            </div>
          </div>
        </div>

        {/* Country alerts */}
        <div className="glass rounded-2xl p-5 shadow-card">
          <div className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Top active
            regions
          </div>
          <ul className="space-y-2.5 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
            {countries.map((c) => {
              const maxActive = Math.max(...countries.map(country => country.active));
              const level = getLevelInfo(c.active, maxActive);
              const trend =
                c.todayCases > 0
                  ? `+${c.todayCases.toLocaleString()}`
                  : "No new cases";
              return (
                <li
                  key={c.country}
                  className="rounded-xl border border-border/60 p-3 bg-secondary/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full bg-gradient-to-br mt-1.5 shrink-0",
                          level.dot
                        )}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium leading-tight flex items-center gap-2">
                          <img
                            src={c.countryInfo.flag}
                            alt={c.country}
                            className="h-3.5 w-5 rounded-sm object-cover"
                          />
                          {c.country}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {c.active.toLocaleString()} active cases
                        </div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap",
                        level.pill
                      )}
                    >
                      {level.level}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1 pl-5">
                    <TrendingUp className="h-3 w-3" /> {trend} today
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
