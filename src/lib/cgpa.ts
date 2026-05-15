import type { BranchInfo } from "@/data/academicData";

export interface CGPAStats {
  cgpa: number;
  completedCredits: number;
  remainingCredits: number;
  totalCredits: number;
  requiredFutureSGPA: number | null;
  maxAchievableCGPA: number;
  minAchievableCGPA: number;
}

export function computeStats(
  branch: BranchInfo,
  currentSemester: number,
  sgpas: Record<number, number>,
  targetCGPA?: number
): CGPAStats {
  const completedSems = Math.max(0, Math.min(currentSemester - 1, branch.totalSemesters));
  let weighted = 0;
  let completedCredits = 0;
  for (let s = 1; s <= completedSems; s++) {
    const c = branch.semesterCredits[s] ?? 0;
    const sgpa = sgpas[s];
    if (sgpa != null && !Number.isNaN(sgpa)) {
      weighted += sgpa * c;
      completedCredits += c;
    }
  }
  const cgpa = completedCredits > 0 ? weighted / completedCredits : 0;
  let totalCredits = 0;
  for (let s = 1; s <= branch.totalSemesters; s++) totalCredits += branch.semesterCredits[s] ?? 0;
  const remainingCredits = totalCredits - completedCredits;

  let requiredFutureSGPA: number | null = null;
  if (targetCGPA != null && remainingCredits > 0) {
    requiredFutureSGPA = (targetCGPA * totalCredits - cgpa * completedCredits) / remainingCredits;
  }

  const maxAchievableCGPA = (weighted + 10 * remainingCredits) / totalCredits;
  const minAchievableCGPA = (weighted + 0 * remainingCredits) / totalCredits;

  return {
    cgpa,
    completedCredits,
    remainingCredits,
    totalCredits,
    requiredFutureSGPA,
    maxAchievableCGPA,
    minAchievableCGPA,
  };
}

export function runningCGPA(
  branch: BranchInfo,
  sgpas: Record<number, number>,
  upToSem: number
): { sem: number; sgpa: number | null; cgpa: number | null }[] {
  const out: { sem: number; sgpa: number | null; cgpa: number | null }[] = [];
  let w = 0;
  let c = 0;
  for (let s = 1; s <= upToSem; s++) {
    const cred = branch.semesterCredits[s] ?? 0;
    const sgpa = sgpas[s];
    if (sgpa != null && !Number.isNaN(sgpa)) {
      w += sgpa * cred;
      c += cred;
      out.push({ sem: s, sgpa, cgpa: c > 0 ? w / c : null });
    } else {
      out.push({ sem: s, sgpa: null, cgpa: null });
    }
  }
  return out;
}