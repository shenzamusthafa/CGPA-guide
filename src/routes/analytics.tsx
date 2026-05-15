import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useAcademicStore } from "@/lib/store";
import { getBranch } from "@/data/academicData";
import { computeStats, runningCGPA } from "@/lib/cgpa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — IIITK Academic Companion" },
      { name: "description", content: "Visualise your SGPA trend, CGPA growth and projected path to your target." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { branch, currentSemester, sgpas, targetCGPA } = useAcademicStore();

  if (!branch || !currentSemester) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold">No data yet</h1>
        <Link to="/setup" className="mt-6 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
          Set up your profile
        </Link>
      </div>
    );
  }

  const branchInfo = getBranch(branch);
  const stats = computeStats(branchInfo, currentSemester, sgpas, targetCGPA ?? undefined);

  const trend = useMemo(() => {
    return Array.from({ length: branchInfo.totalSemesters }, (_, i) => i + 1).map((s) => ({
      sem: `S${s}`,
      sgpa: sgpas[s] ?? null,
      credits: branchInfo.semesterCredits[s] ?? 0,
    }));
  }, [branchInfo, sgpas]);

  const growth = useMemo(() => {
    const past = runningCGPA(branchInfo, sgpas, currentSemester - 1);
    const data: { sem: string; cgpa: number | null; projection: number | null }[] = past.map((p) => ({
      sem: `S${p.sem}`,
      cgpa: p.cgpa,
      projection: null,
    }));
    if (stats.requiredFutureSGPA != null) {
      let w = stats.cgpa * stats.completedCredits;
      let c = stats.completedCredits;
      const target = Math.max(0, Math.min(10, stats.requiredFutureSGPA));
      for (let s = currentSemester; s <= branchInfo.totalSemesters; s++) {
        const cred = branchInfo.semesterCredits[s] ?? 0;
        w += target * cred;
        c += cred;
        data.push({ sem: `S${s}`, cgpa: null, projection: c > 0 ? w / c : null });
      }
    }
    return data;
  }, [branchInfo, sgpas, currentSemester, stats]);

  return (
    <div className="py-10">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Analytics</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Visualise your trajectory</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {branchInfo.name} · Semester {currentSemester} · {branchInfo.totalSemesters} semester programme
        </p>
      </header>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-sm font-semibold">SGPA per semester</h3>
          <p className="mt-1 text-xs text-muted-foreground">Bar height = SGPA. Bars also encode each sem's credit weight.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.03 270 / 0.2)" />
                <XAxis dataKey="sem" stroke="currentColor" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="currentColor" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="sgpa" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold">CGPA growth & projection</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Solid: actual CGPA. Dashed: projected path if you hit the required avg.
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.03 270 / 0.2)" />
                <XAxis dataKey="sem" stroke="currentColor" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="currentColor" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend />
                {targetCGPA != null && (
                  <ReferenceLine y={targetCGPA} stroke="var(--chart-2)" strokeDasharray="4 4" label={{ value: `Target ${targetCGPA}`, fill: "var(--chart-2)", fontSize: 11 }} />
                )}
                <Line type="monotone" dataKey="cgpa" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                <Line type="monotone" dataKey="projection" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>

      <section className="mt-4">
        <GlassCard>
          <h3 className="text-sm font-semibold">Credit distribution by semester</h3>
          <p className="mt-1 text-xs text-muted-foreground">High-credit semesters carry more weight in your CGPA.</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.03 270 / 0.2)" />
                <XAxis dataKey="sem" stroke="currentColor" fontSize={12} />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="credits" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}