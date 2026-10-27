# Math Quest — Content Agent Spec (ریاضی‌کوئست)

Persian (فارسی) Grade-10 math learning game. The app shell (map, lesson view, quiz, XP,
progress, KaTeX) already exists. Your job as a content agent is ONLY: **lesson data file(s)
+ interactive widget file(s)** for your assigned chapter(s), in Persian.

## ⛔ Hard rules

1. **Do NOT touch shared files**: `curriculum.ts`, `registry.tsx`, `i18n.tsx`, `dict/*`,
   `layout.tsx`, `page.tsx`, sim-kit, other agents' `chN.ts` / `cN.tsx`.
   You own exactly: `src/data/math/chN.ts` and `src/components/sims/math/cN.tsx`
   (+ optional helper `src/components/sims/math/helpers-cN.tsx` if a widget needs one).
2. **Everything in Persian.** UI labels, explanations, hints. Math expressions stay in
   KaTeX/LaTeX (Latin digits inside `$…$` is fine and standard).
3. **Zero wrong math.** Every question, answer, step and widget computation must be
   mathematically verified by you before finishing. Recompute each numeric answer by hand.
4. **No placeholder content.** No "…" , no TODO, no lorem, no empty arrays.
5. Read `/home/z/my-project/worklog.md` before starting; append your section when done
   (use bash `cat >>` so you never overwrite other agents' entries).

## Lesson data — `src/data/math/chN.ts`

```ts
import type { Lesson } from '@/lib/game/types'
export const lessonsChN: Lesson[] = [ /* ... */ ]
```

Fill the full `Lesson` shape (see `src/lib/game/types.ts`):

| field | requirement |
|---|---|
| `id` | EXACT id from the table below (simKey = same id) |
| `unitId` | `'chN'` |
| `order` | 1-based within the chapter |
| `title` / `tagline` | Persian; tagline = one motivating sentence |
| `difficulty` | `'easy'` for lesson 1 → mix toward `'challenge'` |
| `minutes` | realistic 8–18 |
| `xp` | 100 |
| `objectives` | 3–4 Persian learning goals («...» style: «تشخیص دهی …») |
| `concept` | **10–16 content blocks** — a complete textbook-quality explanation |
| `simKey` | same string as `id` |
| `workedExample` | real problem + **4–7 steps** (`text` Persian, `tex` LaTeX) + answer |
| `practice` | **4–5 questions** with hints (2–3 each) + explanation |
| `quiz` | **5 questions** (mix `mc` and `numeric`) with hints + explanation |

Content block types (`ContentBlock`): `p` (paragraph), `h` (sub-heading), `formula`
(`tex` block formula + `caption`), `list`, `key` (highlighted key-fact), `table`.
Inline math goes inside `$…$` **in the text strings**; KaTeX renders it.
Write like a great Iranian textbook author: تعریف → مثال ساده → نکته → هشدار اشتباه رایج.

Question ids: `${lessonId}-p1…p5` / `${lessonId}-q1…q5`.
`numeric` questions: set `answer` + small `tolerance` (e.g. `0.01`) and `unit` if any.
MC choices: 4 options, plausible distractors (common mistakes), `answerIndex` correct.

## Widgets — `src/components/sims/math/cN.tsx`

```tsx
'use client'
import type { SimComponent } from '@/lib/game/types'
export const simsCN: Record<string, SimComponent> = {
  'g1-sets': G1Sets,   // key == lesson id, one widget per lesson
}
```

Widget rules:
- `'use client'`, typed props `{ lessonId: string; sandbox?: boolean }` (use `SimProps`).
- Use the sim-kit (below). Persian labels are passed directly — they render as-is.
- Canvas text: Persian works fine with `ctx.fillText`. Numbers on canvas: Latin digits OK.
- Interactive first: sliders/selects/pointer drag + live readouts. Include at least one
  «چالش» (challenge) interaction where it makes sense: random target, user answers,
  canvas banner for win/lose, `<p role="status">` result text,
  on win: `beep(660,120); beep(880,160)`.
- Handle degenerate inputs (0, empty, ∞-risk): never render `NaN`/`Infinity` — clamp and guard.
- Keep widgets self-contained; do not import other agents' files.

sim-kit cheat sheet (`@/components/sims/sim-kit`):
- `CANVAS` palette: `bg, panel, panelLight, fg, muted, grid, amber, orange, emerald, teal, rose, red, violet, yellow, white`
- `useSimCanvas(draw, height=380)` → `{ canvasRef }`; draw = `(ctx, w, h, t, dt) => void`,
  CSS-pixel coords, RAF loop (t seconds, dt ≤ 0.05). Put `<canvas ref={canvasRef} className="w-full rounded-lg border" />` inside.
- `drawGrid(ctx, w, h, step=40)`; `canvasPos(e, canvas)` for pointer coords.
- `useSimBeep()` → `beep(freq=440, ms=90, type='sine', gain=0.04)` (respects sound setting).
- `useReducedMotion()` → boolean; if true, freeze animations (draw static frame).
- `<SimFrame title="…" brief="…">` wrapper card.
- `<SimSlider label value min max step onChange format?>`, `<SimSelect label value options onChange>`,
  `<SimToggle label checked onChange>`, `<SimButton onClick variant?>`,
  `<Readout label value unit? tone?>`, `<Legend color label>`, `useLocal(initial)`.

## Chapter & lesson table (EXACT ids/titles — from the official فهرست)

| ch | lesson id | درس |
|---|---|---|
| 1 | `g1-sets` | مجموعه‌های متناهی و نامتناهی |
| 1 | `g2-complement` | متمم یک مجموعه |
| 1 | `g3-patterns` | الگو و دنباله |
| 1 | `g4-sequences` | دنباله‌های حسابی و هندسی |
| 2 | `t1-trig-ratios` | نسبت‌های مثلثاتی |
| 2 | `t2-unit-circle` | دایرهٔ مثلثاتی |
| 2 | `t3-trig-relations` | روابط بین نسبت‌های مثلثاتی |
| 3 | `p1-root-power` | ریشه و توان |
| 3 | `p2-nth-root` | ریشهٔ nام |
| 3 | `p3-rational-powers` | توان‌های گویا |
| 3 | `p4-algebraic-expressions` | عبارت‌های جبری |
| 4 | `e1-quadratic-equations` | معادلهٔ درجه دوم و روش‌های مختلف حل آن |
| 4 | `e2-parabola` | سهمی |
| 4 | `e3-sign-analysis` | تعیین علامت |
| 5 | `f1-function-concept` | مفهوم تابع و بازنمایی‌های آن |
| 5 | `f2-domain-range` | دامنه و برد توابع |
| 5 | `f3-function-types` | انواع تابع |
| 6 | `c1-counting` | شمارش |
| 6 | `c2-permutations` | جایگشت |
| 6 | `c3-combinations` | ترکیب |
| 7 | `s1-probability` | احتمال یا اندازه‌گیری شانس |
| 7 | `s2-population-sample` | مقدمه‌ای بر علم آمار، جامعه و نمونه |
| 7 | `s3-variables` | متغیر و انواع آن |

## Widget ideas (one per lesson; make it excellent, not minimal)

- `g1-sets` Venn/set lab: build A,B inside U; show membership, |A|, finite/infinite toggle
- `g2-complement` complement shading machine: toggle A, A′, U, ∅; «چالش: shading quiz»
- `g3-patterns` pattern machine: matchstick/dot patterns; find term n; next-term challenge
- `g4-sequences` arithmetic/geometric explorer: a₁, d/r sliders; terms, Sₙ; sum challenge
- `t1-trig-ratios` right-triangle lab: drag angle; sin/cos/tan readouts as ratios
- `t2-unit-circle` unit circle: drag point; sin/cos/tan + quadrant + degree readouts
- `t3-trig-relations` identity visualizer: sin²+cos²=1 bar, co-function pairs, pythagorean check
- `p1-root-power` square/cube visualizer: area & volume models of a², a³, √a, ∛a
- `p2-nth-root` nth-root explorer: n slider; ⁿ√a on number line; root-vs-power challenge
- `p3-rational-powers` a^(m/n) explorer: tie together powers & radicals; simplify challenge
- `p4-algebraic-expressions` area model (a+b)² + like-terms collector mini-game
- `e1-quadratic-equations` quadratic solver: a,b,c → factoring / formula / completing-square steps
- `e2-parabola` parabola lab: y=a(x−h)²+k sliders; vertex, axis, roots; matching challenge
- `e3-sign-analysis` sign chart: parabola + shaded sign strips; inequality challenge
- `f1-function-concept` function machine + arrow/mapping diagram; is-it-a-function quiz
- `f2-domain-range` domain/range plotter for √x, 1/x, x², |x|; read D & R
- `f3-function-types` even/odd symmetry tester + one-to-one horizontal line test
- `c1-counting` tree-diagram counter (meals/outfits); multiply principle challenge
- `c2-permutations` permutation slots lab (nPr); arrange letters; race the formula
- `c3-combinations` combination chooser (nCr) vs nPr comparison; committee challenge
- `s1-probability` probability lab: coin/dice/spinner, run N trials, compare to theory
- `s2-population-sample` population/sampling visualizer: random sample, statistics stability
- `s3-variables` variable-type sorter game (کیفی/کمی گسسته/کمی پیوسته) + mini bar chart

## Quality gates (run yourself)

```bash
cd /home/z/my-project
bunx tsc --noEmit 2>&1 | grep -E "data/math/chN|sims/math/cN"   # must be empty
bun run lint 2>&1 | grep -E "math/chN|math/cN"                  # fix your files' warnings
```

## Worklog (MANDATORY)

Before: `cat /home/z/my-project/worklog.md`
After (append only):
```bash
cat >> /home/z/my-project/worklog.md <<'EOF'
---
Task ID: <your id>
Agent: <agent name>
Task: <chapters>

Work Log:
- ...

Stage Summary:
- files written, lesson count, widgets, notes for integrator
EOF
```
