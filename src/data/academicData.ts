export type BranchKey = "cse" | "aids" | "ece" | "cyber";

export interface BranchInfo {
  name: string;
  fullName: string;
  totalSemesters: number;
  semesterCredits: Record<number, number>;
}

export const academicData: { btech: { name: string; branches: Record<BranchKey, BranchInfo> } } = {
  btech: {
    name: "B.Tech",
    branches: {
      cse: {
        name: "CSE",
        fullName: "Computer Science and Engineering",
        totalSemesters: 8,
        semesterCredits: { 1: 23, 2: 23, 3: 24, 4: 24, 5: 22, 6: 21, 7: 21, 8: 16 },
      },
      aids: {
        name: "AI & DS",
        fullName: "CSE — Artificial Intelligence & Data Science",
        totalSemesters: 8,
        semesterCredits: { 1: 23, 2: 23, 3: 24, 4: 24, 5: 22, 6: 21, 7: 21, 8: 16 },
      },
      ece: {
        name: "ECE",
        fullName: "Electronics and Communication Engineering",
        totalSemesters: 8,
        semesterCredits: { 1: 22, 2: 23, 3: 25, 4: 24, 5: 22, 6: 21, 7: 21, 8: 16 },
      },
      cyber: {
        name: "Cyber Security",
        fullName: "CSE — Cyber Security",
        totalSemesters: 8,
        semesterCredits: { 1: 23, 2: 23, 3: 24, 4: 24, 5: 22, 6: 21, 7: 21, 8: 16 },
      },
    },
  },
};

export const branchList = (Object.keys(academicData.btech.branches) as BranchKey[]).map((k) => ({
  key: k,
  ...academicData.btech.branches[k],
}));

export function getBranch(key: BranchKey): BranchInfo {
  return academicData.btech.branches[key];
}