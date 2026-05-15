import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useAcademicStore } from "@/lib/store";
import { getBranch } from "@/data/academicData";
import { computeStats } from "@/lib/cgpa";
import { buildFeedback, buildRoadmap } from "@/lib/feedback";
import { Sparkles, Target, Trophy, GaugeCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — IIITK Academic Companion" },
      { name: "description", content: "Track your CGPA, set a target, and see your personalised roadmap." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { branch, currentSemester, sgpas, targetCGPA, setSGPA, setTarget } =
    useAcademicStore();

  if (!branch || !currentSemester) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold">Let's set you up first</h1>
        <p className="mt-2 text-muted-foreground">Pick your branch and current semester to begin.</p>
        <Link
          to="/setup"
          className="mt-6 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Go to setup
        </Link>
      </div>
    );
  }

  const branchInfo = getBranch(branch);
  const stats = useMemo(
    () => computeStats(branchInfo, currentSemester, sgpas, targetCGPA ?? undefined),
    [branchInfo, currentSemester, sgpas, targetCGPA]
  );
  const feedback = useMemo(
    () => (targetCGPA ? buildFeedback(stats, targetCGPA) : null),
    [stats, targetCGPA]
  );
  const roadmap = useMemo(
    () => buildRoadmap(branchInfo, currentSemester, stats.requiredFutureSGPA),
    [branchInfo, currentSemester, stats.requiredFutureSGPA]
  );

  const completedSems = Math.max(0, currentSemester - 1);
  const tierColor =
    feedback?.tier === "achievable"
      ? "from-emerald-500/30 to-emerald-500/10 border-emerald-500/40"
      : feedback?.tier === "ambitious"
        ? "from-amber-500/30 to-amber-500/10 border-amber-500/40"
        : "from-rose-500/30 to-rose-500/10 border-rose-500/40";

  return (
    <div className="py-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">{branchInfo.name} · Semester {currentSemester}</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Your dashboard</h1>
        </div>
        <Link to="/setup" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
          Change branch / semester
        </Link>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <GlassCard>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <GaugeCircle className="h-4 w-4 text-accent" /> Current CGPA
          </div>
          <div className="mt-3 text-5xl font-bold text-gradient">
            {stats.cgpa > 0 ? stats.cgpa.toFixed(2) : "—"}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Across {completedSems} completed semester{completedSems === 1 ? "" : "s"}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Trophy className="h-4 w-4 text-accent" /> Completed credits
          </div>
          <div className="mt-3 text-5xl font-bold">{stats.completedCredits}</div>
          <div className="mt-2 text-xs text-muted-foreground">of {stats.totalCredits} total credits</div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[image:var(--gradient-primary)]"
              style={{ width: `${(stats.completedCredits / stats.totalCredits) * 100}%` }}
            />
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" /> Remaining credits
          </div>
          <div className="mt-3 text-5xl font-bold">{stats.remainingCredits}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Across semesters {currentSemester}–{branchInfo.totalSemesters}
          </div>
        </GlassCard>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Enter your past SGPAs</h2>
        {completedSems === 0 ? (
          <GlassCard>
            <p className="text-sm text-muted-foreground">
              You're in your first semester — no past SGPAs yet. Set a target below to see what you need to aim for.
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: completedSems }, (_, i) => i + 1).map((s) => (
              <GlassCard key={s} className="flex items-center gap-4 p-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Semester</span>
                  <span className="font-display text-2xl font-bold">{s}</span>
                  <span className="text-[11px] text-muted-foreground">{branchInfo.semesterCredits[s]} credits</span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.01}
                  placeholder="0.00"
                  value={sgpas[s] ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSGPA(s, v === "" ? Number.NaN : Math.max(0, Math.min(10, parseFloat(v))));
                  }}
                  className="ml-auto w-28 rounded-xl border border-border bg-background/40 px-3 py-2 text-right font-display text-2xl font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <GlassCard>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-accent" /> Set your target CGPA
          </div>
          <div className="mt-4 flex items-center gap-4">
            <input
              type="range"
              min={6}
              max={10}
              step={0.05}
              value={targetCGPA ?? 8.5}
              onChange={(e) => setTarget(parseFloat(e.target.value))}
              className="flex-1 accent-primary"
            />
            <input
              type="number"
              min={0}
              max={10}
              step={0.01}
              value={targetCGPA ?? ""}
              placeholder="8.50"
              onChange={(e) => setTarget(e.target.value === "" ? null : parseFloat(e.target.value))}
              className="w-24 rounded-xl border border-border bg-background/40 px-3 py-2 text-right font-display text-2xl font-bold outline-none focus:border-primary"
            />
          </div>
          {stats.requiredFutureSGPA != null && (
            <div className="mt-5 rounded-xl border border-border/60 bg-background/30 p-4 text-sm">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Required average SGPA over remaining {stats.remainingCredits} credits
              </div>
              <div className="mt-1 font-display text-3xl font-bold text-gradient">
                {stats.requiredFutureSGPA.toFixed(2)}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Max achievable: {stats.maxAchievableCGPA.toFixed(2)} · Min if you fail everything: {stats.minAchievableCGPA.toFixed(2)}
              </div>
            </div>
          )}
        </GlassCard>

        {feedback && (
          <motion.div
            key={feedback.headline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`rounded-2xl border bg-gradient-to-br p-6 ${tierColor}`}>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
                {feedback.tier === "achievable" ? "✓ Achievable" : feedback.tier === "ambitious" ? "⚡ Ambitious" : "⚠ Reach"}
              </div>
              <h3 className="mt-2 text-xl font-bold">{feedback.headline}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{feedback.body}</p>
            </div>
          </motion.div>
        )}
      </section>

      {roadmap.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Your semester roadmap</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((r) => (
              <GlassCard key={r.semester}>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Semester {r.semester}</span>
                  <span>{r.credits} credits</span>
                </div>
                <div className="mt-3 font-display text-3xl font-bold text-gradient">
                  {r.suggestedBand.low.toFixed(1)}–{r.suggestedBand.high.toFixed(1)}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">Suggested SGPA band</div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 text-center">
        <Link
          to="/analytics"
          className="inline-flex rounded-full glass px-6 py-3 text-sm font-semibold hover:border-primary/60"
        >
          See visual analytics →
        </Link>
      </div>
    </div>
  );
}