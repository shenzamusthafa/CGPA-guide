import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { branchList, type BranchKey } from "@/data/academicData";
import { useAcademicStore } from "@/lib/store";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Setup — IIITK Academic Companion" },
      {
        name: "description",
        content:
          "Pick your branch and current semester to begin. We'll load the official IIITK credit structure for you.",
      },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const { branch, currentSemester, setBranch, setSemester } = useAcademicStore();

  const canContinue = !!branch && !!currentSemester;

  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Step 1 of 2</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Set up your profile</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          B.Tech is auto-selected. Pick your branch and the semester you're currently in.
        </p>
      </motion.div>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Branch</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {branchList.map((b) => {
            const active = branch === b.key;
            return (
              <button
                key={b.key}
                onClick={() => setBranch(b.key as BranchKey)}
                className={`text-left transition-all ${active ? "scale-[1.01]" : "hover:scale-[1.005]"}`}
              >
                <GlassCard
                  className={`flex items-center justify-between border-2 ${
                    active
                      ? "border-primary shadow-glow"
                      : "border-transparent"
                  }`}
                >
                  <div>
                    <div className="text-lg font-semibold">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.fullName}</div>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      8 semesters · {Object.values(b.semesterCredits).reduce((a, c) => a + c, 0)} total credits
                    </div>
                  </div>
                  {active && (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </GlassCard>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Current semester</h2>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => {
            const active = currentSemester === s;
            return (
              <button
                key={s}
                onClick={() => setSemester(s)}
                className={`rounded-2xl py-4 text-center text-base font-semibold transition-all ${
                  active
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-glow"
                    : "glass text-foreground hover:border-primary/50"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          You'll be asked to enter SGPA for semesters 1 through {currentSemester ? currentSemester - 1 : "n−1"}.
        </p>
      </section>

      <div className="sticky bottom-4 mt-10 flex justify-end">
        <button
          disabled={!canContinue}
          onClick={() => navigate({ to: "/dashboard" })}
          className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to dashboard
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}