## Verified semester credits (from the uploaded curriculum PDFs)

| Branch | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | Total |
|---|---|---|---|---|---|---|---|---|---|
| CSE | 23 | 23 | 24 | 24 | 22 | 21 | 21 | 16 | 174 |
| AI & DS | 23 | 23 | 24 | 24 | 22 | 21 | 21 | 16 | 174 |
| ECE | 22 | 23 | 25 | 24 | 22 | 21 | 21 | 16 | 174 |
| Cyber Security | 23 | 23 | 24 | 24 | 22 | 21 | 21 | 16 | 174 |

These will be the source of truth for all CGPA / target / roadmap math.

## Product

A futuristic, glassmorphic dashboard that walks a student through:
1. Choose program (B.Tech) → branch → current semester
2. Enter SGPA for each completed semester (auto-generated from current sem)
3. See current CGPA + completed/remaining credits
4. Enter desired CGPA → get required-future-SGPA + tiered mentor feedback
5. Explore charts (SGPA trend, CGPA growth, future projection) and a semester roadmap

Tone of feedback follows the three tiers in the brief (Achievable / Ambitious / Reach-target rewrite), generated locally — no AI calls.

## Routes (TanStack Start, file-based)

- `/` — Hero landing (animated gradient, project tagline, "Start Analysis" CTA)
- `/setup` — Step 1 wizard: program, branch, current semester
- `/dashboard` — SGPA inputs + CGPA cards + target input + feedback + roadmap
- `/analytics` — Charts: SGPA bar trend, CGPA growth line, projected CGPA range
- `/about` — Brief about the tool + curriculum source notice

Shared glass `Navbar` + `Footer` in `__root.tsx`. Each route gets its own `head()` metadata.

State (selection, SGPAs, target) persisted in `localStorage` via a small Zustand store so navigation between routes doesn't lose data.

## Architecture

```text
src/
  routes/
    __root.tsx, index.tsx, setup.tsx, dashboard.tsx, analytics.tsx, about.tsx
  components/
    Navbar.tsx, Footer.tsx, HeroSection.tsx,
    SemesterInputCard.tsx, CGPACard.tsx, TargetCard.tsx,
    FeedbackCard.tsx, RoadmapSection.tsx,
    SGPATrendChart.tsx, CGPAGrowthChart.tsx, ProjectionChart.tsx,
    GlassCard.tsx, ThemeToggle.tsx
  data/
    academicData.ts        // branch → totalSemesters, semesterCredits{1..8}
                          //   structured to allow future subjectCredits per sem
  lib/
    cgpa.ts                // calc CGPA, completed/remaining credits, required SGPA
    feedback.ts            // tiered mentor feedback + roadmap generator
    store.ts               // Zustand store (program, branch, sem, sgpas, target)
  styles.css               // design tokens
```

`academicData.ts` shape (matches your brief):
```ts
export const academicData = {
  btech: {
    branches: {
      cse:   { name: "CSE",            totalSemesters: 8, semesterCredits: {1:23,2:23,3:24,4:24,5:22,6:21,7:21,8:16} },
      aids:  { name: "AI & DS",        totalSemesters: 8, semesterCredits: {1:23,2:23,3:24,4:24,5:22,6:21,7:21,8:16} },
      ece:   { name: "ECE",            totalSemesters: 8, semesterCredits: {1:22,2:23,3:25,4:24,5:22,6:21,7:21,8:16} },
      cyber: { name: "Cyber Security", totalSemesters: 8, semesterCredits: {1:23,2:23,3:24,4:24,5:22,6:21,7:21,8:16} },
    }
  }
}
```

## CGPA + feedback math

- CGPA = Σ(SGPAᵢ × creditsᵢ) / Σ(creditsᵢ) over completed semesters
- Required future SGPA = (target × totalCredits − currentCGPA × completedCredits) / remainingCredits
- Feedback tiers (against required future SGPA `R`):
  - **Achievable** if R ≤ 8.5 → encouraging, "maintain consistency, protect labs"
  - **Ambitious** if 8.5 < R ≤ 9.7 → strategic, "high-credit theory first, no SGPA dips"
  - **Reach** if R > 10 or R > 9.7 → reframe with realistic max + suggested band (e.g. "8.4–8.7"), never harsh
- Roadmap: per-remaining-semester suggested SGPA band, weighted by that semester's credits (so high-credit sems get sharper targets).

## Visualizations (recharts)

- **SGPATrendChart** — bar chart, semesters on X, SGPA on Y, 0–10 axis
- **CGPAGrowthChart** — line chart of running CGPA after each semester
- **ProjectionChart** — line for past CGPA + dashed projection band to target through remaining sems

## Design system

- Dark-by-default with light toggle (already wired via `.dark` class in `styles.css`)
- Tokens added to `src/styles.css`: gradient backgrounds (`--gradient-aurora`, `--gradient-mesh`), glass surface (`--glass-bg`, `--glass-border`), glow shadow, accent indigo + cyan
- Glassmorphism `GlassCard` primitive: `backdrop-blur`, translucent surface, soft border, hover glow
- Typography: Space Grotesk (display) + Inter (body) via Google Fonts in `__root.tsx`
- Motion: framer-motion for hero, card stagger, number count-up, route transitions
- Mobile-first responsive grid; bottom-safe sticky CTA on `/setup` and `/dashboard`

## Future-readiness (no UI yet, but architecture supports it)

- `academicData` typed so `semesterCredits` can later become `{ subjects: [{code, name, credits}] }` without breaking call sites
- Store keyed by `program/branch` so switching programs later (e.g. M.Tech) is additive
- Feedback engine takes a `Profile` object → easy to swap to AI-generated mentor text later

## Out of scope (per "frontend only" + future-feature list)

Auth, Firebase/Cloud, attendance, backlog tracker, AI chat, placement score — listed in `/about` as "coming soon" but not implemented now.

## Build order

1. Tokens + base layout (`styles.css`, `__root.tsx`, `Navbar`, `Footer`, `GlassCard`)
2. `academicData.ts` + `cgpa.ts` + `feedback.ts` + Zustand store
3. `/` hero + `/setup` wizard
4. `/dashboard` (SGPA inputs, CGPA cards, target, feedback, roadmap)
5. `/analytics` charts
6. `/about` + polish pass (motion, dark/light toggle, responsive QA)
