// ─── Math Quest · فصل ۵ widgets: مفهوم تابع، دامنه و برد، انواع تابع ──────────
// Content agent Task 3-c2 — built entirely on sim-kit. simKey == lesson id.
'use client'

import { useRef, useState } from 'react'
import {
  CANVAS,
  SimFrame,
  SimSlider,
  SimSelect,
  SimButton,
  SimToggle,
  Readout,
  Legend,
  useSimCanvas,
  drawGrid,
  useSimBeep,
  useReducedMotion,
  canvasPos,
} from '@/components/sims/sim-kit'
import { Tex } from '@/components/game/tex'
import type { SimComponent } from '@/lib/game/types'

// ─── shared helpers ───────────────────────────────────────────────────────────
const FONT_FA = '600 12px Vazirmatn, Tahoma, sans-serif'
const FONT_MONO = '700 13px ui-monospace, SFMono-Regular, Menlo, monospace'

/** Format a number for canvas/HTML readouts — never NaN/Infinity. */
function fmtNum(v: number): string {
  if (!Number.isFinite(v)) return '—'
  const a = Math.abs(v)
  if (a >= 10000) return Math.round(v).toLocaleString('en-US')
  const r = Math.round(v * 100) / 100
  if (Number.isInteger(r)) return String(r)
  return r.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rad: number) {
  const r = Math.min(rad, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Win/lose banner drawn on the canvas top. */
function drawBanner(ctx: CanvasRenderingContext2D, w: number, ok: boolean, text: string) {
  const bw = Math.min(320, w - 24)
  const x = (w - bw) / 2
  ctx.save()
  ctx.fillStyle = ok ? 'rgba(16,185,129,0.93)' : 'rgba(244,63,94,0.93)'
  rr(ctx, x, 10, bw, 34, 10)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 14px Vazirmatn, Tahoma, sans-serif'
  ctx.direction = 'rtl'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, 28)
  ctx.restore()
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))

/** Filled triangle arrowhead at (x, y) pointing along `ang`. */
function arrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, ang: number, size = 7) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - size * Math.cos(ang - 0.45), y - size * Math.sin(ang - 0.45))
  ctx.lineTo(x - size * Math.cos(ang + 0.45), y - size * Math.sin(ang + 0.45))
  ctx.closePath()
  ctx.fill()
}

// ─── shared plot utils (world → screen; canvas y is DOWN so sy flips sign) ────
const XMAX = 5.5

interface Tf {
  unit: number
  cx: number
  cy: number
  yView: number
  sx: (x: number) => number
  sy: (y: number) => number
  wx: (px: number) => number
}

function makeTf(w: number, h: number): Tf {
  const unit = w / (2 * XMAX)
  const cx = w / 2
  const cy = h / 2
  return {
    unit,
    cx,
    cy,
    yView: h / (2 * unit),
    sx: (x) => cx + x * unit,
    sy: (y) => cy - y * unit, // negative y scale → world up = screen up
    wx: (px) => (px - cx) / unit,
  }
}

/** Grid aligned to world integers. */
function drawPlotGrid(ctx: CanvasRenderingContext2D, w: number, h: number, tf: Tf) {
  ctx.strokeStyle = CANVAS.grid
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = Math.ceil(-XMAX); i <= Math.floor(XMAX); i++) {
    const px = tf.sx(i)
    if (px < 0 || px > w) continue
    ctx.moveTo(px, 0)
    ctx.lineTo(px, h)
  }
  const ym = Math.floor(tf.yView)
  for (let j = -ym; j <= ym; j++) {
    const py = tf.sy(j)
    if (py < 0 || py > h) continue
    ctx.moveTo(0, py)
    ctx.lineTo(w, py)
  }
  ctx.stroke()
}

function drawAxes(ctx: CanvasRenderingContext2D, w: number, h: number, tf: Tf) {
  ctx.strokeStyle = CANVAS.muted
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(8, tf.cy)
  ctx.lineTo(w - 8, tf.cy)
  ctx.moveTo(tf.cx, h - 8)
  ctx.lineTo(tf.cx, 8)
  ctx.stroke()
  ctx.fillStyle = CANVAS.muted
  arrowHead(ctx, w - 8, tf.cy, 0, 7)
  arrowHead(ctx, tf.cx, 8, -Math.PI / 2, 7)
  ctx.font = '600 10px ui-monospace, monospace'
  ctx.direction = 'ltr'
  ctx.textAlign = 'center'
  for (let i = -5; i <= 5; i++) {
    if (i === 0) continue
    ctx.fillText(String(i), tf.sx(i), tf.cy + 14)
  }
  const ym = Math.floor(tf.yView)
  ctx.textAlign = 'right'
  for (let j = -ym; j <= ym; j++) {
    if (j === 0) continue
    ctx.fillText(String(j), tf.cx - 7, tf.sy(j) + 3)
  }
  ctx.font = FONT_MONO
  ctx.textAlign = 'left'
  ctx.fillText('0', tf.cx + 6, tf.cy + 13)
  ctx.fillStyle = CANVAS.fg
  ctx.fillText('x', w - 16, tf.cy - 12)
  ctx.fillText('y', tf.cx + 10, 16)
}

interface PlotOpts {
  alpha?: number
  dash?: number[]
  until?: number
  lw?: number
}

/**
 * Plot y = f(x) across the visible window.
 * Undefined values (NaN) and |y| beyond the view break the stroke —
 * this is what keeps 1/x split at x = 0 and √x silent for x < 0.
 */
function plotFn(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tf: Tf,
  f: (x: number) => number,
  color: string,
  opts: PlotOpts = {},
) {
  const yMax = tf.yView + 1
  const until = opts.until ?? w
  ctx.save()
  if (opts.alpha !== undefined) ctx.globalAlpha = opts.alpha
  if (opts.dash) ctx.setLineDash(opts.dash)
  ctx.strokeStyle = color
  ctx.lineWidth = opts.lw ?? 2.5
  ctx.lineJoin = 'round'
  ctx.beginPath()
  let pen = false
  for (let px = 0; px <= until; px += 2) {
    const y = f(tf.wx(px))
    if (!Number.isFinite(y) || Math.abs(y) > yMax) {
      pen = false
      continue
    }
    const py = tf.sy(y)
    if (pen) ctx.lineTo(px, py)
    else {
      ctx.moveTo(px, py)
      pen = true
    }
  }
  ctx.stroke()
  ctx.restore()
}

// ─── function registry (shared by f2 / f3) ────────────────────────────────────
type Parity = 'even' | 'odd' | 'neither'

interface FnDef {
  id: string
  tex: string
  plain: string
  name: string
  f: (x: number) => number
  domain: string
  range: string
  domainShort: string
  rangeShort: string
  parity: Parity
  oneToOne: boolean
  parityProof: string
}

const FNS: Record<string, FnDef> = {
  sq: {
    id: 'sq',
    tex: 'f(x) = x^2',
    plain: 'y = x²',
    name: 'تربیعی',
    f: (x) => x * x,
    domain: 'همهٔ اعداد حقیقی (ℝ)',
    range: '[0, ∞)',
    domainShort: 'D = ℝ',
    rangeShort: 'R = [0, ∞)',
    parity: 'even',
    oneToOne: false,
    parityProof: 'f(−x) = (−x)² = x² = f(x) → زوج',
  },
  cube: {
    id: 'cube',
    tex: 'f(x) = x^3',
    plain: 'y = x³',
    name: 'مکعبی',
    f: (x) => x * x * x,
    domain: 'همهٔ اعداد حقیقی (ℝ)',
    range: 'همهٔ اعداد حقیقی (ℝ)',
    domainShort: 'D = ℝ',
    rangeShort: 'R = ℝ',
    parity: 'odd',
    oneToOne: true,
    parityProof: 'f(−x) = (−x)³ = −x³ = −f(x) → فرد',
  },
  sqrt: {
    id: 'sqrt',
    tex: 'f(x) = \\sqrt{x}',
    plain: 'y = √x',
    name: 'رادیکال',
    f: (x) => (x < 0 ? NaN : Math.sqrt(x)),
    domain: '[0, ∞)',
    range: '[0, ∞)',
    domainShort: 'D = [0, ∞)',
    rangeShort: 'R = [0, ∞)',
    parity: 'neither',
    oneToOne: true,
    parityProof: 'دامنه نسبت به صفر متقارن نیست؛ زوج/فرد بررسی نمی‌شود',
  },
  inv: {
    id: 'inv',
    tex: 'f(x) = \\dfrac{1}{x}',
    plain: 'y = 1/x',
    name: 'گویا',
    f: (x) => (x === 0 ? NaN : 1 / x),
    domain: 'ℝ − {0}',
    range: 'ℝ − {0}',
    domainShort: 'D = ℝ − {0}',
    rangeShort: 'R = ℝ − {0}',
    parity: 'odd',
    oneToOne: true,
    parityProof: 'f(−x) = 1/(−x) = −1/x = −f(x) → فرد',
  },
  abs: {
    id: 'abs',
    tex: 'f(x) = |x|',
    plain: 'y = |x|',
    name: 'قدر مطلق',
    f: (x) => Math.abs(x),
    domain: 'همهٔ اعداد حقیقی (ℝ)',
    range: '[0, ∞)',
    domainShort: 'D = ℝ',
    rangeShort: 'R = [0, ∞)',
    parity: 'even',
    oneToOne: false,
    parityProof: 'f(−x) = |−x| = |x| = f(x) → زوج',
  },
  lin: {
    id: 'lin',
    tex: 'f(x) = x + 2',
    plain: 'y = x + 2',
    name: 'خطی (با عرض از مبدأ)',
    f: (x) => x + 2,
    domain: 'همهٔ اعداد حقیقی (ℝ)',
    range: 'همهٔ اعداد حقیقی (ℝ)',
    domainShort: 'D = ℝ',
    rangeShort: 'R = ℝ',
    parity: 'neither',
    oneToOne: true,
    parityProof: 'f(−x) = −x + 2؛ نه برابر f(x) است و نه برابر −f(x) → هیچ‌کدام',
  },
  sq4: {
    id: 'sq4',
    tex: 'f(x) = x^2 - 4',
    plain: 'y = x² − 4',
    name: 'تربیعی جابه‌جا',
    f: (x) => x * x - 4,
    domain: 'همهٔ اعداد حقیقی (ℝ)',
    range: '[−4, ∞)',
    domainShort: 'D = ℝ',
    rangeShort: 'R = [−4, ∞)',
    parity: 'even',
    oneToOne: false,
    parityProof: 'f(−x) = (−x)² − 4 = x² − 4 = f(x) → زوج',
  },
  dbl: {
    id: 'dbl',
    tex: 'f(x) = 2x',
    plain: 'y = 2x',
    name: 'خطی از مبدأ',
    f: (x) => 2 * x,
    domain: 'همهٔ اعداد حقیقی (ℝ)',
    range: 'همهٔ اعداد حقیقی (ℝ)',
    domainShort: 'D = ℝ',
    rangeShort: 'R = ℝ',
    parity: 'odd',
    oneToOne: true,
    parityProof: 'f(−x) = −2x = −f(x) → فرد',
  },
  cub1: {
    id: 'cub1',
    tex: 'f(x) = x^3 + 1',
    plain: 'y = x³ + 1',
    name: 'مکعبی + ۱',
    f: (x) => x * x * x + 1,
    domain: 'همهٔ اعداد حقیقی (ℝ)',
    range: 'همهٔ اعداد حقیقی (ℝ)',
    domainShort: 'D = ℝ',
    rangeShort: 'R = ℝ',
    parity: 'neither',
    oneToOne: true,
    parityProof: 'f(−x) = −x³ + 1؛ نه برابر f(x) است و نه برابر −f(x) → هیچ‌کدام',
  },
  sqrt1: {
    id: 'sqrt1',
    tex: 'f(x) = \\sqrt{x-1}',
    plain: 'y = √(x−1)',
    name: 'رادیکال جابه‌جا',
    f: (x) => (x < 1 ? NaN : Math.sqrt(x - 1)),
    domain: '[1, ∞)',
    range: '[0, ∞)',
    domainShort: 'D = [1, ∞)',
    rangeShort: 'R = [0, ∞)',
    parity: 'neither',
    oneToOne: true,
    parityProof: 'دامنه نسبت به صفر متقارن نیست؛ زوج/فرد بررسی نمی‌شود',
  },
  inv2: {
    id: 'inv2',
    tex: 'f(x) = \\dfrac{1}{x-2}',
    plain: 'y = 1/(x−2)',
    name: 'گویای جابه‌جا',
    f: (x) => (x === 2 ? NaN : 1 / (x - 2)),
    domain: 'ℝ − {2}',
    range: 'ℝ − {0}',
    domainShort: 'D = ℝ − {2}',
    rangeShort: 'R = ℝ − {0}',
    parity: 'neither',
    oneToOne: true,
    parityProof: 'دامنه نسبت به صفر متقارن نیست؛ زوج/فرد بررسی نمی‌شود',
  },
}

const PARITY_LABEL: Record<Parity, string> = {
  even: 'زوج است',
  odd: 'فرد است',
  neither: 'نه زوج و نه فرد',
}

// ─────────────────────────────────────────────────────────────────────────────
// f1-function-concept · ماشین تابع + نمودار پیکانی + چالش «این تناظر تابع است؟»
// ─────────────────────────────────────────────────────────────────────────────
type F1Mode = 'machine' | 'map' | 'chal'

interface F1Rule {
  id: string
  label: string
  tex: string
  f: (x: number) => number
}

const F1_RULES: F1Rule[] = [
  { id: 'r1', label: 'f(x) = 2x + 1', tex: 'f(x) = 2x + 1', f: (x) => 2 * x + 1 },
  { id: 'r2', label: 'f(x) = x²', tex: 'f(x) = x^2', f: (x) => x * x },
  { id: 'r3', label: 'f(x) = 3x − 2', tex: 'f(x) = 3x - 2', f: (x) => 3 * x - 2 },
  { id: 'r4', label: 'f(x) = |x| + 1', tex: 'f(x) = |x| + 1', f: (x) => Math.abs(x) + 1 },
]

interface F1Arrow {
  ai: number
  bi: number
}

interface F1Map {
  id: string
  name: string
  note: string
  A: number[]
  B: number[]
  arrows: F1Arrow[]
}

const F1_MAPS: F1Map[] = [
  {
    id: 'm1',
    name: 'تناظر اول — قاعدهٔ «دو برابر»',
    note: 'تابع است ✓ — از هر عضو دامنه یک پیکان خارج می‌شود؛ عضو ۸ از برد بدون پیشینه است که اشکالی ندارد.',
    A: [1, 2, 3],
    B: [2, 4, 6, 8],
    arrows: [
      { ai: 0, bi: 0 },
      { ai: 1, bi: 1 },
      { ai: 2, bi: 2 },
    ],
  },
  {
    id: 'm2',
    name: 'تناظر دوم — چهار جفت',
    note: 'تابع نیست ✗ — عضو ۱ دو تصویر (۲ و ۶) دارد؛ «یک به دو» ممنوع است.',
    A: [1, 2, 3],
    B: [2, 4, 6, 8],
    arrows: [
      { ai: 0, bi: 0 },
      { ai: 0, bi: 2 },
      { ai: 1, bi: 1 },
      { ai: 2, bi: 0 },
    ],
  },
  {
    id: 'm3',
    name: 'تناظر سوم — دو جفت',
    note: 'تابع نیست ✗ — عضو ۳ هیچ تصویری ندارد؛ هر عضو دامنه باید دقیقاً یک تصویر داشته باشد.',
    A: [1, 2, 3],
    B: [4, 5, 6],
    arrows: [
      { ai: 0, bi: 0 },
      { ai: 1, bi: 1 },
    ],
  },
  {
    id: 'm4',
    name: 'تناظر چهارم — سه جفت',
    note: 'تابع است ✓ — دو به یک (۲ و ۳ → ۴) مجاز است؛ تصویر تکراری نقض تعریف تابع نیست.',
    A: [1, 2, 3],
    B: [1, 4],
    arrows: [
      { ai: 0, bi: 0 },
      { ai: 1, bi: 1 },
      { ai: 2, bi: 1 },
    ],
  },
]

interface F1Shape {
  A: number[]
  B: number[]
  arrows: F1Arrow[]
}

function f1Analyze(m: F1Shape) {
  const outC = m.A.map((_, ai) => m.arrows.filter((a) => a.ai === ai).length)
  const inC = m.B.map((_, bi) => m.arrows.filter((a) => a.bi === bi).length)
  const isFn = outC.every((c) => c === 1)
  const badTwo = m.A.filter((_, ai) => outC[ai] > 1)
  const badNone = m.A.filter((_, ai) => outC[ai] === 0)
  const twoToOne = inC.some((c) => c >= 2)
  return { outC, inC, isFn, badTwo, badNone, twoToOne }
}

/** Arrow (mapping) diagram: domain A on the RIGHT, codomain B on the LEFT (RTL flow). */
function f1Diagram(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  A: number[],
  B: number[],
  arrows: F1Arrow[],
  opts: { explain: boolean; question?: string },
) {
  ctx.textBaseline = 'middle'
  const cy = h * 0.5
  const rx = Math.min(w * 0.15, 120)
  const ry = h * 0.32
  const cxR = w - rx - 52
  const cxL = rx + 52

  const ell = (cx: number, color: string) => {
    ctx.globalAlpha = 0.07
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ell(cxR, CANVAS.amber)
  ell(cxL, CANVAS.violet)

  ctx.font = FONT_FA
  ctx.direction = 'rtl'
  ctx.textAlign = 'center'
  ctx.fillStyle = CANVAS.amber
  ctx.fillText('دامنه A', cxR, cy - ry - 18)
  ctx.fillStyle = CANVAS.violet
  ctx.fillText('برد B', cxL, cy - ry - 18)
  if (opts.question) {
    ctx.font = '700 13px Vazirmatn, Tahoma, sans-serif'
    ctx.fillStyle = CANVAS.fg
    ctx.fillText(opts.question, w / 2, 22)
  }

  const colY = (n: number, i: number) => (n === 1 ? cy : cy - ry * 0.72 + (i * ry * 1.44) / (n - 1))
  const aPts = A.map((v, i) => ({ v, x: cxR - rx * 0.1, y: colY(A.length, i) }))
  const bPts = B.map((v, i) => ({ v, x: cxL + rx * 0.1, y: colY(B.length, i) }))

  const an = f1Analyze({ A, B, arrows })

  // arrows first (under the dots); offending arrows turn rose when explaining
  for (const a of arrows) {
    const p = aPts[a.ai]
    const q = bPts[a.bi]
    const bad = opts.explain && an.outC[a.ai] > 1
    ctx.strokeStyle = bad ? CANVAS.rose : CANVAS.teal
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(p.x - 16, p.y)
    ctx.lineTo(q.x + 17, q.y)
    ctx.stroke()
    ctx.fillStyle = bad ? CANVAS.rose : CANVAS.teal
    arrowHead(ctx, q.x + 17, q.y, Math.atan2(q.y - p.y, q.x - p.x), 7)
  }

  const dot = (p: { v: number; x: number; y: number }, ring: string, txt: string, rw: number) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 13, 0, Math.PI * 2)
    ctx.fillStyle = CANVAS.panelLight
    ctx.fill()
    ctx.strokeStyle = ring
    ctx.lineWidth = rw
    ctx.stroke()
    ctx.font = FONT_MONO
    ctx.fillStyle = txt
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.fillText(String(p.v), p.x, p.y + 1)
  }
  aPts.forEach((p, ai) => {
    const bad = opts.explain && an.outC[ai] !== 1
    dot(p, bad ? CANVAS.rose : 'rgba(250,250,249,0.28)', bad ? CANVAS.rose : CANVAS.fg, bad ? 3 : 1.4)
  })
  bPts.forEach((p, bi) => {
    const hot = opts.explain && an.inC[bi] >= 2
    dot(p, hot ? CANVAS.emerald : 'rgba(250,250,249,0.28)', CANVAS.fg, hot ? 2.5 : 1.4)
    if (an.inC[bi] === 0) {
      ctx.font = '600 10px Vazirmatn, Tahoma, sans-serif'
      ctx.fillStyle = CANVAS.muted
      ctx.direction = 'rtl'
      ctx.textAlign = 'center'
      ctx.fillText('بدون پیشینه (مجاز)', p.x, p.y + 24)
    }
  })

  if (!opts.explain) return
  ctx.font = FONT_FA
  ctx.direction = 'rtl'
  ctx.textAlign = 'center'
  const join = (arr: number[]) => arr.join(' و ')
  if (an.badTwo.length > 0) {
    ctx.fillStyle = CANVAS.rose
    ctx.fillText(`عضو ${join(an.badTwo)} دو تصویر دارد → تابع نیست ✗`, w / 2, h - 20)
  } else if (an.badNone.length > 0) {
    ctx.fillStyle = CANVAS.rose
    ctx.fillText(`عضو ${join(an.badNone)} بدون تصویر مانده → تابع نیست ✗`, w / 2, h - 20)
  } else {
    ctx.fillStyle = CANVAS.emerald
    ctx.fillText(
      an.twoToOne
        ? 'هر عضو دقیقاً یک تصویر دارد → تابع است ✓ (دو به یک مجاز است)'
        : 'هر عضو دقیقاً یک تصویر دارد → تابع است ✓',
      w / 2,
      h - 20,
    )
  }
}

interface F1Chal {
  A: number[]
  B: number[]
  arrows: F1Arrow[]
  status: 'idle' | 'won' | 'lost'
}

/** Random mapping: half are functions (sometimes two-to-one on purpose), half violate the rule. */
function f1NewChallenge(): F1Chal {
  const A = shuffle([1, 2, 3, 4, 5]).slice(0, 3).sort((a, b) => a - b)
  const B = shuffle([2, 3, 4, 5, 6, 7, 8]).slice(0, 4).sort((a, b) => a - b)
  const arrows: F1Arrow[] = []
  for (let ai = 0; ai < A.length; ai++) arrows.push({ ai, bi: randInt(0, B.length - 1) })
  const bad = Math.random() < 0.5
  if (bad) {
    if (Math.random() < 0.5) {
      // یک ورودی با دو تصویر
      const ai = randInt(0, A.length - 1)
      let bi = randInt(0, B.length - 1)
      while (bi === arrows[ai].bi) bi = randInt(0, B.length - 1)
      arrows.push({ ai, bi })
    } else {
      // یک عضو بدون تصویر
      arrows.splice(randInt(0, arrows.length - 1), 1)
    }
  } else if (Math.random() < 0.5) {
    // دو به یک عمدی — هنوز تابع است (تلهٔ «دو به یک مجاز»)
    arrows[1].bi = arrows[0].bi
  }
  return { A, B, arrows, status: 'idle' }
}

function F1FunctionConcept() {
  const beep = useSimBeep()
  const reduced = useReducedMotion()
  const [mode, setMode] = useState<F1Mode>('machine')
  const [ruleId, setRuleId] = useState('r1')
  const [x, setX] = useState(2)
  const [mapId, setMapId] = useState('m1')
  const [chal, setChal] = useState<F1Chal | null>(null)
  const [score, setScore] = useState({ ok: 0, total: 0 })

  const rule = F1_RULES.find((r) => r.id === ruleId) ?? F1_RULES[0]
  const fx = rule.f(x)
  const map = F1_MAPS.find((m) => m.id === mapId) ?? F1_MAPS[0]
  const an = f1Analyze(map)

  const answer = (saysFn: boolean) => {
    if (!chal || chal.status === 'won') return
    const isFn = f1Analyze(chal).isFn
    const ok = saysFn === isFn
    setChal({ ...chal, status: ok ? 'won' : 'lost' })
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }))
    if (ok) {
      beep(660, 120)
      window.setTimeout(() => beep(880, 160), 150)
    } else {
      beep(220, 180, 'square', 0.03)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h, t) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)
    ctx.textBaseline = 'middle'

    if (mode === 'machine') {
      const ym = h * 0.48
      const inX = w - 66
      const outX = 66
      const bw = Math.min(240, w * 0.36)
      const bh = 104
      const bx = w / 2 - bw / 2
      const by = ym - bh / 2

      // pipes
      ctx.strokeStyle = CANVAS.muted
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(inX, ym)
      ctx.lineTo(bx + bw, ym)
      ctx.moveTo(bx, ym)
      ctx.lineTo(outX, ym)
      ctx.stroke()
      ctx.fillStyle = CANVAS.muted
      arrowHead(ctx, bx + bw - 2, ym, Math.PI, 7)
      arrowHead(ctx, outX + 14, ym, Math.PI, 7)

      // machine box
      ctx.fillStyle = CANVAS.panelLight
      ctx.strokeStyle = CANVAS.amber
      ctx.lineWidth = 2.5
      rr(ctx, bx, by, bw, bh, 14)
      ctx.fill()
      ctx.stroke()
      ctx.font = FONT_FA
      ctx.fillStyle = CANVAS.muted
      ctx.direction = 'rtl'
      ctx.textAlign = 'center'
      ctx.fillText('قاعدهٔ تابع', w / 2, by + 26)
      ctx.font = '700 16px ui-monospace, monospace'
      ctx.direction = 'ltr'
      ctx.fillStyle = CANVAS.amber
      ctx.fillText(rule.label, w / 2, by + 56)
      ctx.font = FONT_MONO
      ctx.fillStyle = CANVAS.fg
      ctx.fillText(`f(${fmtNum(x)}) = ${fmtNum(fx)}`, w / 2, by + 84)

      // input / output nodes
      const node = (cx0: number, fill: string, val: string, under: string) => {
        ctx.beginPath()
        ctx.arc(cx0, ym, 26, 0, Math.PI * 2)
        ctx.fillStyle = fill
        ctx.fill()
        ctx.strokeStyle = 'rgba(28,25,23,0.5)'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.font = FONT_MONO
        ctx.fillStyle = '#1c1917'
        ctx.direction = 'ltr'
        ctx.textAlign = 'center'
        ctx.fillText(val, cx0, ym + 1)
        ctx.font = FONT_FA
        ctx.fillStyle = CANVAS.muted
        ctx.direction = 'ltr'
        ctx.fillText(under, cx0, ym + 48)
      }
      node(inX, CANVAS.teal, fmtNum(x), `x = ${fmtNum(x)}`)
      node(outX, CANVAS.emerald, fmtNum(fx), `f(x) = ${fmtNum(fx)}`)

      // travelling token (frozen in the middle when reduced motion is on)
      const prog = reduced ? 0.5 : (t * 0.4) % 1
      const tokX = inX + (outX - inX) * prog
      ctx.beginPath()
      ctx.arc(tokX, ym, 10, 0, Math.PI * 2)
      ctx.fillStyle = CANVAS.amber
      ctx.fill()
      ctx.strokeStyle = 'rgba(28,25,23,0.55)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.font = FONT_FA
      ctx.fillStyle = CANVAS.muted
      ctx.direction = 'rtl'
      ctx.fillText('هر ورودی دقیقاً یک خروجی می‌گیرد — مسیر توکن را دنبال کن.', w / 2, h - 22)
      return
    }

    if (mode === 'map') {
      f1Diagram(ctx, w, h, map.A, map.B, map.arrows, { explain: true, question: map.name })
      return
    }

    // challenge
    if (!chal) {
      ctx.font = FONT_FA
      ctx.fillStyle = CANVAS.muted
      ctx.direction = 'rtl'
      ctx.textAlign = 'center'
      ctx.fillText('برای شروع، «تناظر تازه» را بزن.', w / 2, h / 2)
      return
    }
    f1Diagram(ctx, w, h, chal.A, chal.B, chal.arrows, {
      explain: chal.status !== 'idle',
      question: chal.status === 'idle' ? 'این تناظر تابع است؟' : undefined,
    })
    if (chal.status === 'won') drawBanner(ctx, w, true, '✓ آفرین! پاسخ درست بود')
    else if (chal.status === 'lost') drawBanner(ctx, w, false, '✗ اشتباه شد؛ دوباره تلاش کن')
  }, 380)

  return (
    <SimFrame title="ماشین تابع و تناظر پیکانی" brief="ماشین تابع را بچرخان، تناظرهای پیکانی را بررسی کن و در چالش، تابع بودن را حدس بزن.">
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="ماشین تابع و نمودار پیکانی تعاملی" />
      <div className="flex flex-wrap items-center gap-3">
        <SimSelect<F1Mode>
          label="بخش"
          value={mode}
          onChange={(m) => {
            setMode(m)
            if (m === 'chal' && !chal) setChal(f1NewChallenge())
          }}
          options={[
            { value: 'machine', label: 'ماشین تابع' },
            { value: 'map', label: 'نمودار پیکانی' },
            { value: 'chal', label: 'چالش: تابع است؟' },
          ]}
        />
        {mode === 'machine' && (
          <>
            <SimSelect
              label="قاعده"
              value={ruleId}
              onChange={setRuleId}
              options={F1_RULES.map((r) => ({ value: r.id, label: r.label }))}
            />
            <SimSlider label="ورودی x" value={x} min={-5} max={5} step={0.5} onChange={setX} format={fmtNum} />
            <Readout label="خروجی f(x)" value={fmtNum(fx)} tone="text-emerald-300" />
          </>
        )}
        {mode === 'map' && (
          <>
            <SimSelect
              label="تناظر"
              value={mapId}
              onChange={setMapId}
              options={F1_MAPS.map((m) => ({ value: m.id, label: m.name }))}
            />
            <Readout
              label="نتیجه"
              value={an.isFn ? 'تابع است ✓' : 'تابع نیست ✗'}
              tone={an.isFn ? 'text-emerald-300' : 'text-rose-300'}
            />
          </>
        )}
        {mode === 'chal' && (
          <>
            <SimButton
              variant="secondary"
              onClick={() => {
                setChal(f1NewChallenge())
                beep(520, 60, 'triangle', 0.03)
              }}
            >
              تناظر تازه
            </SimButton>
            <SimButton variant="outline" disabled={!chal || chal.status === 'won'} onClick={() => answer(true)}>
              بله، تابع است
            </SimButton>
            <SimButton variant="outline" disabled={!chal || chal.status === 'won'} onClick={() => answer(false)}>
              نه، تابع نیست
            </SimButton>
            <Readout label="امتیاز" value={`${score.ok} / ${score.total}`} tone="text-emerald-300" />
          </>
        )}
      </div>
      {mode === 'machine' && (
        <>
          <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">قاعده</span>
            <Tex tex={rule.tex} />
          </div>
          <p className="text-xs text-muted-foreground">
            قاعدهٔ طلایی تابع: به هر ورودی دقیقاً یک خروجی می‌رسد — هیچ ورودی‌ای بدون خروجی نمی‌ماند و هیچ ورودی‌ای دو خروجی ندارد.
          </p>
        </>
      )}
      {mode === 'map' && (
        <p role="status" className="text-xs font-medium">
          {map.note}
        </p>
      )}
      {mode === 'chal' && (
        <p role="status" className="text-xs font-medium">
          {!chal
            ? 'برای شروع، «تناظر تازه» را بزن.'
            : chal.status === 'idle'
              ? 'به پیکان‌ها نگاه کن: از هر عضو دامنه دقیقاً یک پیکان خارج می‌شود؟'
              : chal.status === 'won'
                ? `آفرین! پاسخ درست بود — این تناظر ${f1Analyze(chal).isFn ? 'تابع است' : 'تابع نیست'}.`
                : 'اشتباه شد؛ هایلایت قرمز (عضو با دو تصویر یا بدون تصویر) را ببین و دوباره تصمیم بگیر.'}
        </p>
      )}
    </SimFrame>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// f2-domain-range · پلاتر دامنه/برد + نشانگر x + چالش «دامنه را انتخاب کن»
// ─────────────────────────────────────────────────────────────────────────────
type F2Mode = 'explore' | 'chal'

const F2_SELECT = ['sq', 'sqrt', 'inv', 'abs']
const F2_POOL = ['sq', 'sqrt', 'inv', 'abs', 'sqrt1', 'inv2']

const F2_DOMAINS: Record<string, { correct: string; wrong: string[] }> = {
  sq: { correct: 'همهٔ اعداد حقیقی', wrong: ['x ≥ 0', 'x ≠ 0', 'x > 0'] },
  sqrt: { correct: 'x ≥ 0', wrong: ['همهٔ اعداد حقیقی', 'x > 0', 'x ≤ 0'] },
  inv: { correct: 'x ≠ 0', wrong: ['همهٔ اعداد حقیقی', 'x > 0', 'x ≥ 0'] },
  abs: { correct: 'همهٔ اعداد حقیقی', wrong: ['x ≥ 0', 'x ≠ 0', 'x > 0'] },
  sqrt1: { correct: 'x ≥ 1', wrong: ['x > 1', 'همهٔ اعداد حقیقی', 'x ≥ −1'] },
  inv2: { correct: 'x ≠ 2', wrong: ['x > 2', 'x ≠ −2', 'همهٔ اعداد حقیقی'] },
}

interface F2Chal {
  fnId: string
  choices: string[]
  answer: string
  status: 'idle' | 'won' | 'lost'
}

function f2NewChallenge(): F2Chal {
  const fnId = F2_POOL[randInt(0, F2_POOL.length - 1)]
  const d = F2_DOMAINS[fnId]
  return { fnId, choices: shuffle([d.correct, ...d.wrong]), answer: d.correct, status: 'idle' }
}

function F2DomainRange() {
  const beep = useSimBeep()
  const [mode, setMode] = useState<F2Mode>('explore')
  const [fnId, setFnId] = useState('sq')
  const [probeX, setProbeX] = useState(1.5)
  const [chal, setChal] = useState<F2Chal | null>(null)
  const [score, setScore] = useState({ ok: 0, total: 0 })

  const fn = FNS[fnId]
  const fv = fn.f(probeX)
  const fvOk = Number.isFinite(fv)

  const answerF2 = (choice: string) => {
    if (!chal || chal.status === 'won') return
    const ok = choice === chal.answer
    setChal({ ...chal, status: ok ? 'won' : 'lost' })
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }))
    if (ok) {
      beep(660, 120)
      window.setTimeout(() => beep(880, 160), 150)
    } else {
      beep(220, 180, 'square', 0.03)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    const tf = makeTf(w, h)
    drawPlotGrid(ctx, w, h, tf)
    drawAxes(ctx, w, h, tf)
    ctx.textBaseline = 'middle'

    const inChal = mode === 'chal' && chal !== null
    const cur = inChal ? FNS[chal.fnId] : fn

    plotFn(ctx, w, h, tf, cur.f, inChal ? CANVAS.violet : CANVAS.amber)

    // x-probe (explore only): dashed line + value dot, «تعریف نشده» outside the domain
    if (!inChal) {
      const px = tf.sx(probeX)
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = CANVAS.yellow
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(px, 8)
      ctx.lineTo(px, h - 8)
      ctx.stroke()
      ctx.setLineDash([])
      const y = fn.f(probeX)
      ctx.font = FONT_MONO
      ctx.textAlign = 'center'
      if (Number.isFinite(y)) {
        const py = tf.sy(y)
        if (py > 12 && py < h - 12) {
          ctx.beginPath()
          ctx.arc(px, py, 6, 0, Math.PI * 2)
          ctx.fillStyle = CANVAS.yellow
          ctx.fill()
          ctx.strokeStyle = 'rgba(28,25,23,0.6)'
          ctx.lineWidth = 1.5
          ctx.stroke()
        } else {
          const top = py <= 12
          const ey = top ? 14 : h - 14
          ctx.beginPath()
          ctx.moveTo(px, ey + (top ? 6 : -6))
          ctx.lineTo(px - 5, ey)
          ctx.lineTo(px + 5, ey)
          ctx.closePath()
          ctx.fillStyle = CANVAS.yellow
          ctx.fill()
        }
        ctx.direction = 'ltr'
        ctx.fillStyle = CANVAS.yellow
        ctx.fillText(`f(${fmtNum(probeX)}) = ${fmtNum(y)}`, clamp(px, 54, w - 60), 40)
      } else {
        ctx.direction = 'rtl'
        ctx.fillStyle = CANVAS.rose
        ctx.fillText('تعریف نشده', clamp(px, 50, w - 50), 40)
      }
    }

    // labels
    ctx.font = FONT_MONO
    ctx.direction = 'ltr'
    ctx.textAlign = 'left'
    ctx.fillStyle = inChal ? CANVAS.violet : CANVAS.amber
    ctx.fillText(cur.plain, 16, 20)
    ctx.font = FONT_FA
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.muted
    ctx.fillText(inChal ? 'دامنهٔ این تابع کدام است؟' : 'دامنه و برد را از نمودار بخوان', w - 16, 20)

    if (!inChal) {
      ctx.font = FONT_MONO
      ctx.direction = 'ltr'
      ctx.textAlign = 'left'
      ctx.fillStyle = CANVAS.fg
      ctx.fillText(`${fn.domainShort}  ,  ${fn.rangeShort}`, 16, h - 20)
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'right'
      ctx.fillStyle = CANVAS.muted
      ctx.fillText('دامنه D ، برد R', w - 16, h - 20)
    } else if (chal) {
      if (chal.status === 'won') drawBanner(ctx, w, true, '✓ آفرین! پاسخ درست بود')
      else if (chal.status === 'lost') drawBanner(ctx, w, false, '✗ اشتباه شد؛ دوباره تلاش کن')
    }
  }, 380)

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode === 'chal') return
    const c = canvasRef.current
    if (!c) return
    const { x: cx0 } = canvasPos(e, c)
    const tf = makeTf(c.clientWidth || 640, c.clientHeight || 380)
    const snapped = Math.round(tf.wx(cx0) * 4) / 4
    setProbeX(clamp(snapped, -5.5, 5.5))
    beep(480, 40, 'triangle', 0.03)
  }

  return (
    <SimFrame title="پلاتر دامنه و برد" brief="تابع را انتخاب کن، روی نمودار کلیک کن و D و R را زنده بخوان؛ بعد چالش دامنه را امتحان کن.">
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        className="w-full cursor-crosshair rounded-lg border"
        aria-label="نمودار تعاملی تابع با نشانگر دامنه"
      />
      {mode === 'explore' ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <SimSelect
              label="تابع"
              value={fnId}
              onChange={setFnId}
              options={F2_SELECT.map((id) => ({ value: id, label: FNS[id].name }))}
            />
            <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">قاعده</span>
              <Tex tex={fn.tex} />
            </div>
            <SimButton
              variant="secondary"
              onClick={() => {
                setChal(f2NewChallenge())
                setMode('chal')
                beep(520, 60, 'triangle', 0.03)
              }}
            >
              شروع چالش
            </SimButton>
          </div>
          <SimSlider
            label="نشانگر x"
            value={probeX}
            min={-5.5}
            max={5.5}
            step={0.25}
            onChange={setProbeX}
            format={fmtNum}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Readout label="ورودی x" value={fmtNum(probeX)} />
            <Readout
              label="تصویر f(x)"
              value={fvOk ? fmtNum(fv) : 'تعریف نشده'}
              tone={fvOk ? 'text-yellow-300' : 'text-rose-300'}
            />
            <Readout label="دامنه D" value={fn.domain} tone="text-emerald-300" />
            <Readout label="برد R" value={fn.range} tone="text-violet-300" />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Legend color={CANVAS.amber} label="نمودار تابع" />
            <Legend color={CANVAS.yellow} label="نشانگر x (کلیک روی نمودار)" />
          </div>
          <p className="text-xs text-muted-foreground">
            پیمایش افقی نمودار روی محور xها دامنه و پیمایش عمودی روی محور yها برد را نشان می‌دهد. جایی که نمودار شکاف
            دارد (مثل <Tex tex="\dfrac{1}{x}" /> در <Tex tex="x = 0" />) یا شروع می‌شود (مثل <Tex tex="\sqrt{x}" /> در{' '}
            <Tex tex="x = 0" />)، مرز دامنه است.
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <SimButton
              variant="secondary"
              onClick={() => {
                setChal(f2NewChallenge())
                beep(520, 60, 'triangle', 0.03)
              }}
            >
              چالش تازه
            </SimButton>
            <SimButton
              variant="ghost"
              onClick={() => {
                setMode('explore')
                setChal(null)
              }}
            >
              بازگشت به آزمایشگاه
            </SimButton>
            <Readout label="امتیاز" value={`${score.ok} / ${score.total}`} tone="text-emerald-300" />
          </div>
          {chal && (
            <>
              <div className="flex flex-wrap items-center gap-2 rounded-lg border p-3">
                <span className="text-xs text-muted-foreground">دامنهٔ این تابع کدام است؟</span>
                <Tex tex={FNS[chal.fnId].tex} />
              </div>
              <div className="flex flex-wrap gap-2">
                {chal.choices.map((c) => (
                  <SimButton key={c} variant="outline" disabled={chal.status === 'won'} onClick={() => answerF2(c)}>
                    {c}
                  </SimButton>
                ))}
              </div>
            </>
          )}
          <p role="status" className="text-xs font-medium">
            {!chal
              ? 'برای شروع، «چالش تازه» را بزن.'
              : chal.status === 'idle'
                ? 'به نمودار نگاه کن: نمودار از کدام xها شروع می‌شود یا کجا شکاف دارد؟'
                : chal.status === 'won'
                  ? `آفرین! دامنهٔ درست «${chal.answer}» بود.`
                  : 'اشتباه شد؛ به شروع یا شکاف نمودار دقت کن و دوباره انتخاب کن.'}
          </p>
        </>
      )}
    </SimFrame>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// f3-function-types · آینهٔ زوج/فرد + آزمون خط افقی + چالش دسته‌بندی ۳ تابع
// ─────────────────────────────────────────────────────────────────────────────
type F3Mode = 'explore' | 'chal'

const F3_SELECT = ['sq', 'cube', 'inv', 'abs', 'lin', 'sq4', 'dbl']
const F3_CHAL_POOL = ['sq', 'cube', 'inv', 'abs', 'lin', 'sq4', 'dbl', 'cub1']

/** Exact roots of f(x) = k inside the visible window (per function, analytic — no numeric misses). */
function hRoots(id: string, k: number): number[] {
  const e = 1e-9
  switch (id) {
    case 'sq':
      return k < -e ? [] : k < e ? [0] : [-Math.sqrt(k), Math.sqrt(k)]
    case 'cube':
      return [Math.cbrt(k)]
    case 'inv':
      return Math.abs(k) < e ? [] : [1 / k]
    case 'abs':
      return k < -e ? [] : k < e ? [0] : [-k, k]
    case 'lin':
      return [k - 2]
    case 'sq4':
      return k < -4 - e ? [] : k < -4 + e ? [0] : [-Math.sqrt(k + 4), Math.sqrt(k + 4)]
    case 'dbl':
      return [k / 2]
    case 'cub1':
      return [Math.cbrt(k - 1)]
    default:
      return []
  }
}

interface F3Chal {
  fns: string[]
  round: number
  score: number
  picked: Parity | null
  done: boolean
}

function f3NewChallenge(): F3Chal {
  return { fns: shuffle(F3_CHAL_POOL).slice(0, 3), round: 0, score: 0, picked: null, done: false }
}

function F3FunctionTypes() {
  const beep = useSimBeep()
  const reduced = useReducedMotion()
  const [mode, setMode] = useState<F3Mode>('explore')
  const [sel, setSel] = useState('sq')
  const [k, setK] = useState(1)
  const [mirrorY, setMirrorY] = useState(false)
  const [mirrorO, setMirrorO] = useState(false)
  const [chal, setChal] = useState<F3Chal | null>(null)
  const mirRef = useRef({ y: false, o: false, t0: 0 })

  const fn = FNS[sel]
  const rootsNow = hRoots(sel, k).filter((r) => Math.abs(r) <= XMAX)

  const answerF3 = (p: Parity) => {
    if (!chal || chal.picked !== null || chal.done) return
    const cur = FNS[chal.fns[chal.round]]
    const ok = cur.parity === p
    setChal({ ...chal, picked: p, score: chal.score + (ok ? 1 : 0), done: chal.round === chal.fns.length - 1 })
    if (ok) {
      beep(660, 120)
      window.setTimeout(() => beep(880, 160), 150)
    } else {
      beep(220, 180, 'square', 0.03)
    }
  }

  const nextRound = () => {
    if (!chal) return
    if (chal.done) {
      setChal(f3NewChallenge())
      return
    }
    setChal({ ...chal, round: chal.round + 1, picked: null })
  }

  const { canvasRef } = useSimCanvas((ctx, w, h, t) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    const tf = makeTf(w, h)
    drawPlotGrid(ctx, w, h, tf)
    drawAxes(ctx, w, h, tf)
    ctx.textBaseline = 'middle'

    const inChal = mode === 'chal' && chal !== null
    const cur = inChal && chal ? FNS[chal.fns[chal.round]] : fn

    if (!inChal) {
      // restart the mirror animation whenever a toggle flips
      if (mirRef.current.y !== mirrorY || mirRef.current.o !== mirrorO) {
        mirRef.current = { y: mirrorY, o: mirrorO, t0: t }
      }
      // ghost curves (static when reduced motion)
      if (mirrorY) {
        const p = reduced ? 1 : Math.min(1, Math.max(0, (t - mirRef.current.t0) / 0.9))
        plotFn(ctx, w, h, tf, (v) => fn.f(-v), CANVAS.violet, { alpha: 0.65 * p, dash: [7, 5], until: p * w, lw: 2 })
      }
      if (mirrorO) {
        const p = reduced ? 1 : Math.min(1, Math.max(0, (t - mirRef.current.t0) / 0.9))
        plotFn(
          ctx,
          w,
          h,
          tf,
          (v) => {
            const yv = fn.f(-v)
            return Number.isFinite(yv) ? -yv : NaN
          },
          CANVAS.teal,
          { alpha: 0.65 * p, dash: [7, 5], until: p * w, lw: 2 },
        )
      }
    }

    plotFn(ctx, w, h, tf, cur.f, inChal ? CANVAS.violet : CANVAS.amber)

    if (!inChal) {
      // horizontal line test
      const roots = hRoots(sel, k).filter((r) => Math.abs(r) <= XMAX)
      if (Math.abs(k) <= tf.yView) {
        const ky = tf.sy(k)
        ctx.setLineDash([6, 4])
        ctx.strokeStyle = CANVAS.rose
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(10, ky)
        ctx.lineTo(w - 10, ky)
        ctx.stroke()
        ctx.setLineDash([])
        for (const r of roots) {
          ctx.beginPath()
          ctx.arc(tf.sx(r), ky, 6, 0, Math.PI * 2)
          ctx.fillStyle = CANVAS.rose
          ctx.fill()
          ctx.strokeStyle = 'rgba(28,25,23,0.6)'
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      // labels + mirror verdicts
      ctx.font = FONT_MONO
      ctx.direction = 'ltr'
      ctx.textAlign = 'left'
      ctx.fillStyle = CANVAS.amber
      ctx.fillText(fn.plain, 16, 20)
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'right'
      ctx.fillStyle = CANVAS.muted
      ctx.fillText(`تابع ${fn.name} — آزمون تقارن`, w - 16, 20)
      let noteY = 42
      if (mirrorY) {
        ctx.fillStyle = fn.parity === 'even' ? CANVAS.emerald : CANVAS.rose
        ctx.fillText(
          fn.parity === 'even'
            ? '✓ آینهٔ محور yها: منحنی روی خودش می‌افتد → زوج'
            : '✗ آینهٔ محور yها: منحنی جدا افتاد → زوج نیست',
          w - 16,
          noteY,
        )
        noteY += 20
      }
      if (mirrorO) {
        ctx.fillStyle = fn.parity === 'odd' ? CANVAS.emerald : CANVAS.rose
        ctx.fillText(
          fn.parity === 'odd'
            ? '✓ آینهٔ مبدأ: منحنی روی خودش می‌افتد → فرد'
            : '✗ آینهٔ مبدأ: منحنی جدا افتاد → فرد نیست',
          w - 16,
          noteY,
        )
      }
      ctx.font = FONT_MONO
      ctx.direction = 'ltr'
      ctx.textAlign = 'left'
      ctx.fillStyle = CANVAS.rose
      ctx.fillText(`y = ${fmtNum(k)}`, 16, h - 20)
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'right'
      ctx.fillText(`خط افقی: ${roots.length} تقاطع`, w - 16, h - 20)
      return
    }

    // challenge view
    if (chal) {
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'right'
      ctx.fillStyle = CANVAS.muted
      ctx.fillText(`پرسش ${chal.round + 1} از ${chal.fns.length} — زوج، فرد یا هیچ؟`, w - 16, 20)
      if (chal.picked !== null) {
        const ok = cur.parity === chal.picked
        if (chal.done) drawBanner(ctx, w, chal.score === chal.fns.length, `پایان چالش: ${chal.score} از ${chal.fns.length}`)
        else if (ok) drawBanner(ctx, w, true, '✓ آفرین! پاسخ درست بود')
        else drawBanner(ctx, w, false, '✗ اشتباه شد؛ دوباره تلاش کن')
      }
    }
  }, 380)

  return (
    <SimFrame title="آزمایشگاه زوج/فرد و یک‌به‌یک" brief="آینه‌های تقارن را روشن کن، خط افقی را جابه‌جا کن و بعد سه تابع تصادفی را دسته‌بندی کن.">
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="نمودار تابع با آزمون تقارن و خط افقی" />
      {mode === 'explore' ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <SimSelect
              label="تابع"
              value={sel}
              onChange={setSel}
              options={F3_SELECT.map((id) => ({ value: id, label: FNS[id].name }))}
            />
            <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">قاعده</span>
              <Tex tex={fn.tex} />
            </div>
            <SimButton
              variant="secondary"
              onClick={() => {
                setChal(f3NewChallenge())
                setMode('chal')
                beep(520, 60, 'triangle', 0.03)
              }}
            >
              شروع چالش
            </SimButton>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SimSlider
              label="خط افقی آزمون y = k"
              value={k}
              min={-2.5}
              max={2.5}
              step={0.25}
              onChange={setK}
              format={fmtNum}
            />
            <Readout
              label="تقاطع خط افقی"
              value={String(rootsNow.length)}
              tone={rootsNow.length > 1 ? 'text-rose-300' : 'text-emerald-300'}
            />
            <Readout
              label="زوج/فرد؟"
              value={PARITY_LABEL[fn.parity]}
              tone={fn.parity === 'neither' ? undefined : 'text-emerald-300'}
            />
            <Readout
              label="یک‌به‌یک؟"
              value={fn.oneToOne ? 'بله ✓' : 'خیر ✗'}
              tone={fn.oneToOne ? 'text-emerald-300' : 'text-rose-300'}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <SimToggle label="آینهٔ محور yها (آزمون زوج)" checked={mirrorY} onChange={setMirrorY} />
            <SimToggle label="آینهٔ مبدأ (آزمون فرد)" checked={mirrorO} onChange={setMirrorO} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Legend color={CANVAS.amber} label="نمودار تابع" />
            <Legend color={CANVAS.violet} label="آینهٔ محور yها" />
            <Legend color={CANVAS.teal} label="آینهٔ مبدأ" />
            <Legend color={CANVAS.rose} label="خط افقی آزمون" />
          </div>
          <p className="text-xs text-muted-foreground">
            بررسی تقارن: {fn.parityProof}. آزمون خط افقی: اگر هیچ خط افقی بیش از یک تقاطع با نمودار نداشته باشد، تابع
            یک‌به‌یک است (مثل x³)؛ دو تقاطع یعنی دو ورودی با یک تصویر (مثل x² در y = 4).
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <SimButton
              variant="secondary"
              onClick={() => {
                setChal(f3NewChallenge())
                beep(520, 60, 'triangle', 0.03)
              }}
            >
              چالش تازه
            </SimButton>
            {chal && chal.picked !== null && !chal.done && <SimButton onClick={nextRound}>پرسش بعدی</SimButton>}
            <Readout
              label="امتیاز"
              value={chal ? `${chal.score} / ${chal.fns.length}` : '0 / 0'}
              tone="text-emerald-300"
            />
          </div>
          {chal ? (
            <>
              <div className="flex flex-wrap gap-2">
                {(['even', 'odd', 'neither'] as Parity[]).map((p) => (
                  <SimButton key={p} variant="outline" disabled={chal.picked !== null} onClick={() => answerF3(p)}>
                    {PARITY_LABEL[p]}
                  </SimButton>
                ))}
              </div>
              <p role="status" className="text-xs font-medium">
                {chal.picked === null
                  ? `تابع ${chal.round + 1} از ${chal.fns.length}: با محاسبهٔ f(−x) یا آینه‌های ذهنی، نوع تقارن را تصمیم بگیر.`
                  : FNS[chal.fns[chal.round]].parity === chal.picked
                    ? `درست بود! ${FNS[chal.fns[chal.round]].plain} ${PARITY_LABEL[FNS[chal.fns[chal.round]].parity]}.`
                    : `اشتباه شد؛ پاسخ درست: ${FNS[chal.fns[chal.round]].plain} ${PARITY_LABEL[FNS[chal.fns[chal.round]].parity]}.`}
              </p>
              {chal.done && (
                <p className="text-xs font-semibold">
                  {chal.score === chal.fns.length
                    ? 'عالی! هر سه تابع را درست دسته‌بندی کردی.'
                    : 'برای تمرین بیشتر، دوباره «چالش تازه» را امتحان کن.'}
                </p>
              )}
            </>
          ) : (
            <p role="status" className="text-xs font-medium">
              برای شروع، «چالش تازه» را بزن: سه تابع تصادفی را زوج/فرد دسته‌بندی کن.
            </p>
          )}
        </>
      )}
    </SimFrame>
  )
}

// ─── registry ─────────────────────────────────────────────────────────────────
export const simsC5: Record<string, SimComponent> = {
  'f1-function-concept': F1FunctionConcept,
  'f2-domain-range': F2DomainRange,
  'f3-function-types': F3FunctionTypes,
}
