import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Sparkles, Target, Compass } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IIIT Kottayam Academic Companion — CGPA analytics & roadmap" },
      {
        name: "description",
        content:
          "Plan your CGPA, target a goal, and get a personalised semester roadmap built around the official IIIT Kottayam B.Tech curriculum.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="pb-10">
      <section className="relative pt-20 pb-16 text-center sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Built for IIIT Kottayam · CSE · AI&DS · ECE · Cyber
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-bold leading-[1.05] sm:text-6xl"
        >
          Your <span className="text-gradient">academic strategist</span>,
          <br className="hidden sm:block" /> not just a CGPA calculator.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-5 max-w-xl text-base text-muted-foreground"
        >
          Branch-aware credit math, honest target feedback, and a semester-by-semester roadmap
          tailored to the official IIITK B.Tech curriculum.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/setup"
            className="group inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            Start your analysis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground"
          >
            How it works
          </Link>
        </motion.div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Target,
            title: "Set a CGPA target",
            body: "Tell us your dream CGPA and we'll compute the exact average SGPA you need across remaining credits — weighted, not naive.",
          },
          {
            icon: BarChart3,
            title: "See the math, visually",
            body: "Track SGPA trend, CGPA growth and a projection band that respects your branch's actual semester credits.",
          },
          {
            icon: Compass,
            title: "Get a real roadmap",
            body: "Per-semester suggested SGPA bands, sharper for high-credit semesters where the impact is biggest.",
          },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <GlassCard className="h-full">
              <f.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
