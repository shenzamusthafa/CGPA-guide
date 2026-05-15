import type { BranchInfo } from "@/data/academicData";
import type { CGPAStats } from "./cgpa";

export type FeedbackTier = "achievable" | "ambitious" | "reach";

export interface Feedback {
  tier: FeedbackTier;
  headline: string;
  body: string;
  suggestedBand?: { low: number; high: number };
}

export function buildFeedback(stats: CGPAStats, targetCGPA: number): Feedback {
  const r = stats.requiredFutureSGPA;
  if (r == null || stats.remainingCredits <= 0) {
    return {
      tier: "achievable",
      headline: "You've already finished your coursework.",
      body: `Your final CGPA stands at ${stats.cgpa.toFixed(2)}. Focus now shifts to projects, internships and placements.`,
    };
  }
  if (r <= 0) {
    return {
      tier: "achievable",
      headline: "Target already secured 🎉",
      body: `Your current CGPA is already at or above ${targetCGPA.toFixed(2)}. Maintain a steady SGPA above ${Math.max(targetCGPA - 0.5, 6).toFixed(1)} and you'll comfortably hold the line.`,
    };
  }
  if (r > 10) {
    const realisticTarget = stats.maxAchievableCGPA;
    const low = Math.max(realisticTarget - 0.2, 6);
    return {
      tier: "reach",
      headline: "This target is mathematically out of reach — let's reframe.",
      body: `Even with a perfect 10.0 in every remaining semester, the highest CGPA you can reach is ${realisticTarget.toFixed(2)}. A strong, realistic goal would be ${low.toFixed(2)}–${realisticTarget.toFixed(2)}, which still puts you in an excellent academic position.`,
      suggestedBand: { low, high: realisticTarget },
    };
  }
  if (r > 9.7) {
    const low = Math.max(stats.maxAchievableCGPA - 0.3, targetCGPA - 0.4);
    const high = Math.min(stats.maxAchievableCGPA, targetCGPA);
    return {
      tier: "reach",
      headline: "Technically possible, but extremely tight.",
      body: `You'd need a near-perfect ${r.toFixed(2)} SGPA across every remaining semester. A more sustainable target band is ${low.toFixed(2)}–${high.toFixed(2)} — protect every high-credit theory paper and treat lab grades as non-negotiable.`,
      suggestedBand: { low, high },
    };
  }
  if (r > 8.5) {
    return {
      tier: "ambitious",
      headline: "Ambitious — but very much within reach.",
      body: `You need to average around ${r.toFixed(2)} SGPA across the remaining ${stats.remainingCredits} credits. Prioritise the high-credit theory subjects, avoid any single-semester dip, and treat lab/project work as easy SGPA boosters.`,
    };
  }
  return {
    tier: "achievable",
    headline: "Comfortably achievable — protect your consistency.",
    body: `An average SGPA of just ${r.toFixed(2)} across the remaining ${stats.remainingCredits} credits gets you to ${targetCGPA.toFixed(2)}. Maintain steady performance, especially in lab courses, and don't let one bad semester drag the average down.`,
  };
}

export interface RoadmapEntry {
  semester: number;
  credits: number;
  suggestedBand: { low: number; high: number };
}

export function buildRoadmap(
  branch: BranchInfo,
  currentSemester: number,
  requiredAvg: number | null
): RoadmapEntry[] {
  if (requiredAvg == null) return [];
  const out: RoadmapEntry[] = [];
  // Weight: high-credit semesters get tighter targets (less margin)
  const remainingSems: number[] = [];
  for (let s = currentSemester; s <= branch.totalSemesters; s++) remainingSems.push(s);
  if (remainingSems.length === 0) return [];
  const credits = remainingSems.map((s) => branch.semesterCredits[s] ?? 0);
  const maxC = Math.max(...credits);
  for (let i = 0; i < remainingSems.length; i++) {
    const s = remainingSems[i];
    const c = credits[i];
    const tightness = c / maxC; // 1 = tightest
    const margin = 0.5 * (1 - tightness * 0.6); // 0.2..0.5
    const center = Math.min(10, Math.max(0, requiredAvg));
    const low = Math.max(0, Math.min(10, center - margin));
    const high = Math.max(0, Math.min(10, center + margin));
    out.push({ semester: s, credits: c, suggestedBand: { low, high } });
  }
  return out;
}