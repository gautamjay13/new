import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type PageLoaderProps = {
  onFinish: () => void;
};

export const PageLoader = ({ onFinish }: PageLoaderProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimeout = window.setTimeout(() => {
      setIsExiting(true);
    }, 1400);

    const finishTimeout = window.setTimeout(() => {
      onFinish();
    }, 2000);

    return () => {
      window.clearTimeout(exitTimeout);
      window.clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[#050509] text-foreground pointer-events-none",
        "transition-opacity duration-700 ease-out",
        isExiting ? "opacity-0" : "opacity-100",
      )}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-cyber-blue/20 via-cyber-blue-dim/10 to-cyber-red/20 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(129,140,248,0.35)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(244,114,182,0.25),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.3),transparent_55%)] mix-blend-screen" />
          <div className="absolute inset-0 animate-loader-orbit">
            <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyber-blue shadow-[0_0_25px_rgba(129,140,248,0.9)]" />
          </div>
          <div className="relative text-xs font-semibold tracking-[0.18em] uppercase text-slate-100">
            FRAUD
            <span className="block text-[0.58rem] font-normal tracking-[0.26em] text-slate-400">
              WATCH
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="relative h-1.5 w-52 overflow-hidden rounded-full bg-white/5">
            <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-cyber-blue via-fuchsia-400 to-cyan-300 animate-loader-bar will-change-transform" />
          </div>
          <p className="text-xs font-mono uppercase tracking-[0.22em] text-slate-400/90">
            Initializing risk engine
            <span className="inline-block animate-loader-dots" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

