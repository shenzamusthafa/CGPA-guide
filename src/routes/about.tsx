import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — IIITK Academic Companion" },
      { name: "description", content: "How the IIITK Academic Companion works, its data sources, and what's coming next." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">About</p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">An academic companion, not a calculator.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        This tool was built for IIIT Kottayam B.Tech students to make smarter academic decisions —
        with branch-aware credit math, honest target feedback, and a per-semester roadmap.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <GlassCard>
          <h2 className="text-lg font-semibold">How CGPA is computed</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            CGPA = Σ (SGPAᵢ × creditsᵢ) / Σ creditsᵢ — properly weighted by each semester's credit load.
            High-credit semesters move your CGPA more, so we surface them in the roadmap.
          </p>
        </GlassCard>
        <GlassCard>
          <h2 className="text-lg font-semibold">Where the credits come from</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Semester credit totals were extracted directly from the official IIIT Kottayam B.Tech course
            structures (July 2025 senate version) for CSE, AI&DS, ECE and Cyber Security.
          </p>
        </GlassCard>
        <GlassCard>
          <h2 className="text-lg font-semibold">Target feedback tiers</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Achievable, Ambitious, or Reach — based on the average SGPA you'd need across remaining
            credits. We never tell you a target is "impossible" — we reframe it into a realistic band.
          </p>
        </GlassCard>
        <GlassCard>
          <h2 className="text-lg font-semibold">Coming soon</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Subject-level credit input (per course, not just per semester)</li>
            <li>Attendance & backlog tracker</li>
            <li>AI-mentor chat trained on your trajectory</li>
            <li>Placement-readiness score</li>
          </ul>
        </GlassCard>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Not affiliated with IIIT Kottayam. Curriculum data is provided as-is and may need editing if
        the institute updates the syllabus.
      </p>
    </div>
  );
}