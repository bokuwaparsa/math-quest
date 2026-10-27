// ─── Math Quest · فصل ۴ «معادله‌ها و نامعادله‌ها» — interactive widgets ─────────
'use client'

import { useEffect, useRef, useState } from 'react'
import type { SimComponent, SimProps } from '@/lib/game/types'
import {
  CANVAS,
  SimFrame, SimSlider, SimSelect, SimButton, Readout, Legend,
  useSimCanvas, useSimBeep, useReducedMotion, canvasPos, drawGrid,
} from '@/components/sims/sim-kit'

// ─── shared helpers ───────────────────────────────────────────────────────────

const FA_FONT = 'Vazirmatn, Tahoma, sans-serif'

function fmt(n: number, d = 2): string {
  if (!Number.isFinite(n)) return '—'
  const p = 10 ** d
  const r = Math.round(n * p) / p
  return Object.is(r, -0) ? '0' : String(r)
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a
}

/** exact fraction string like «5/2» یا «−3» (minus = U+2212) */
function fracStr(num: number, den: number): string {
  if (den === 0) return '—'
  let n = Math.round(num)
  let d = Math.round(den)
  if (d < 0) { n = -n; d = -d }
  const g = gcd(Math.abs(n), d) || 1
  n /= g
  d /= g
  if (d === 1) return n < 0 ? `−${Math.abs(n)}` : `${n}`
  return n < 0 ? `−${Math.abs(n)}/${d}` : `${n}/${d}`
}

/** integer square root if v is a perfect square, else null */
function perfectSquare(v: number): number | null {
  if (v < 0) return null
  const s = Math.round(Math.sqrt(v))
  return s * s === v ? s : null
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}

type View = { ox: number; oy: number; unit: number }
const sxOf = (v: View, x: number) => v.ox + x * v.unit
const syOf = (v: View, y: number) => v.oy - y * v.unit
const xOf = (v: View, px: number) => (px - v.ox) / v.unit
const yOf = (v: View, py: number) => (v.oy - py) / v.unit

function makeView(w: number, h: number, cx: number, cy: number, unit: number): View {
  return { ox: w / 2 - cx * unit, oy: h / 2 + cy * unit, unit }
}

function rrPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** background + world-aligned grid + axes with tick labels */
function drawWorld(ctx: CanvasRenderingContext2D, w: number, h: number, view: View) {
  ctx.fillStyle = CANVAS.bg
  ctx.fillRect(0, 0, w, h)
  const gstep = view.unit >= 22 ? 1 : 2
  const gx0 = Math.floor(xOf(view, 0) / gstep) * gstep
  const gx1 = xOf(view, w)
  const gy0 = Math.floor(yOf(view, h) / gstep) * gstep
  const gy1 = yOf(view, 0)
  ctx.strokeStyle = CANVAS.grid
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = gx0; x <= gx1; x += gstep) {
    const px = sxOf(view, x)
    ctx.moveTo(px, 0)
    ctx.lineTo(px, h)
  }
  for (let y = gy0; y <= gy1; y += gstep) {
    const py = syOf(view, y)
    ctx.moveTo(0, py)
    ctx.lineTo(w, py)
  }
  ctx.stroke()
  const y0 = syOf(view, 0)
  const x0 = sxOf(view, 0)
  ctx.strokeStyle = 'rgba(250,250,249,0.4)'
  ctx.lineWidth = 1.5
  if (y0 > -40 && y0 < h + 40) {
    ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(w, y0); ctx.stroke()
  }
  if (x0 > -40 && x0 < w + 40) {
    ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, h); ctx.stroke()
  }
  ctx.fillStyle = 'rgba(250,250,249,0.5)'
  ctx.font = `10px ${FA_FONT}`
  const every = view.unit >= 26 ? 1 : view.unit >= 13 ? 2 : 5
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const lx0 = Math.ceil(gx0 / every) * every
  for (let x = lx0; x <= gx1; x += every) {
    if (Math.abs(x) < 1e-9) continue
    ctx.fillText(fmt(x), sxOf(view, x), Math.min(Math.max(y0 + 4, 2), h - 16))
  }
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  const ly1 = Math.floor(gy1 / every) * every
  for (let y = ly1; y >= gy0; y -= every) {
    if (Math.abs(y) < 1e-9) continue
    ctx.fillText(fmt(y), Math.min(Math.max(x0 - 6, 26), w - 2), syOf(view, y))
  }
}

function plotCurve(
  ctx: CanvasRenderingContext2D, view: View, w: number, h: number,
  f: (x: number) => number, color: string, width = 2.5, dash: number[] = [],
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  if (dash.length) ctx.setLineDash(dash)
  ctx.beginPath()
  let pen = false
  const n = Math.max(160, Math.round(w))
  for (let i = 0; i <= n; i++) {
    const px = (i / n) * w
    const x = xOf(view, px)
    const y = f(x)
    const py = syOf(view, y)
    if (!Number.isFinite(y) || py < -2e3 || py > h + 2e3) {
      pen = false
      continue
    }
    if (pen) ctx.lineTo(px, py)
    else { ctx.moveTo(px, py); pen = true }
  }
  ctx.stroke()
  ctx.restore()
}

function dot(ctx: CanvasRenderingContext2D, px: number, py: number, r: number, fill: string) {
  ctx.beginPath()
  ctx.arc(px, py, r, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = CANVAS.bg
  ctx.stroke()
}

function bannerText(ctx: CanvasRenderingContext2D, w: number, text: string, ok: boolean) {
  ctx.save()
  ctx.font = `600 15px ${FA_FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const tw = ctx.measureText(text).width
  const bw = tw + 36
  const bh = 38
  rrPath(ctx, (w - bw) / 2, 12, bw, bh, 10)
  ctx.fillStyle = ok ? 'rgba(16,185,129,0.92)' : 'rgba(244,63,94,0.92)'
  ctx.fill()
  ctx.fillStyle = '#fafaf9'
  ctx.fillText(text, w / 2, 31)
  ctx.restore()
}

/** sorted real roots of ax²+bx+c (or of bx+c when a=0) */
function realRoots(a: number, b: number, c: number): number[] {
  if (a !== 0) {
    const delta = b * b - 4 * a * c
    if (delta > 1e-9) {
      const sq = Math.sqrt(delta)
      const r1 = (-b - sq) / (2 * a)
      const r2 = (-b + sq) / (2 * a)
      return r1 < r2 ? [r1, r2] : [r2, r1]
    }
    if (delta >= -1e-9) return [-b / (2 * a)]
    return []
  }
  if (b !== 0) return [-c / b]
  return []
}

/** exact-or-approx root pair strings for Δ ≥ 0, a ≠ 0 */
function rootPair(a: number, b: number, delta: number): { r1: number; r2: number; s1: string; s2: string } {
  const sq = Math.sqrt(delta)
  let r1 = (-b - sq) / (2 * a)
  let r2 = (-b + sq) / (2 * a)
  let s1: string
  let s2: string
  const ps = perfectSquare(delta)
  if (ps !== null) {
    s1 = fracStr(-b - ps, 2 * a)
    s2 = fracStr(-b + ps, 2 * a)
  } else {
    s1 = `≈ ${fmt(r1)}`
    s2 = `≈ ${fmt(r2)}`
  }
  if (r1 > r2) {
    const tr = r1; r1 = r2; r2 = tr
    const ts = s1; s1 = s2; s2 = ts
  }
  return { r1, r2, s1, s2 }
}

/** pretty polynomial string like «2x² − 5x − 3» */
function polyStr(a: number, b: number, c: number): string {
  const t = (k: number, sym: string, first: boolean): string => {
    if (k === 0) return ''
    const abs = Math.abs(k)
    const num = sym && abs === 1 ? '' : String(abs)
    const body = `${num}${sym}`
    if (first) return k < 0 ? `−${body}` : body
    return k < 0 ? ` − ${body}` : ` + ${body}`
  }
  const s = t(a, 'x²', true) + t(b, 'x', a === 0) + t(c, '', a === 0 && b === 0)
  return s || '0'
}

/** « + p/q» یا « − p/q» for term coefficients */
function signedTerm(num: number, den: number): string {
  if (num === 0) return ''
  const s = fracStr(Math.abs(num), den)
  return num < 0 ? ` − ${s}` : ` + ${s}`
}

/** (x − r) با علامت درست بر اساس ریشه */
function binomX(frac: string): string {
  return frac.startsWith('−') ? `(x + ${frac.slice(1)})` : `(x − ${frac})`
}

// ─── widget 1: quadratic solver — three methods + Δ challenge ────────────────

type Method = 'formula' | 'factor' | 'square'

const METHOD_OPTIONS: { value: Method; label: string }[] = [
  { value: 'formula', label: 'فرمول کلی' },
  { value: 'factor', label: 'تجزیه و اتحاد' },
  { value: 'square', label: 'مربع کامل' },
]

function factorSteps(a: number, b: number, c: number, delta: number): string[] {
  if (c === 0 && b !== 0) {
    return [
      `جملهٔ ثابت صفر است؛ عامل مشترک بگیر: ${polyStr(a, b, 0)} = x(${polyStr(a, b, 0)})`,
      `از خاصیت ضرب صفر: x = 0 یا ${polyStr(a, b, 0)} = 0`,
      `پس ریشه‌ها: x = 0 و x = ${fracStr(-b, a)}`,
    ]
  }
  if (b === 0) {
    const q = -c / a
    if (q > 0) {
      const ps = perfectSquare(q)
      return [
        `جملهٔ x صفر است: ${polyStr(a, 0, c)} = 0`,
        `x² = ${fracStr(-c, a)}`,
        ps !== null
          ? `ریشه‌گیری: x = ±${ps}؛ پس ریشه‌ها ${ps} و ${-ps}`
          : `x = ± ${fmt(Math.sqrt(q))} (تقریبی)`,
      ]
    }
    if (q === 0) return ['x² = 0', 'ریشهٔ مضاعف: x = 0']
    return [
      `x² = ${fracStr(-c, a)} که منفی است`,
      'مربع هیچ‌گاه منفی نمی‌شود؛ ریشهٔ حقیقی ندارد.',
    ]
  }
  if (delta < 0) {
    return [
      `Δ = b² − 4ac = ${fmt(delta)} < 0`,
      'زیر ریشه منفی است؛ در اعداد حقیقی تجزیه به عامل‌های خطی ممکن نیست.',
      'معادله هیچ ریشهٔ حقیقی ندارد؛ سهمی محور xها را قطع نمی‌کند.',
    ]
  }
  const ps = perfectSquare(delta)
  if (ps !== null) {
    const { s1, s2 } = rootPair(a, b, delta)
    const coefA = a === 1 ? '' : `${fmt(a)}·`
    return [
      `Δ = (${fmt(b)})² − 4·(${fmt(a)})·(${fmt(c)}) = ${fmt(delta)} = ${ps}² (مربع کامل)`,
      `ریشه‌های گویا: x = ${s1} و x = ${s2}`,
      `تجزیه: ${polyStr(a, b, c)} = ${coefA}${binomX(s1)}${binomX(s2)} = 0`,
      'از خاصیت ضرب صفر، هر عامل می‌تواند صفر باشد.',
    ]
  }
  const { s1, s2 } = rootPair(a, b, delta)
  return [
    `Δ = b² − 4ac = ${fmt(delta)} مربع کامل نیست؛ پس تجزیه با ضرایب گویا ممکن نیست.`,
    `ریشه‌ها گنگ هستند: x = ${s1} و x = ${s2}`,
    'برای جواب دقیق از فرمول کلی استفاده کن: x = (−b ± √Δ) / 2a',
  ]
}

function squareSteps(a: number, b: number, c: number, delta: number): string[] {
  const steps = [
    `هر دو طرف را بر ${fmt(a)} تقسیم کن: x²${signedTerm(b, a)}x${signedTerm(c, a)} = 0`,
    `نصف ضریب x را مربع کن و سمت چپ را اتحاد مربع بنویس: (x${signedTerm(b, 2 * a)})² = ${fracStr(delta, 4 * a * a)}`,
  ]
  if (delta > 1e-9) {
    const { s1, s2 } = rootPair(a, b, delta)
    steps.push('از دو طرف ریشه‌گیری کن (علامت ±):')
    steps.push(`ریشه‌ها: x = ${s1} و x = ${s2}`)
  } else if (delta >= -1e-9) {
    steps.push(`طرف راست صفر است؛ ریشهٔ مضاعف: x = ${fracStr(-b, 2 * a)}`)
  } else {
    steps.push('طرف راست منفی است؛ مربع یک عبارت هرگز منفی نمی‌شود.')
    steps.push('پس معادله هیچ ریشهٔ حقیقی ندارد.')
  }
  return steps
}

function formulaSteps(a: number, b: number, c: number, delta: number): string[] {
  const steps = [
    `شناسایی ضرایب: a = ${fmt(a)}، b = ${fmt(b)}، c = ${fmt(c)}`,
    `مبیّن: Δ = b² − 4ac = (${fmt(b)})² − 4·(${fmt(a)})·(${fmt(c)}) = ${fmt(delta)}`,
  ]
  if (delta > 1e-9) {
    const { s1, s2 } = rootPair(a, b, delta)
    steps.push(`فرمول کلی: x = (${fmt(-b)} ± √${fmt(delta)}) / ${fmt(2 * a)}`)
    steps.push(`ریشه‌ها: x = ${s1} و x = ${s2}`)
    steps.push(`کنترل روابط ویت: جمع ریشه‌ها = −b/a = ${fracStr(-b, a)} و ضرب ریشه‌ها = c/a = ${fracStr(c, a)}`)
  } else if (delta >= -1e-9) {
    steps.push(`فرمول کلی: x = (${fmt(-b)} ± 0) / ${fmt(2 * a)}`)
    steps.push(`ریشهٔ مضاعف: x = ${fracStr(-b, 2 * a)}`)
  } else {
    steps.push('Δ < 0؛ پس √Δ در اعداد حقیقی تعریف نشده است.')
    steps.push('معادله هیچ ریشهٔ حقیقی ندارد (نمودار سهمی محور xها را قطع نمی‌کند).')
  }
  return steps
}

type DeltaChallenge = { a: number; b: number; c: number; options: string[]; correct: string }

function makeDeltaChallenge(): DeltaChallenge {
  let a = 0
  while (a === 0) a = randInt(-3, 3)
  const b = randInt(-8, 8)
  const c = randInt(-8, 8)
  const d = b * b - 4 * a * c
  const correct = String(d)
  const pool = [d + 4, d - 4, -d, d + 9, d - 9, d + 1, d - 1, d + 2, d - 2]
  const wrong: string[] = []
  for (const v of shuffle(pool)) {
    const s = String(v)
    if (s !== correct && !wrong.includes(s)) wrong.push(s)
    if (wrong.length === 3) break
  }
  return { a, b, c, options: shuffle([correct, ...wrong]), correct }
}

function E1QuadraticSolver(_props: SimProps) {
  const [a, setA] = useState(2)
  const [b, setB] = useState(-5)
  const [c, setC] = useState(-3)
  const [method, setMethod] = useState<Method>('formula')
  const [chal, setChal] = useState<DeltaChallenge>(() => makeDeltaChallenge())
  const [picked, setPicked] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const beep = useSimBeep()

  const linear = a === 0
  const delta = linear ? 0 : b * b - 4 * a * c
  const f = (x: number) => a * x * x + b * x + c
  const vx = linear ? 0 : -b / (2 * a)
  const vy = f(vx)

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    let view: View
    if (!linear) {
      let span = Math.max(12, Math.abs(vx) * 2.6 + 4)
      if (delta > 1e-9) {
        const { r1, r2 } = rootPair(a, b, delta)
        span = Math.max(span, (r2 - r1) * 2.4 + 3)
      }
      span = Math.min(span, 44)
      const unit = w / span
      const cy = vy + (a > 0 ? 1 : -1) * (0.26 * h) / unit
      view = makeView(w, h, vx, cy, unit)
    } else {
      const r = b !== 0 ? -c / b : 0
      const span = Math.max(12, Math.abs(r) * 2 + 4, Math.abs(c) * 4)
      const unit = w / span
      view = makeView(w, h, Math.max(-9, Math.min(9, r)), 0, unit)
    }
    drawWorld(ctx, w, h, view)
    if (!linear && delta > 1e-9) {
      const { r1, r2 } = rootPair(a, b, delta)
      const y0 = syOf(view, 0)
      ctx.save()
      ctx.globalAlpha = 0.35
      ctx.fillStyle = a > 0 ? CANVAS.rose : CANVAS.emerald
      ctx.fillRect(sxOf(view, r1), y0 - 5, sxOf(view, r2) - sxOf(view, r1), 10)
      ctx.restore()
    }
    plotCurve(ctx, view, w, h, f, CANVAS.teal, 2.5)
    if (!linear) {
      dot(ctx, sxOf(view, vx), syOf(view, vy), 5, CANVAS.amber)
      ctx.font = `600 11px ${FA_FONT}`
      ctx.fillStyle = CANVAS.amber
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText('رأس', sxOf(view, vx), syOf(view, vy) + (a > 0 ? 10 : -22))
    }
    realRoots(a, b, c).forEach((r) => dot(ctx, sxOf(view, r), syOf(view, 0), 4.5, CANVAS.emerald))
    dot(ctx, sxOf(view, 0), syOf(view, c), 4.5, CANVAS.violet)
    if (picked) {
      bannerText(ctx, w, picked === chal.correct ? `آفرین! Δ = ${picked}` : 'اشتباه شد؛ دوباره حساب کن.', picked === chal.correct)
    }
  }, 340)

  const rootsReadout = linear
    ? (b !== 0 ? fracStr(-c, b) : c === 0 ? 'همهٔ اعداد' : '—')
    : delta >= -1e-9
      ? rootPair(a, b, Math.max(delta, 0)).s1 + (delta > 1e-9 ? ` و ${rootPair(a, b, delta).s2}` : '')
      : 'بدون ریشهٔ حقیقی'

  const steps = linear
    ? b !== 0
      ? [`معادله خطی است: ${polyStr(0, b, c)} = 0`, `پس x = ${fracStr(-c, b)}`]
      : c === 0
        ? ['a = 0 و b = 0 و c = 0: رابطهٔ «0 = 0» همیشه برقرار است؛ هر عدد حقیقی جواب است.']
        : [`${polyStr(0, 0, c)} = 0 برقرار نمی‌شود؛ معادله جواب ندارد.`]
    : method === 'factor'
      ? factorSteps(a, b, c, delta)
      : method === 'square'
        ? squareSteps(a, b, c, delta)
        : formulaSteps(a, b, c, delta)

  const onPickDelta = (opt: string) => {
    if (picked) return
    setPicked(opt)
    if (opt === chal.correct) {
      setStreak((s) => s + 1)
      beep(660, 120)
      window.setTimeout(() => beep(880, 160), 140)
    } else {
      setStreak(0)
    }
  }

  return (
    <SimFrame title="آزمایشگاه معادلهٔ درجه دوم" brief="ضرایب a و b و c را تنظیم کن؛ سه روش حل را مقایسه کن و نمودار سهمی را ببین.">
      <canvas ref={canvasRef} className="w-full rounded-lg border" />
      <div className="flex flex-wrap gap-3">
        <SimSlider label="ضریب a" value={a} min={-4} max={4} step={1} onChange={setA} />
        <SimSlider label="ضریب b" value={b} min={-10} max={10} step={1} onChange={setB} />
        <SimSlider label="ضریب c" value={c} min={-10} max={10} step={1} onChange={setC} />
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <SimSelect label="روش حل" value={method} options={METHOD_OPTIONS} onChange={setMethod} className="min-w-[150px]" />
        <Readout
          label="مبیّن Δ"
          value={linear ? '—' : fmt(delta)}
          unit={linear ? 'خطی' : delta < -1e-9 ? 'بی‌ریشه' : delta <= 1e-9 ? 'مضاعف' : 'دو ریشه'}
        />
        <Readout label="ریشه‌ها" value={rootsReadout} />
        <Readout label="رأس" value={linear ? '—' : `(${fmt(vx)} ، ${fmt(vy)})`} />
        <Readout label="دهانه" value={linear ? '—' : a > 0 ? 'بالا' : 'پایین'} />
      </div>
      <div className="rounded-lg border bg-muted/30 p-3">
        <p className="text-xs font-semibold mb-1.5">
          {linear ? 'حالت خطی (a = 0)' : `گام‌به‌گام: ${METHOD_OPTIONS.find((m) => m.value === method)?.label}`}
        </p>
        <ol className="space-y-1.5">
          {steps.map((s, i) => (
            <li key={i} className="text-xs leading-relaxed flex gap-2">
              <span className="text-muted-foreground font-mono shrink-0">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        {linear && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            یادت باشد: اگر a = 0 شود، دیگر معادلهٔ درجه دوم نداریم.
          </p>
        )}
      </div>
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold">چالش: مبیّن را ذهنی حساب کن</p>
          <div className="flex gap-2 items-center">
            <Readout label="امتیاز پیاپی" value={String(streak)} />
            <SimButton variant="outline" onClick={() => { setChal(makeDeltaChallenge()); setPicked(null) }}>
              معادلهٔ جدید
            </SimButton>
          </div>
        </div>
        <p className="text-xs">
          مبیّن معادلهٔ <span className="font-mono font-semibold">{polyStr(chal.a, chal.b, chal.c)} = 0</span> چند است؟
        </p>
        <div className="flex flex-wrap gap-2">
          {chal.options.map((opt) => (
            <SimButton key={opt} variant="secondary" onClick={() => onPickDelta(opt)}>Δ = {opt}</SimButton>
          ))}
        </div>
        <p role="status" className={`text-xs font-medium ${picked === null ? 'text-muted-foreground' : picked === chal.correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {picked === null
            ? 'اول Δ = b² − 4ac را در ذهن حساب کن، بعد گزینه را انتخاب کن.'
            : picked === chal.correct
              ? 'درست بود! یک امتیاز پیاپی گرفتی.'
              : 'اشتباه شد؛ امتیاز پیاپی صفر شد. معادلهٔ جدید بگیر و دوباره تلاش کن.'}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Legend color={CANVAS.teal} label="نمودار" />
        <Legend color={CANVAS.emerald} label="ریشه‌ها" />
        <Legend color={CANVAS.amber} label="رأس" />
        <Legend color={CANVAS.violet} label="عرض از مبدأ" />
      </div>
    </SimFrame>
  )
}

// ─── widget 2: parabola lab — vertex/axis/roots + matching challenge ──────────

type Target = { a: number; h: number; k: number }

function makeTarget(): Target {
  return {
    a: pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]),
    h: randInt(-8, 8) / 2,
    k: randInt(-8, 8) / 2,
  }
}

function E2ParabolaLab(_props: SimProps) {
  const [a, setA] = useState(1)
  const [h, setH] = useState(1)
  const [k, setK] = useState(-2)
  const [chalOn, setChalOn] = useState(false)
  const [target, setTarget] = useState<Target>(() => makeTarget())
  const [won, setWon] = useState(false)
  const [streak, setStreak] = useState(0)
  const beep = useSimBeep()
  const reduced = useReducedMotion()
  const dragRef = useRef(false)
  const viewRef = useRef<View | null>(null)

  const g = (x: number) => a * (x - h) * (x - h) + k
  const tg = (x: number) => target.a * (x - target.h) * (x - target.h) + target.k
  const yInt = a * h * h + k
  const deltaEq = a === 0 ? 0 : -4 * a * k
  const roots: number[] = a === 0
    ? []
    : k === 0
      ? [h]
      : k / a < 0
        ? [h - Math.sqrt(-k / a), h + Math.sqrt(-k / a)]
        : []

  useEffect(() => {
    if (!chalOn || won) return
    if (Math.abs(a - target.a) < 0.01 && Math.abs(h - target.h) < 0.01 && Math.abs(k - target.k) < 0.01) {
      // defer state updates: React 19 lint forbids synchronous setState inside effects
      const id = window.setTimeout(() => {
        setWon(true)
        setStreak((s) => s + 1)
        beep(660, 120)
        window.setTimeout(() => beep(880, 160), 140)
      }, 0)
      return () => window.clearTimeout(id)
    }
  }, [a, h, k, chalOn, won, target, beep])

  const { canvasRef } = useSimCanvas((ctx, w, hh, t) => {
    const unit = Math.min(w / 18, hh / 13)
    const view = makeView(w, hh, 0, 0, unit)
    viewRef.current = view
    drawWorld(ctx, w, hh, view)
    if (chalOn) plotCurve(ctx, view, w, hh, tg, CANVAS.white, 2, [7, 6])
    plotCurve(ctx, view, w, hh, g, CANVAS.teal, 2.5)
    ctx.save()
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = 'rgba(139,92,246,0.75)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(sxOf(view, h), 0)
    ctx.lineTo(sxOf(view, h), hh)
    ctx.stroke()
    ctx.restore()
    dot(ctx, sxOf(view, 0), syOf(view, yInt), 4.5, CANVAS.violet)
    roots.forEach((r) => dot(ctx, sxOf(view, r), syOf(view, 0), 4.5, CANVAS.emerald))
    const pulse = reduced ? 0 : Math.sin(t * 3) * 1.4
    dot(ctx, sxOf(view, h), syOf(view, k), 6 + pulse, CANVAS.amber)
    if (chalOn && won) bannerText(ctx, w, 'تطبیق کامل! سهمی تو با هدف یکی شد.', true)
    else if (chalOn) {
      ctx.font = `600 12px ${FA_FONT}`
      ctx.fillStyle = 'rgba(250,250,249,0.75)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText('سهمی خط‌چین هدف است؛ سهمی خودت را منطبق کن (رأس را هم می‌توانی بکشی).', w / 2, 8)
    }
  }, 380)

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const view = viewRef.current
    if (!view) return
    const p = canvasPos(e, e.currentTarget)
    if (Math.hypot(p.x - sxOf(view, h), p.y - syOf(view, k)) < 26) {
      dragRef.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return
    const view = viewRef.current
    if (!view) return
    const p = canvasPos(e, e.currentTarget)
    setH(Math.max(-6, Math.min(6, Math.round(xOf(view, p.x) * 2) / 2)))
    setK(Math.max(-6, Math.min(6, Math.round(yOf(view, p.y) * 2) / 2)))
  }
  const onPointerUp = () => { dragRef.current = false }

  return (
    <SimFrame title="آزمایشگاه سهمی" brief="شکل رأسی y = a(x−h)² + k را تنظیم کن؛ رأس را با کشیدن جابه‌جا کن و با Δ تقاطع‌ها را پیش‌بینی کن.">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border touch-none cursor-grab"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
      <div className="flex flex-wrap gap-3">
        <SimSlider label="a (دهانه و بازشدگی)" value={a} min={-3} max={3} step={0.5} onChange={setA} />
        <SimSlider label="h (جابه‌جایی افقی)" value={h} min={-6} max={6} step={0.5} onChange={setH} />
        <SimSlider label="k (جابه‌جایی عمودی)" value={k} min={-6} max={6} step={0.5} onChange={setK} />
      </div>
      <p className="text-xs text-muted-foreground font-mono">
        شکل استاندارد: y = {polyStr(a, -2 * a * h, yInt)}
      </p>
      <div className="flex flex-wrap gap-2 items-end">
        <Readout label="رأس" value={a === 0 ? '—' : `(${fmt(h)} ، ${fmt(k)})`} />
        <Readout label="محور تقارن" value={a === 0 ? '—' : `x = ${fmt(h)}`} />
        <Readout label="دهانه" value={a === 0 ? 'ثابت' : a > 0 ? 'بالا' : 'پایین'} />
        <Readout
          label="مبیّن Δ"
          value={a === 0 ? '—' : fmt(deltaEq)}
          unit={a === 0 ? 'خطی' : deltaEq < -1e-9 ? 'بی‌ریشه' : deltaEq <= 1e-9 ? 'مماس' : 'دو تقاطع'}
        />
        <Readout label="تقاطع با محور xها" value={roots.length ? roots.map((r) => fmt(r)).join(' و ') : '—'} />
      </div>
      {a === 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          با a = 0 تابع ثابت y = k می‌شود؛ سهمی وجود ندارد.
        </p>
      )}
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold">چالش تطبیق سهمی</p>
          <div className="flex gap-2 items-center">
            <Readout label="امتیاز پیاپی" value={String(streak)} />
            <SimButton
              variant="outline"
              onClick={() => { setTarget(makeTarget()); setWon(false); setChalOn(true) }}
            >
              چالش جدید
            </SimButton>
            {chalOn && (
              <SimButton variant="ghost" onClick={() => setChalOn(false)}>پایان</SimButton>
            )}
          </div>
        </div>
        <p role="status" className={`text-xs font-medium ${!chalOn ? 'text-muted-foreground' : won ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
          {!chalOn
            ? 'دکمهٔ «چالش جدید» را بزن؛ یک سهمی هدف (خط‌چین) می‌آید و تو باید با سه لغزنده آن را پیدا کنی.'
            : won
              ? 'درست بود! یک امتیاز پیاپی گرفتی. چالش جدید بگیر.'
              : 'سهمی تو (خط ممتد سبز) را با سهمی هدف (خط‌چین سفید) منطبق کن.'}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Legend color={CANVAS.teal} label="سهمی تو" />
        <Legend color={CANVAS.white} label="سهمی هدف (چالش)" />
        <Legend color={CANVAS.amber} label="رأس" />
        <Legend color={CANVAS.emerald} label="تقاطع با محور xها" />
        <Legend color={CANVAS.violet} label="محور تقارن" />
      </div>
    </SimFrame>
  )
}

// ─── widget 3: sign chart — shaded strips + inequality challenge ──────────────

type Op = '>0' | '>=0' | '<0' | '<=0'

const OP_OPTIONS: { value: Op; label: string }[] = [
  { value: '>0', label: '> 0' },
  { value: '>=0', label: '≥ 0' },
  { value: '<0', label: '< 0' },
  { value: '<=0', label: '≤ 0' },
]

const OP_LABEL: Record<Op, string> = { '>0': '> 0', '>=0': '≥ 0', '<0': '< 0', '<=0': '≤ 0' }

function signAt(a: number, b: number, c: number, x: number): number {
  const v = a * x * x + b * x + c
  return v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0
}

/** مجموعهٔ جواب نامعادلهٔ ax²+bx+c □ 0 به‌صورت متن فارسی */
function solutionText(a: number, b: number, c: number, op: Op): string {
  const gt = op === '>0' || op === '>=0'
  const strict = op === '>0' || op === '<0'
  if (a !== 0) {
    const delta = b * b - 4 * a * c
    if (delta > 1e-9) {
      const sq = Math.sqrt(delta)
      let r1 = (-b - sq) / (2 * a)
      let r2 = (-b + sq) / (2 * a)
      if (r1 > r2) { const t = r1; r1 = r2; r2 = t }
      const s1 = fmt(r1)
      const s2 = fmt(r2)
      const between = strict ? `${s1} < x < ${s2}` : `${s1} ≤ x ≤ ${s2}`
      const outside = strict ? `x < ${s1} یا x > ${s2}` : `x ≤ ${s1} یا x ≥ ${s2}`
      return a > 0 ? (gt ? outside : between) : (gt ? between : outside)
    }
    if (delta >= -1e-9) {
      const r = fmt(-b / (2 * a))
      if (a > 0) {
        if (op === '>0') return `x ≠ ${r}`
        if (op === '>=0') return 'همهٔ اعداد حقیقی'
        if (op === '<0') return 'هیچ عدد حقیقی'
        return `فقط x = ${r}`
      }
      if (op === '>0') return 'هیچ عدد حقیقی'
      if (op === '>=0') return `فقط x = ${r}`
      if (op === '<0') return `x ≠ ${r}`
      return 'همهٔ اعداد حقیقی'
    }
    const pos = a > 0
    if (gt) return pos ? 'همهٔ اعداد حقیقی' : 'هیچ عدد حقیقی'
    return pos ? 'هیچ عدد حقیقی' : 'همهٔ اعداد حقیقی'
  }
  if (b !== 0) {
    const r = fmt(-c / b)
    if (b > 0) {
      if (op === '>0') return `x > ${r}`
      if (op === '>=0') return `x ≥ ${r}`
      if (op === '<0') return `x < ${r}`
      return `x ≤ ${r}`
    }
    if (op === '>0') return `x < ${r}`
    if (op === '>=0') return `x ≤ ${r}`
    if (op === '<0') return `x > ${r}`
    return `x ≥ ${r}`
  }
  const s = Math.sign(c)
  if (gt) return s > 0 ? 'همهٔ اعداد حقیقی' : 'هیچ عدد حقیقی'
  return s >= 0 ? 'همهٔ اعداد حقیقی' : 'هیچ عدد حقیقی'
}

type SignChallenge = { a: number; b: number; c: number; op: Op; options: string[]; correct: string }

function makeSignChallenge(): SignChallenge {
  const a = pick([1, 2, -1, -2])
  let r1 = randInt(-4, 4)
  let r2 = randInt(-4, 4)
  while (r2 === r1) r2 = randInt(-4, 4)
  if (r1 > r2) { const t = r1; r1 = r2; r2 = t }
  const b = -a * (r1 + r2)
  const c = a * r1 * r2
  const op = pick<Op>(['>0', '>=0', '<0', '<=0'])
  const correct = solutionText(a, b, c, op)
  const cand: string[] = []
  const push = (s: string) => {
    if (s !== correct && !cand.includes(s)) cand.push(s)
  }
  push(solutionText(-a, b, c, op))
  const flipOp: Op = op === '>0' ? '>=0' : op === '>=0' ? '>0' : op === '<0' ? '<=0' : '<0'
  push(solutionText(a, b, c, flipOp))
  push(solutionText(a, -a * (r1 + 1 + r2 + 1), a * (r1 + 1) * (r2 + 1), op))
  push(solutionText(a, a * (r1 + r2), c, op))
  for (const s of ['همهٔ اعداد حقیقی', 'هیچ عدد حقیقی', `${fmt(r1 - 1)} < x < ${fmt(r2 + 1)}`]) {
    if (cand.length >= 3) break
    push(s)
  }
  return { a, b, c, op, options: shuffle([correct, cand[0], cand[1], cand[2]]), correct }
}

function E3SignChart(_props: SimProps) {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-5)
  const [c, setC] = useState(6)
  const [op, setOp] = useState<Op>('<0')
  const [chal, setChal] = useState<SignChallenge | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const beep = useSimBeep()

  const f = (x: number) => a * x * x + b * x + c
  const delta = a !== 0 ? b * b - 4 * a * c : 0
  const roots = realRoots(a, b, c)
  const solution = solutionText(a, b, c, op)

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    let view: View
    if (a !== 0) {
      const vx = -b / (2 * a)
      const vy = f(vx)
      let span = Math.max(12, Math.abs(vx) * 2.6 + 4)
      if (roots.length === 2) span = Math.max(span, (roots[1] - roots[0]) * 2.4 + 3)
      span = Math.min(span, 44)
      const unit = w / span
      const cy = vy + (a > 0 ? 1 : -1) * (0.22 * h) / unit
      view = makeView(w, h, vx, cy, unit)
    } else {
      const r = b !== 0 ? -c / b : 0
      const span = Math.max(12, Math.abs(r) * 2 + 4, Math.abs(c) * 4)
      const unit = w / span
      view = makeView(w, h, Math.max(-9, Math.min(9, r)), 0, unit)
    }
    drawWorld(ctx, w, h, view)
    const stripH = 34
    const stripY = h - stripH - 10
    const plotH = stripY - 6
    for (let px = 0; px < w; px += 2) {
      const s = signAt(a, b, c, xOf(view, px))
      if (s === 0) continue
      ctx.fillStyle = s > 0 ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'
      ctx.fillRect(px, stripY, 2.5, stripH)
    }
    ctx.strokeStyle = 'rgba(250,250,249,0.25)'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, stripY + 0.5, w - 1, stripH - 1)
    ctx.font = `600 11px ${FA_FONT}`
    ctx.fillStyle = 'rgba(250,250,249,0.75)'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('نوار علامت', 8, stripY + stripH / 2)
    for (const frac of [0.2, 0.42, 0.64, 0.86]) {
      const px = w * frac
      const s = signAt(a, b, c, xOf(view, px))
      if (s === 0) continue
      ctx.fillStyle = s > 0 ? CANVAS.emerald : CANVAS.rose
      ctx.font = `700 14px ${FA_FONT}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s > 0 ? '+' : '−', px, stripY + stripH / 2 + 6)
    }
    roots.forEach((r) => {
      const px = sxOf(view, r)
      ctx.save()
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = 'rgba(234,179,8,0.8)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(px, 0)
      ctx.lineTo(px, stripY + stripH)
      ctx.stroke()
      ctx.restore()
      dot(ctx, px, syOf(view, 0), 4.5, CANVAS.yellow)
      ctx.font = `600 10px ${FA_FONT}`
      ctx.fillStyle = CANVAS.yellow
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(`x = ${fmt(r)}`, px, stripY + stripH + 2)
    })
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, w, plotH)
    ctx.clip()
    plotCurve(ctx, view, w, plotH, f, CANVAS.teal, 2.5)
    ctx.restore()
    const sol = solution
    ctx.font = `600 12px ${FA_FONT}`
    const tw = ctx.measureText(sol).width
    rrPath(ctx, w - tw - 26, 8, tw + 18, 26, 8)
    ctx.fillStyle = 'rgba(41,37,36,0.85)'
    ctx.fill()
    ctx.fillStyle = CANVAS.fg
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(sol, w - tw / 2 - 17, 21)
    if (picked && chal) {
      bannerText(ctx, w, picked === chal.correct ? 'آفرین! جواب درست بود.' : 'اشتباه شد؛ جدول علامت را دوباره ببین.', picked === chal.correct)
    }
  }, 400)

  const onPick = (opt: string) => {
    if (picked || !chal) return
    setPicked(opt)
    if (opt === chal.correct) {
      setStreak((s) => s + 1)
      beep(660, 120)
      window.setTimeout(() => beep(880, 160), 140)
    } else {
      setStreak(0)
    }
  }

  return (
    <SimFrame title="کارگاه تعیین علامت" brief="ضرایب را عوض کن؛ نوار علامت زیر نمودار نشان می‌دهد عبارت کجا مثبت و کجا منفی است.">
      <canvas ref={canvasRef} className="w-full rounded-lg border" />
      <div className="flex flex-wrap gap-3">
        <SimSlider label="ضریب a" value={a} min={-3} max={3} step={1} onChange={setA} />
        <SimSlider label="ضریب b" value={b} min={-8} max={8} step={1} onChange={setB} />
        <SimSlider label="ضریب c" value={c} min={-8} max={8} step={1} onChange={setC} />
        <SimSelect label="نامعادله" value={op} options={OP_OPTIONS} onChange={setOp} className="min-w-[120px]" />
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <Readout
          label="مبیّن Δ"
          value={a === 0 ? '—' : fmt(delta)}
          unit={a === 0 ? 'خطی' : delta < -1e-9 ? 'بی‌ریشه' : delta <= 1e-9 ? 'مضاعف' : 'دو ریشه'}
        />
        <Readout label="ریشه‌ها" value={roots.length ? roots.map((r) => fmt(r)).join(' و ') : '—'} />
        <Readout label={`جواب ${OP_LABEL[op]}`} value={solution} />
      </div>
      {a === 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          با a = 0 عبارت خطی است: علامت فقط یک بار (در ریشهٔ bx + c = 0) عوض می‌شود.
        </p>
      )}
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold">چالش نامعادله</p>
          <div className="flex gap-2 items-center">
            <Readout label="امتیاز پیاپی" value={String(streak)} />
            <SimButton
              variant="outline"
              onClick={() => { setChal(makeSignChallenge()); setPicked(null) }}
            >
              سؤال جدید
            </SimButton>
          </div>
        </div>
        {chal ? (
          <>
            <p className="text-xs">
              مجموعهٔ جواب نامعادلهٔ <span className="font-mono font-semibold">{polyStr(chal.a, chal.b, chal.c)} {OP_LABEL[chal.op]}</span> کدام است؟
            </p>
            <div className="flex flex-wrap gap-2">
              {chal.options.map((opt) => (
                <SimButton key={opt} variant="secondary" className="h-auto whitespace-normal py-1 text-xs" onClick={() => onPick(opt)}>
                  {opt}
                </SimButton>
              ))}
            </div>
            <p role="status" className={`text-xs font-medium ${picked === null ? 'text-muted-foreground' : picked === chal.correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {picked === null
                ? 'اول ریشه‌ها را پیدا کن، بعد با علامت a تصمیم بگیر.'
                : picked === chal.correct
                  ? 'درست بود! یک امتیاز پیاپی گرفتی.'
                  : 'اشتباه شد؛ امتیاز پیاپی صفر شد. سؤال جدید بگیر.'}
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">دکمهٔ «سؤال جدید» را بزن تا چالش شروع شود.</p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <Legend color={CANVAS.emerald} label="علامت +" />
        <Legend color={CANVAS.rose} label="علامت −" />
        <Legend color={CANVAS.yellow} label="ریشه (علامت صفر)" />
        <Legend color={CANVAS.teal} label="نمودار" />
      </div>
    </SimFrame>
  )
}

export const simsC4: Record<string, SimComponent> = {
  'e1-quadratic-equations': E1QuadraticSolver,
  'e2-parabola': E2ParabolaLab,
  'e3-sign-analysis': E3SignChart,
}
