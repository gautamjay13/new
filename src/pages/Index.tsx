import { useEffect, useRef, useState, type MouseEventHandler, type ReactNode } from "react";
import { ArrowRight, LineChart3, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import CsvUpload from "@/components/dashboard/CsvUpload";
import DownloadButton from "@/components/dashboard/DownloadButton";
import FraudRingsTable from "@/components/dashboard/FraudRingsTable";
import NetworkGraph from "@/components/dashboard/NetworkGraph";
import ProcessingStatus from "@/components/dashboard/ProcessingStatus";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SuspiciousTable from "@/components/dashboard/SuspiciousTable";
import Footer from "@/components/dashboard/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";
import { analyzeCSV, type AnalysisResult } from "@/lib/api";
import { cn } from "@/lib/utils";

type Status = "idle" | "processing" | "success" | "error";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

const TiltCard = ({ children, className }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(950px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "perspective(950px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-transform duration-300 ease-out will-change-transform",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="hover"
    >
      {children}
    </div>
  );
};

const Index = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);

      const delta = currentY - lastY;
      if (Math.abs(delta) > 8) {
        setNavHidden(delta > 0 && currentY > 80);
        lastY = currentY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUpload = async (file: File) => {
    setStatus("processing");
    setShowResults(false);

    try {
      const result = await analyzeCSV(file);
      setAnalysisResult(result);
      setStatus("success");
      setShowResults(true);
      toast.success("Analysis completed successfully");
    } catch (error) {
      setStatus("error");
      toast.error(error instanceof Error ? error.message : "Failed to analyze CSV");
    }
  };

  return (
    <div className="app-gradient-shell flex min-h-screen flex-col">
      {/* Parallax background glows */}
      <div
        className="pointer-events-none fixed inset-x-0 -top-64 z-0 h-[480px] bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.45),transparent_60%)] blur-3xl opacity-80"
        style={{
          transform: `translate3d(0, ${scrollY * 0.16}px, 0)`,
        }}
      />
      <div
        className="pointer-events-none fixed -bottom-40 -left-20 z-0 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.4),transparent_65%)] blur-3xl opacity-70"
        style={{
          transform: `translate3d(${scrollY * -0.08}px, ${scrollY * 0.1}px, 0)`,
        }}
      />
      <div
        className="pointer-events-none fixed -right-10 top-1/3 z-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.35),transparent_65%)] blur-3xl opacity-70"
        style={{
          transform: `translate3d(${scrollY * 0.06}px, ${scrollY * -0.08}px, 0)`,
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Navigation */}
        <header className="pointer-events-none sticky top-4 z-40 flex justify-center px-4">
          <nav
            className={cn(
              "pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-2xl transition-all duration-500",
              "shadow-[0_20px_60px_rgba(15,23,42,0.65)]",
              navHidden ? "-translate-y-10 opacity-0" : "translate-y-0 opacity-100",
            )}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-blue to-fuchsia-500 shadow-[0_0_32px_rgba(79,70,229,0.85)]">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold tracking-[0.25em] text-slate-400 uppercase">
                  FRAUD WATCH
                </span>
                <span className="text-[0.7rem] font-mono tracking-[0.16em] text-emerald-300/90">
                  Money Muling Radar
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-7 text-xs font-medium text-slate-300 md:flex">
              <a
                href="#product"
                className="transition-colors hover:text-sky-300"
                data-cursor="hover"
              >
                Product
              </a>
              <a
                href="#stories"
                className="transition-colors hover:text-sky-300"
                data-cursor="hover"
              >
                Use cases
              </a>
              <a
                href="#demo"
                className="transition-colors hover:text-sky-300"
                data-cursor="hover"
              >
                Live demo
              </a>
              <div className="h-6 w-px bg-gradient-to-b from-slate-600/70 via-slate-700/40 to-slate-600/70" />
              <button
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_40px_rgba(79,70,229,0.85)] transition-transform duration-200 hover:scale-[1.03]"
                data-cursor="hover"
              >
                Upload CSV
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </nav>
        </header>

        <main className="flex-1 pb-16 pt-10 md:pt-14">
          {/* Hero */}
          <section id="product" className="px-4">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
              <ScrollReveal>
                <div className="space-y-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/5 px-3 py-1 text-[0.65rem] font-mono uppercase tracking-[0.26em] text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.35)]">
                    <span className="flex h-1.5 w-1.5 items-center justify-center rounded-full bg-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400/50 blur-[2px]" />
                    </span>
                    Real-time money muling radar
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-4xl md:text-5xl lg:text-6xl">
                      <span className="block bg-gradient-to-br from-slate-50 via-slate-100 to-slate-400 bg-clip-text text-transparent">
                        See fraud rings
                      </span>
                      <span className="block bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                        before the money moves.
                      </span>
                    </h1>
                    <p className="max-w-xl text-balance text-sm leading-relaxed text-slate-300/80 md:text-base">
                      Upload transaction graphs, watch the network light up, and surface mule
                      accounts in seconds.
                      <span className="hidden sm:inline">
                        {" "}
                        Built for banks and fintechs that need Apple-level smoothness with
                        Stripe-grade clarity.
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <a
                      href="#demo"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(79,70,229,0.85)] transition-transform duration-200 hover:scale-[1.03]"
                      data-cursor="hover"
                    >
                      Launch live risk demo
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[0.8rem] font-medium text-slate-100/90 backdrop-blur-xl transition-colors duration-200 hover:border-white/35 hover:bg-white/8"
                      data-cursor="hover"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      <span>Detect mule rings in one upload</span>
                    </button>
                  </div>

                  <div className="grid gap-3 text-xs text-slate-300/80 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                      <div className="mb-1 flex items-center gap-2 text-[0.7rem] font-semibold text-slate-100">
                        <LineChart3 className="h-3.5 w-3.5 text-sky-300" />
                        Risk in real time
                      </div>
                      <p className="text-[0.7rem] leading-relaxed text-slate-300/80">
                        Graph analytics tuned for mule rings, fan-outs, and circular flows.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                      <div className="mb-1 flex items-center gap-2 text-[0.7rem] font-semibold text-slate-100">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                        Compliance-ready views
                      </div>
                      <p className="text-[0.7rem] leading-relaxed text-slate-300/80">
                        Explainable clusters, per-node scores, and exportable SAR-ready reports.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                      <div className="mb-1 flex items-center gap-2 text-[0.7rem] font-semibold text-slate-100">
                        <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
                        Ultra-smooth experience
                      </div>
                      <p className="text-[0.7rem] leading-relaxed text-slate-300/80">
                        Apple-level motion with premium glassmorphism and inertial scrolling.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="relative mt-2 lg:mt-0">
                  <div className="pointer-events-none absolute -inset-12 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.35),transparent_55%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.35),transparent_60%)] opacity-80 blur-3xl" />

                  <TiltCard className="relative rounded-[30px] border border-white/12 bg-black/50 p-5 shadow-[0_32px_120px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div className="text-xs">
                          <div className="font-semibold text-slate-100">Alert window</div>
                          <div className="font-mono text-[0.65rem] text-emerald-300/90">
                            12 mule rings surfaced
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[0.65rem] font-mono uppercase tracking-[0.2em] text-emerald-300">
                        Live
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 p-4">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.9)]" />
                          <span className="text-[0.7rem] font-mono tracking-[0.18em] text-slate-300 uppercase">
                            Cluster risk heatmap
                          </span>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] text-emerald-200">
                          98.3% confidence
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[0.65rem] text-slate-200/90">
                        <div className="space-y-1">
                          <div className="rounded-xl bg-gradient-to-b from-sky-500/40 via-sky-500/10 to-slate-900/60 p-3">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="font-mono text-[0.62rem] text-slate-100">
                                Ring M-017
                              </span>
                              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[0.6rem] text-emerald-200">
                                High
                              </span>
                            </div>
                            <p className="text-[0.62rem] text-slate-200/80">
                              37 mule candidates, 4 core hubs, 210 fan-outs.
                            </p>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                            <span className="text-[0.62rem] text-slate-300/75">
                              Avg. ring score
                            </span>
                            <span className="font-mono text-xs text-sky-300">0.94</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="rounded-xl bg-emerald-500/5 p-3">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-[0.62rem] text-slate-300/80">
                                High-velocity flows
                              </span>
                              <span className="font-mono text-[0.6rem] text-emerald-300">
                                +212%
                              </span>
                            </div>
                            <div className="mt-2 h-16 w-full rounded-lg bg-gradient-to-b from-emerald-400/60 to-emerald-500/5">
                              <div className="h-full w-full bg-[radial-gradient(circle_at_10%_0,rgba(52,211,153,0.9),transparent_50%),radial-gradient(circle_at_90%_100%,rgba(52,211,153,0.4),transparent_52%)] opacity-80" />
                            </div>
                          </div>
                          <div className="rounded-xl bg-slate-900/70 p-2.5">
                            <div className="flex items-center justify-between text-[0.6rem] text-slate-300/80">
                              <span>Potential SARs</span>
                              <span className="font-mono text-xs text-amber-300">27</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="rounded-xl bg-slate-900/80 p-3">
                            <p className="mb-2 text-[0.62rem] text-slate-300/85">
                              Top nodes by inbound volume.
                            </p>
                            <div className="space-y-1.5 font-mono text-[0.62rem]">
                              <div className="flex items-center justify-between text-sky-300">
                                <span>#AC-8930</span>
                                <span>0.99</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-200/90">
                                <span>#AC-1043</span>
                                <span>0.97</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-200/70">
                                <span>#AC-6741</span>
                                <span>0.95</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-fuchsia-500/15 px-3 py-2 text-[0.62rem] text-slate-200/90">
                            <span>False positive reduction</span>
                            <span className="font-mono text-xs text-emerald-300">-43%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Masonry / stories */}
          <section id="stories" className="mt-16 px-4">
            <ScrollReveal>
              <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="mb-2 text-xs font-mono uppercase tracking-[0.28em] text-slate-400">
                      Stories from the graph
                    </p>
                    <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                      Pinterest-style insight grid for your risk team.
                    </h2>
                  </div>
                  <p className="max-w-sm text-xs leading-relaxed text-slate-300/80">
                    Uneven cards, natural flow, and scroll-triggered motion help analysts scan
                    complex fraud rings with zero friction.
                  </p>
                </div>

                <div className="columns-1 space-y-6 sm:columns-2 lg:columns-3">
                  {[
                    {
                      title: "Mule Ring M-017",
                      badge: "Graph anomaly",
                      body: "Burst of low-value credits through 37 new accounts, collapsing into 4 mules in under 24 hours.",
                      pill: "Network fan-out",
                    },
                    {
                      title: "Circular wash loop",
                      badge: "Suspicious pattern",
                      body: "Tight nine-node loop with synthetic payroll descriptors and repeating timestamps.",
                      pill: "Synthetic payroll",
                    },
                    {
                      title: "Marketplace drain",
                      badge: "High velocity",
                      body: "Funds exit through a single crossover account linked to 3 different merchant IDs.",
                      pill: "Multi-merchant",
                    },
                    {
                      title: "Dormant to hyper-active",
                      badge: "Behavior shift",
                      body: "Account sleeps for 18 months, then spikes to 124 inbound transfers overnight.",
                      pill: "KYC review",
                    },
                    {
                      title: "Crypto off-ramp bridge",
                      badge: "Hybrid flow",
                      body: "On-chain to off-chain bridge pattern detected with mirrored amounts and timestamps.",
                      pill: "On / off ramp",
                    },
                    {
                      title: "ATM structuring",
                      badge: "Threshold gaming",
                      body: "Series of withdrawals just below reporting thresholds across 12 ATMs in one metro.",
                      pill: "Cash-out",
                    },
                  ].map((card, index) => (
                    <TiltCard key={card.title} className="mb-6">
                      <article className="glass-surface group relative overflow-hidden rounded-3xl border border-white/12 px-5 py-5 shadow-[0_26px_80px_rgba(15,23,42,0.9)]">
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.22),transparent_55%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.24),transparent_60%)] mix-blend-screen" />
                        </div>
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/6 px-2.5 py-1 text-[0.6rem] font-mono uppercase tracking-[0.2em] text-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {card.badge}
                          </span>
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[0.6rem] text-slate-300">
                            {index % 2 === 0 ? "0.94 risk" : "0.89 risk"}
                          </span>
                        </div>
                        <h3 className="mb-2 text-sm font-semibold text-slate-50">{card.title}</h3>
                        <p className="mb-3 text-[0.78rem] leading-relaxed text-slate-300/85">
                          {card.body}
                        </p>
                        <div className="flex items-center justify-between gap-2 text-[0.7rem] text-slate-300/85">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-1 text-[0.65rem] font-mono text-sky-300">
                            <LineChart3 className="h-3 w-3" />
                            {card.pill}
                          </span>
                          <span className="text-[0.65rem] text-slate-400">
                            Scroll to reveal full cluster
                          </span>
                        </div>
                      </article>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* Live product demo */}
          <section id="demo" className="mt-20 px-4">
            <ScrollReveal>
              <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="mb-2 text-xs font-mono uppercase tracking-[0.28em] text-emerald-300">
                      Live product surface
                    </p>
                    <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                      Drop in your CSV, watch mule rings materialize.
                    </h2>
                  </div>
                  <p className="max-w-sm text-xs leading-relaxed text-slate-300/80">
                    All animations are GPU-accelerated with no layout thrash, so even large graphs
                    stay at 60fps.
                  </p>
                </div>

                <TiltCard className="rounded-3xl border border-white/12 bg-black/55 p-5 shadow-[0_30px_120px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="mb-1 text-[0.8rem] font-mono uppercase tracking-[0.22em] text-slate-400">
                        Upload transaction graph
                      </p>
                      <p className="text-sm text-slate-200/90">
                        CSV stays client-side. The engine extracts entities, builds the graph, and
                        surfaces risk clusters.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[0.65rem] font-mono uppercase tracking-[0.22em] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(34,197,94,0.9)]" />
                      {status === "processing"
                        ? "Analyzing network in real time"
                        : status === "success"
                          ? "Risk surface ready"
                          : "Idle · Waiting for CSV"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <CsvUpload onUpload={handleUpload} />
                    <ProcessingStatus status={status} />

                    {showResults && analysisResult && (
                      <div className="flex flex-col gap-5">
                        <SummaryCards data={analysisResult.summary} />
                        <NetworkGraph data={analysisResult.networkGraph} />
                        <SuspiciousTable data={analysisResult.suspiciousAccounts} />
                        <FraudRingsTable data={analysisResult.fraudRings} />
                        <DownloadButton data={analysisResult} />
                      </div>
                    )}
                  </div>
                </TiltCard>
              </div>
            </ScrollReveal>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
