import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BranchKey } from "@/data/academicData";

interface AcademicState {
  program: "btech";
  branch: BranchKey | null;
  currentSemester: number | null;
  sgpas: Record<number, number>;
  targetCGPA: number | null;
  setBranch: (b: BranchKey) => void;
  setSemester: (n: number) => void;
  setSGPA: (sem: number, value: number) => void;
  setTarget: (n: number | null) => void;
  reset: () => void;
}

export const useAcademicStore = create<AcademicState>()(
  persist(
    (set) => ({
      program: "btech",
      branch: null,
      currentSemester: null,
      sgpas: {},
      targetCGPA: null,
      setBranch: (b) => set({ branch: b }),
      setSemester: (n) => set({ currentSemester: n }),
      setSGPA: (sem, value) =>
        set((s) => ({ sgpas: { ...s.sgpas, [sem]: value } })),
      setTarget: (n) => set({ targetCGPA: n }),
      reset: () =>
        set({ branch: null, currentSemester: null, sgpas: {}, targetCGPA: null }),
    }),
    { name: "iiitk-companion" }
  )
);