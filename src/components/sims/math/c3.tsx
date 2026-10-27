// ─── Math Quest · فصل ۳ «توان‌های گویا و عبارت‌های جبری» — interactive widgets ──
// Content agent Task 3-b — built entirely on sim-kit. simKey == lesson id.
'use client'

import { useState } from 'react'
import type { SimComponent, SimProps } from '@/lib/game/types'
import {
  CANVAS,
  SimFrame,
  SimSlider,
  SimButton,
  Readout,
  Legend,
  useSimCanvas,
  drawGrid,
  useSimBeep,
  useReducedMotion,
} from '@/components/sims/sim-kit'
import { Tex } from '@/components/game/tex'

// ─── shared helpers ───────────────────────────────────────────────────────────

const FA_FONT = 'Vazirmatn, Tahoma, sans-serif'
const MONO_FONT = 'ui-monospace, SFMono-Regular, Menlo, monospace'
const FONT_FA = `600 12px ${FA_FONT}`
const FONT_MONO = `700 13px ${MONO_FONT}`

/** Format a number for canvas/HTML readouts — never NaN/Infinity. */
function fmt(v: number, d = 2): string {
  if (!Number.isFinite(v)) return '—'
  const p = 10 ** d
  const r = Math.round(v * p) / p
  return Object.is(r, -0) ? '0' : String(r)
}

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rad: number) {
  const r = Math.max(0, Math.min(rad, w / 2, h / 2))
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
  const bw = Math.min(340, w - 24)
  const x = (w - bw) / 2
  ctx.save()
  ctx.fillStyle = ok ? 'rgba(16,185,129,0.93)' : 'rgba(244,63,94,0.93)'
  rr(ctx, x, 10, bw, 34, 10)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 14px ${FA_FONT}`
  ctx.direction = 'rtl'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, 28)
  ctx.restore()
}

/** Win / lose jingles (respect the sound setting through useSimBeep). */
function sfxWin(beep: (freq?: number, ms?: number, type?: OscillatorType, gain?: number) => void) {
  beep(660, 120)
  window.setTimeout(() => beep(880, 160), 150)
}
function sfxLose(beep: (freq?: number, ms?: number, type?: OscillatorType, gain?: number) => void) {
  beep(220, 180, 'square', 0.03)
}

/** Width of ⁿ√body without drawing it (for centering). */
function rootWidth(ctx: CanvasRenderingContext2D, n: number, body: string, size: number): number {
  ctx.save()
  ctx.font = `700 ${size}px ${MONO_FONT}`
  const rootW = ctx.measureText('√').width
  const bodyW = ctx.measureText(body).width
  let idxW = 0
  if (n > 2) {
    ctx.font = `700 ${Math.max(9, Math.round(size * 0.6))}px ${MONO_FONT}`
    idxW = ctx.measureText(String(n)).width + 1
  }
  ctx.restore()
  return idxW + rootW + bodyW + 4
}

/** Draw ⁿ√body with a small raised index digit + vinculum. Returns total width. */
function drawRoot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  n: number,
  body: string,
  color: string,
  size = 16,
): number {
  ctx.save()
  ctx.direction = 'ltr'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  let idxW = 0
  if (n > 2) {
    ctx.fillStyle = color
    ctx.font = `700 ${Math.max(9, Math.round(size * 0.6))}px ${MONO_FONT}`
    ctx.fillText(String(n), x, y - size * 0.5)
    idxW = ctx.measureText(String(n)).width + 1
  }
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.font = `700 ${size}px ${MONO_FONT}`
  const rootW = ctx.measureText('√').width
  const bodyW = ctx.measureText(body).width
  ctx.fillText('√', x + idxW, y)
  ctx.fillText(body, x + idxW + rootW, y)
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.moveTo(x + idxW + rootW, y - size * 0.82)
  ctx.lineTo(x + idxW + rootW + bodyW + 2, y - size * 0.82)
  ctx.stroke()
  ctx.restore()
  return idxW + rootW + bodyW + 4
}

/** Draw base with a raised exponent (e.g. a²). Returns total width. */
function drawPow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  base: string,
  exp: string,
  color: string,
  size = 16,
  measureOnly = false,
): number {
  ctx.save()
  ctx.direction = 'ltr'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = color
  ctx.font = `700 ${size}px ${MONO_FONT}`
  if (!measureOnly) ctx.fillText(base, x, y)
  const bw = ctx.measureText(base).width
  let ew = 0
  if (exp !== '1' && exp !== '') {
    ctx.font = `700 ${Math.max(9, Math.round(size * 0.62))}px ${MONO_FONT}`
    if (!measureOnly) ctx.fillText(exp, x + bw + 1, y - size * 0.5)
    ew = ctx.measureText(exp).width + 2
  }
  ctx.restore()
  return bw + ew
}

interface Term {
  c: number
  p: number
}

/** Draw a polynomial like «3x² + 2x − x²» with manual raised exponents. Returns width. */
function drawExpr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  terms: Term[],
  color: string,
  size = 17,
  measureOnly = false,
): number {
  let cx = x
  let first = true
  for (const t of terms) {
    if (t.c === 0) continue
    const neg = t.c < 0
    const abs = Math.abs(t.c)
    ctx.save()
    ctx.direction = 'ltr'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = color
    ctx.font = `700 ${size}px ${MONO_FONT}`
    if (first) {
      if (neg) {
        if (!measureOnly) ctx.fillText('−', cx, y)
        cx += ctx.measureText('−').width + 3
      }
      first = false
    } else {
      if (!measureOnly) ctx.fillText(neg ? '−' : '+', cx, y)
      cx += ctx.measureText(neg ? '−' : '+').width + 6
    }
    if (abs !== 1) {
      if (!measureOnly) ctx.fillText(String(abs), cx, y)
      cx += ctx.measureText(String(abs)).width
    }
    if (!measureOnly) ctx.fillText('x', cx, y)
    cx += ctx.measureText('x').width
    if (t.p !== 1) {
      ctx.font = `700 ${Math.max(10, Math.round(size * 0.62))}px ${MONO_FONT}`
      if (!measureOnly) ctx.fillText(String(t.p), cx + 1, y - size * 0.5)
      cx += ctx.measureText(String(t.p)).width * 0.7 + 2
    }
    ctx.restore()
  }
  return cx - x
}

/** Simple straight arrow. */
function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  const ang = Math.atan2(y2 - y1, x2 - x1)
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - 8 * Math.cos(ang - 0.42), y2 - 8 * Math.sin(ang - 0.42))
  ctx.lineTo(x2 - 8 * Math.cos(ang + 0.42), y2 - 8 * Math.sin(ang + 0.42))
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// ─────────────────────────────────────────────────────────────────────────────
// p1-root-power · مربع و مکعب: مدل مساحت/حجم + چالش a²
// ─────────────────────────────────────────────────────────────────────────────
type P1Mode = 'explore' | 'chal'
interface P1Chal {
  a: number
  answer: number
  choices: number[]
  status: 'idle' | 'won' | 'lost'
}

function P1RootPower(_props: SimProps) {
  const beep = useSimBeep()
  const [a, setA] = useState(3)
  const [mode, setMode] = useState<P1Mode>('explore')
  const [chal, setChal] = useState<P1Chal | null>(null)

  const a2 = a * a
  const a3 = a * a * a
  const sqrtA = a >= 0 ? Math.sqrt(a) : Number.NaN
  const cbrtA = Math.cbrt(a)

  const newChallenge = () => {
    const k = randInt(2, 12)
    const answer = k * k
    const pool = shuffle([2 * k, k * k + k, k * k - 2 * k, 3 * k, k * k + 2])
    const wrong: number[] = []
    for (const v of pool) {
      if (Number.isFinite(v) && v > 0 && v !== answer && !wrong.includes(v)) wrong.push(v)
      if (wrong.length === 3) break
    }
    let extra = 1
    while (wrong.length < 3) {
      if (!wrong.includes(answer + extra)) wrong.push(answer + extra)
      extra++
    }
    setChal({ a: k, answer, choices: shuffle([answer, ...wrong]), status: 'idle' })
    setMode('chal')
    beep(520, 60, 'triangle', 0.03)
  }

  const pick = (v: number) => {
    if (!chal) return
    if (v === chal.answer) {
      setChal({ ...chal, status: 'won' })
      sfxWin(beep)
    } else {
      setChal({ ...chal, status: 'lost' })
      sfxLose(beep)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)
    ctx.textBaseline = 'middle'

    if (mode === 'chal' && chal) {
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'right'
      ctx.fillStyle = CANVAS.amber
      ctx.fillText('چالش: مربع عدد', w - 18, 60)
      ctx.direction = 'ltr'
      ctx.textAlign = 'center'
      ctx.font = `700 34px ${MONO_FONT}`
      ctx.fillStyle = CANVAS.fg
      ctx.fillText(`a = ${chal.a}`, w / 2, h * 0.4)
      ctx.fillStyle = CANVAS.yellow
      ctx.fillText('a² = ?', w / 2, h * 0.62)
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.fillStyle = CANVAS.muted
      ctx.fillText('a² یعنی a در خودش ضرب‌شده؛ گزینهٔ درست را انتخاب کن.', w / 2, h - 28)
      if (chal.status !== 'idle') {
        drawBanner(ctx, w, chal.status === 'won', chal.status === 'won' ? '✓ آفرین! پاسخ درست بود' : '✗ اشتباه شد؛ دوباره فکر کن')
        ctx.direction = 'ltr'
        ctx.textAlign = 'center'
        ctx.font = `700 20px ${MONO_FONT}`
        ctx.fillStyle = CANVAS.emerald
        ctx.fillText(`a² = ${chal.answer}`, w / 2, h * 0.78)
      }
      return
    }

    // ── explore: مربع (راست) + مکعب (چپ) ──
    const s = Math.abs(a)
    const baseY = h * 0.78

    // square model (right side)
    const sqCX = w * 0.74
    const sqScale = Math.min(w * 0.4, h * 0.5) / 12
    const sqSide = Math.max(2, s * sqScale)
    const sqX = sqCX - sqSide / 2
    const sqY = baseY - sqSide
    ctx.fillStyle = a < 0 ? 'rgba(245,158,11,0.14)' : 'rgba(245,158,11,0.3)'
    ctx.strokeStyle = CANVAS.amber
    ctx.lineWidth = 2
    if (a < 0) ctx.setLineDash([6, 5])
    ctx.fillRect(sqX, sqY, sqSide, sqSide)
    ctx.strokeRect(sqX, sqY, sqSide, sqSide)
    ctx.setLineDash([])
    ctx.font = `700 15px ${MONO_FONT}`
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.fg
    ctx.fillText(`a² = ${a2}`, sqCX, sqY - 16)
    ctx.font = FONT_FA
    ctx.direction = 'rtl'
    ctx.fillStyle = CANVAS.muted
    ctx.fillText('مربع (مساحت)', sqCX, 60)
    // dimension line under the square
    ctx.strokeStyle = CANVAS.amber
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(sqX, baseY + 12)
    ctx.lineTo(sqX + sqSide, baseY + 12)
    ctx.moveTo(sqX, baseY + 7)
    ctx.lineTo(sqX, baseY + 17)
    ctx.moveTo(sqX + sqSide, baseY + 7)
    ctx.lineTo(sqX + sqSide, baseY + 17)
    ctx.stroke()
    ctx.font = FONT_MONO
    ctx.direction = 'ltr'
    ctx.fillStyle = CANVAS.amber
    ctx.fillText(`a = ${a}`, sqCX, baseY + 30)

    // cube model (left side) — front face + top/right depth
    const cbCX = w * 0.28
    const cbScale = Math.min(w * 0.3, h * 0.42) / 12
    const cbSide = Math.max(2, s * cbScale)
    const d = Math.min(24, cbSide * 0.28)
    const fx = cbCX - cbSide / 2 - d / 2
    const fy = baseY - cbSide
    ctx.fillStyle = 'rgba(139,92,246,0.32)'
    ctx.beginPath()
    ctx.moveTo(fx, fy)
    ctx.lineTo(fx + d, fy - d)
    ctx.lineTo(fx + cbSide + d, fy - d)
    ctx.lineTo(fx + cbSide, fy)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = 'rgba(139,92,246,0.18)'
    ctx.beginPath()
    ctx.moveTo(fx + cbSide, fy)
    ctx.lineTo(fx + cbSide + d, fy - d)
    ctx.lineTo(fx + cbSide + d, fy + cbSide - d)
    ctx.lineTo(fx + cbSide, fy + cbSide)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = a < 0 ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.3)'
    ctx.strokeStyle = CANVAS.violet
    ctx.lineWidth = 2
    if (a < 0) ctx.setLineDash([6, 5])
    ctx.fillRect(fx, fy, cbSide, cbSide)
    ctx.strokeRect(fx, fy, cbSide, cbSide)
    ctx.setLineDash([])
    ctx.font = `700 15px ${MONO_FONT}`
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.fg
    ctx.fillText(`a³ = ${a3}`, cbCX, fy - d - 14)
    ctx.font = FONT_FA
    ctx.direction = 'rtl'
    ctx.fillStyle = CANVAS.muted
    ctx.fillText('مکعب (حجم)', cbCX, 60)

    if (a < 0) {
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.yellow
      ctx.fillText('a منفی است: مدل‌ها با |a| رسم شده‌اند؛ a² مثبت ولی a³ منفی می‌شود.', w / 2, 24)
    }
  }, 380)

  return (
    <SimFrame
      title="آزمایشگاه مربع و مکعب"
      brief="ضلع a را جابه‌جا کن تا مساحت a² و حجم a³ را ببینی؛ جذر و ریشهٔ سوم، پرسش وارونهٔ همین مدل‌ها هستند."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="مدل مساحت مربع و حجم مکعب برای عدد a" />
      {mode === 'explore' ? (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <SimSlider label="عدد a" value={a} min={-4} max={12} step={1} onChange={setA} />
            <SimButton variant="secondary" onClick={newChallenge}>
              شروع چالش
            </SimButton>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Readout label="a² (مساحت)" value={String(a2)} tone="text-amber-300" />
            <Readout label="a³ (حجم)" value={String(a3)} tone="text-violet-300" />
            <Readout
              label="√a (جذر)"
              value={a >= 0 ? fmt(sqrtA, 3) : 'تعریف‌نشده'}
              tone={a >= 0 ? 'text-emerald-300' : 'text-rose-300'}
            />
            <Readout label="∛a (ریشهٔ سوم)" value={fmt(cbrtA, 3)} tone="text-teal-300" />
          </div>
          {a < 0 ? (
            <p role="status" className="text-xs text-amber-400/90">
              هشدار: a منفی است — جذر دوم در اعداد حقیقی تعریف‌نشده است، اما a² مثبت، و a³ و ∛a منفی می‌شوند.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              √a عددی است که مجذورش a می‌شود و ∛a عددی است که مکعبش a می‌شود؛ برای همین ریشه گرفتن، عمل وارونهٔ توان گرفتن است.
            </p>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <SimButton variant="secondary" onClick={newChallenge}>
              چالش تازه
            </SimButton>
            <SimButton
              variant="ghost"
              onClick={() => {
                setChal(null)
                setMode('explore')
              }}
            >
              بازگشت به آزمایشگاه
            </SimButton>
            {chal && <Readout label="عدد a" value={String(chal.a)} tone="text-amber-300" />}
            {chal && <Readout label="a² ؟" value={chal.status === 'idle' ? '؟' : String(chal.answer)} tone="text-emerald-300" />}
          </div>
          {chal && (
            <div className="flex flex-wrap gap-2">
              {chal.choices.map((v) => (
                <SimButton key={v} variant="outline" onClick={() => pick(v)}>
                  {v}
                </SimButton>
              ))}
            </div>
          )}
          <p role="status" className="text-xs font-medium">
            {!chal
              ? 'برای شروع، «چالش تازه» را بزن.'
              : chal.status === 'won'
                ? `آفرین! ${chal.a} × ${chal.a} = ${chal.answer}`
                : chal.status === 'lost'
                  ? 'اشتباه شد؛ a² یعنی a در خودش ضرب‌شده، نه ۲ برابر a. دوباره امتحان کن.'
                  : 'برای a داده‌شده، مقدار a² را انتخاب کن.'}
          </p>
        </>
      )}
    </SimFrame>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// p2-nth-root · کاوشگر ریشهٔ nام: دو محور + چالش عددی
// ─────────────────────────────────────────────────────────────────────────────
type P2Mode = 'explore' | 'chal'
interface P2Chal {
  n: number
  a: number
  answer: number
  status: 'idle' | 'won' | 'lost'
}
const P2_MAX_ROOT: Record<number, number> = { 2: 10, 3: 4, 4: 3, 5: 2, 6: 2 }

function numberLine(
  ctx: CanvasRenderingContext2D,
  x0: number,
  x1: number,
  y: number,
  vmax: number,
  ticks: number[],
  color: string,
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2
  ctx.direction = 'ltr'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.beginPath()
  ctx.moveTo(x0, y)
  ctx.lineTo(x1, y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x1 + 10, y)
  ctx.lineTo(x1, y - 5)
  ctx.lineTo(x1, y + 5)
  ctx.closePath()
  ctx.fill()
  ctx.font = '600 10px ui-monospace, monospace'
  ctx.lineWidth = 1.2
  for (const tv of ticks) {
    const px = x0 + (tv / vmax) * (x1 - x0)
    ctx.beginPath()
    ctx.moveTo(px, y - 5)
    ctx.lineTo(px, y + 5)
    ctx.stroke()
    ctx.fillText(String(tv), px, y + 18)
  }
  ctx.restore()
}

function P2NthRoot(_props: SimProps) {
  const beep = useSimBeep()
  const reduced = useReducedMotion()
  const [n, setN] = useState(3)
  const [a, setA] = useState(27)
  const [mode, setMode] = useState<P2Mode>('explore')
  const [chal, setChal] = useState<P2Chal | null>(null)
  const [input, setInput] = useState('')
  const [badInput, setBadInput] = useState(false)

  const root = Math.pow(a, 1 / n)
  const even = n % 2 === 0

  const newChallenge = () => {
    const cn = randInt(2, 6)
    const r = randInt(2, P2_MAX_ROOT[cn] ?? 3)
    setChal({ n: cn, a: r ** cn, answer: r, status: 'idle' })
    setInput('')
    setBadInput(false)
    setMode('chal')
    beep(520, 60, 'triangle', 0.03)
  }

  const check = () => {
    if (!chal) return
    const v = Number(input)
    if (input.trim() === '' || !Number.isFinite(v)) {
      setBadInput(true)
      return
    }
    setBadInput(false)
    if (Math.abs(v - chal.answer) <= 0.005) {
      setChal({ ...chal, status: 'won' })
      sfxWin(beep)
    } else {
      setChal({ ...chal, status: 'lost' })
      sfxLose(beep)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h, t) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)
    ctx.textBaseline = 'middle'

    if (mode === 'chal' && chal) {
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'right'
      ctx.fillStyle = CANVAS.amber
      ctx.fillText('چالش: ریشهٔ nام', w - 18, 60)
      const body = String(chal.a)
      const rw = rootWidth(ctx, chal.n, body, 34)
      drawRoot(ctx, w / 2 - rw / 2, h * 0.45, chal.n, body, CANVAS.yellow, 34)
      ctx.font = `700 26px ${MONO_FONT}`
      ctx.direction = 'ltr'
      ctx.textAlign = 'left'
      ctx.fillStyle = CANVAS.fg
      ctx.fillText('= ?', w / 2 + rw / 2 + 12, h * 0.45)
      if (chal.status !== 'idle') {
        drawBanner(ctx, w, chal.status === 'won', chal.status === 'won' ? '✓ آفرین! پاسخ درست بود' : '✗ اشتباه شد؛ دوباره تلاش کن')
        ctx.direction = 'ltr'
        ctx.textAlign = 'center'
        ctx.font = `700 24px ${MONO_FONT}`
        ctx.fillStyle = CANVAS.emerald
        ctx.fillText(`= ${chal.answer}`, w / 2, h * 0.62)
      }
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.muted
      ctx.fillText('چه عددی n بار در خودش ضرب شود به این عدد می‌رسد؟', w / 2, h - 26)
      return
    }

    // ── explore: دو محور موازی — بالا: a (۰ تا ۱۰۰)، پایین: ⁿ√a (۰ تا ۱۰) ──
    ctx.font = FONT_FA
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.muted
    ctx.fillText('بالا: عدد a — پایین: ریشهٔ nام آن', w - 16, 24)

    const x0 = w * 0.08
    const x1 = w * 0.9
    const y1 = h * 0.3
    const y2 = h * 0.7
    numberLine(ctx, x0, x1, y1, 100, [0, 25, 50, 75, 100], CANVAS.muted)
    numberLine(ctx, x0, x1, y2, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], CANVAS.muted)

    // marker for a (top line)
    const mx1 = x0 + (Math.min(100, Math.max(0, a)) / 100) * (x1 - x0)
    ctx.beginPath()
    ctx.arc(mx1, y1, 6, 0, Math.PI * 2)
    ctx.fillStyle = CANVAS.amber
    ctx.fill()
    ctx.font = FONT_MONO
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.amber
    ctx.fillText(`a = ${a}`, mx1, y1 - 18)

    // marker for ⁿ√a (bottom line) with a soft pulse (respects reduced motion)
    const rv = Math.min(10, Math.max(0, root))
    const mx2 = x0 + (rv / 10) * (x1 - x0)
    const pr = 7 + (reduced ? 0 : 2 * Math.sin(t * 3))
    ctx.beginPath()
    ctx.arc(mx2, y2, pr, 0, Math.PI * 2)
    ctx.fillStyle = CANVAS.teal
    ctx.fill()
    const rw = rootWidth(ctx, n, String(a), 15)
    drawRoot(ctx, mx2 - rw / 2, y2 - 20, n, String(a), CANVAS.teal, 15)
    ctx.font = FONT_MONO
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.teal
    ctx.fillText(fmt(root, 3), mx2, y2 + 36)
  }, 380)

  return (
    <SimFrame
      title="کاوشگر ریشهٔ nام"
      brief="اندیس n و عدد a را انتخاب کن؛ جای ⁿ√a را روی محور اعداد ببین و رفتار اندیس زوج و فرد را مقایسه کن."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="محور اعداد با موقعیت ریشهٔ nام" />
      {mode === 'explore' ? (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <SimSlider label="اندیس ریشه n" value={n} min={2} max={6} step={1} onChange={setN} />
            <SimSlider label="عدد a" value={a} min={0} max={100} step={1} onChange={setA} />
            <SimButton variant="secondary" onClick={newChallenge}>
              شروع چالش
            </SimButton>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Readout label={`ریشهٔ ${n}ام از ${a}`} value={fmt(root, 3)} tone="text-teal-300" />
            <Readout label="بررسی: ریشه به توان n" value={fmt(Math.pow(root, n), 2)} tone="text-emerald-300" />
          </div>
          {even ? (
            <p className="text-xs text-amber-400/90">
              اندیس زوج: ریشه فقط برای a ≥ 0 تعریف می‌شود و نتیجه همیشه نامنفی است؛ مثلاً √16 = 4 ولی √−16 در اعداد حقیقی تعریف‌نشده است.
            </p>
          ) : (
            <p className="text-xs text-teal-400/90">
              اندیس فرد: ریشه برای همهٔ اعداد حقیقی تعریف می‌شود؛ مثلاً ریشهٔ سومِ −27 برابر −3 است. در این آزمایشگاه a نامنفی است.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            وقتی a بزرگ‌تر از ۱ باشد، هرچه اندیس بزرگ‌تر شود ریشه به ۱ نزدیک‌تر می‌شود: √100 = 10، ریشهٔ سومِ 100 ≈ 4.64، ریشهٔ چهارمِ 100 ≈ 3.16.
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <SimButton variant="secondary" onClick={newChallenge}>
              چالش تازه
            </SimButton>
            <SimButton
              variant="ghost"
              onClick={() => {
                setChal(null)
                setBadInput(false)
                setMode('explore')
              }}
            >
              بازگشت به محور
            </SimButton>
          </div>
          {chal && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                ریشهٔ {chal.n}ام از {chal.a} چند است؟
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setBadInput(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') check()
                }}
                aria-label="پاسخ عددی چالش ریشه"
                dir="ltr"
                className="h-9 w-32 rounded-md border bg-transparent px-3 text-sm font-mono tabular-nums"
              />
              <SimButton variant="outline" onClick={check}>
                بررسی
              </SimButton>
              {chal.status !== 'idle' && <Readout label="پاسخ درست" value={String(chal.answer)} tone="text-emerald-300" />}
            </div>
          )}
          <p role="status" className="text-xs font-medium">
            {!chal
              ? 'برای شروع، «چالش تازه» را بزن.'
              : chal.status === 'won'
                ? `آفرین! چون ${chal.answer} به توان ${chal.n} می‌شود ${chal.a}.`
                : chal.status === 'lost'
                  ? 'اشتباه شد؛ توان‌های nام اعداد کوچک (۲، ۳، ۴، …) را مرور کن و دوباره امتحان کن.'
                  : badInput
                    ? 'لطفاً یک عدد معتبر وارد کن.'
                    : 'پاسخ عددی را وارد کن و «بررسی» را بزن (کلید Enter هم کار می‌کند).'}
          </p>
        </>
      )}
    </SimFrame>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// p3-rational-powers · a^(m/n): دو مسیر «اول ریشه» / «اول توان» + چالش چهارگزینه‌ای
// ─────────────────────────────────────────────────────────────────────────────
interface P3Chal {
  a: number
  m: number
  n: number
  answer: number
  choices: number[]
  status: 'idle' | 'won' | 'lost'
}
/** [a, n, m, a^(m/n)] — همهٔ جواب‌ها با دست بررسی شده‌اند (اول ریشه، بعد توان). */
const P3_POOL: [number, number, number, number][] = [
  [4, 2, 1, 2], [9, 2, 1, 3], [16, 2, 1, 4], [25, 2, 1, 5], [36, 2, 1, 6], [49, 2, 1, 7], [100, 2, 1, 10],
  [8, 3, 1, 2], [27, 3, 1, 3], [64, 3, 1, 4], [125, 3, 1, 5],
  [4, 2, 3, 8], [9, 2, 3, 27], [16, 2, 3, 64], [25, 2, 3, 125],
  [8, 3, 2, 4], [27, 3, 2, 9], [64, 3, 2, 16], [125, 3, 2, 25],
  [16, 4, 1, 2], [81, 4, 1, 3], [16, 4, 3, 8], [81, 4, 3, 27],
  [32, 5, 1, 2], [32, 5, 2, 4], [32, 5, 3, 8],
  [64, 6, 1, 2], [64, 6, 5, 32],
]
const SUP_POW = ['⁰', '¹', '²', '³', '⁴', '⁵']

function P3RationalPowers(_props: SimProps) {
  const beep = useSimBeep()
  const [a, setA] = useState(8)
  const [m, setM] = useState(2)
  const [n, setN] = useState(3)
  const [chal, setChal] = useState<P3Chal | null>(null)

  const r0 = Math.pow(a, 1 / n)
  const pathA = Math.pow(r0, m)
  const am = Math.pow(a, m)
  const pathB = Math.pow(am, 1 / n)
  const val = Math.pow(a, m / n)

  const newChallenge = () => {
    const [pa, pn, pm, pans] = P3_POOL[randInt(0, P3_POOL.length - 1)] ?? [8, 3, 2, 4]
    const base = Math.pow(pa, 1 / pn)
    const cands = [
      Math.round(base), // فراموش کردن توان m
      Math.pow(pa, pm), // فراموش کردن ریشه
      Math.round((pa * pm) / pn), // خطای خطی‌سازی a·m/n
      pans * 2,
      pans + 1,
      pans - 1,
      pans + pn,
      pm * pn,
    ]
    const wrong: number[] = []
    for (const v of shuffle(cands)) {
      if (Number.isFinite(v) && v > 0 && v !== pans && !wrong.includes(v)) wrong.push(v)
      if (wrong.length === 3) break
    }
    let k = 1
    while (wrong.length < 3) {
      if (!wrong.includes(pans + k)) wrong.push(pans + k)
      k++
    }
    setChal({ a: pa, m: pm, n: pn, answer: pans, choices: shuffle([pans, ...wrong]), status: 'idle' })
    beep(520, 60, 'triangle', 0.03)
  }

  const pick = (v: number) => {
    if (!chal) return
    if (v === chal.answer) {
      setChal({ ...chal, status: 'won' })
      sfxWin(beep)
    } else {
      setChal({ ...chal, status: 'lost' })
      sfxLose(beep)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)
    ctx.textBaseline = 'middle'

    if (chal) {
      // ── challenge view ──
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'right'
      ctx.fillStyle = CANVAS.amber
      ctx.fillText('چالش: توان گویا', w - 18, 60)
      const body = `${chal.a}${SUP_POW[chal.m] ?? ''}`
      const rw = rootWidth(ctx, chal.n, body, 34)
      drawRoot(ctx, w / 2 - rw / 2, h * 0.42, chal.n, body, CANVAS.yellow, 34)
      ctx.font = `700 26px ${MONO_FONT}`
      ctx.direction = 'ltr'
      ctx.textAlign = 'left'
      ctx.fillStyle = CANVAS.fg
      ctx.fillText('= ?', w / 2 + rw / 2 + 12, h * 0.42)
      if (chal.status !== 'idle') {
        drawBanner(ctx, w, chal.status === 'won', chal.status === 'won' ? '✓ آفرین! پاسخ درست بود' : '✗ اشتباه شد؛ دو مسیر را امتحان کن')
        ctx.direction = 'ltr'
        ctx.textAlign = 'center'
        ctx.font = `700 24px ${MONO_FONT}`
        ctx.fillStyle = CANVAS.emerald
        ctx.fillText(`= ${chal.answer}`, w / 2, h * 0.6)
      }
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.muted
      ctx.fillText('مخرج کسر یعنی اندیس ریشه، صورت کسر یعنی توان.', w / 2, h - 26)
      return
    }

    // ── explore: نمودار دو مسیر ──
    ctx.font = FONT_FA
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.amber
    ctx.fillText('دو مسیر، یک مقصد', w - 16, 22)

    const topY = 52
    const midY = h * 0.46
    const resY = h * 0.8

    // top node: a^(m/n)
    const pw = Math.max(120, drawPow(ctx, 0, 0, String(a), `${m}/${n}`, '#000', 19, true) + 56)
    const tx = w / 2 - pw / 2
    ctx.fillStyle = 'rgba(245,158,11,0.14)'
    ctx.strokeStyle = CANVAS.amber
    ctx.lineWidth = 2
    rr(ctx, tx, topY, pw, 46, 12)
    ctx.fill()
    ctx.stroke()
    const w0 = drawPow(ctx, 0, 0, String(a), `${m}/${n}`, '#000', 19, true)
    drawPow(ctx, w / 2 - w0 / 2, topY + 31, String(a), `${m}/${n}`, CANVAS.fg, 19)

    // right path (اول ریشه) — teal
    const rbx = w * 0.72
    const rbw = Math.min(220, w * 0.36)
    ctx.fillStyle = 'rgba(20,184,166,0.12)'
    ctx.strokeStyle = CANVAS.teal
    ctx.lineWidth = 1.6
    rr(ctx, rbx - rbw / 2, midY - 44, rbw, 88, 12)
    ctx.fill()
    ctx.stroke()
    ctx.font = FONT_FA
    ctx.direction = 'rtl'
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.teal
    ctx.fillText('مسیر ۱: اول ریشه', rbx, midY - 26)
    const rw1 = rootWidth(ctx, n, String(a), 14)
    drawRoot(ctx, rbx - rw1 / 2, midY - 2, n, String(a), CANVAS.teal, 14)
    ctx.font = `700 12px ${MONO_FONT}`
    ctx.direction = 'ltr'
    ctx.fillStyle = CANVAS.fg
    ctx.fillText(`(ⁿ√a)^m = ${fmt(pathA, 3)}`, rbx, midY + 26)

    // left path (اول توان) — orange
    const lbx = w * 0.28
    const lbw = Math.min(220, w * 0.36)
    ctx.fillStyle = 'rgba(249,115,22,0.12)'
    ctx.strokeStyle = CANVAS.orange
    rr(ctx, lbx - lbw / 2, midY - 44, lbw, 88, 12)
    ctx.fill()
    ctx.stroke()
    ctx.font = FONT_FA
    ctx.direction = 'rtl'
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.orange
    ctx.fillText('مسیر ۲: اول توان', lbx, midY - 26)
    ctx.font = `700 12px ${MONO_FONT}`
    ctx.direction = 'ltr'
    ctx.fillStyle = CANVAS.fg
    ctx.fillText(`a^m = ${fmt(am, 2)}`, lbx, midY - 2)
    const bw2 = fmt(am, 2)
    const rw2 = rootWidth(ctx, n, bw2, 14)
    drawRoot(ctx, lbx - rw2 / 2, midY + 26, n, bw2, CANVAS.orange, 14)

    // result node
    const res = fmt(val, 3)
    ctx.font = `700 16px ${MONO_FONT}`
    const resW = Math.max(150, ctx.measureText(`a^(m/n) = ${res}`).width + 48)
    ctx.fillStyle = 'rgba(16,185,129,0.14)'
    ctx.strokeStyle = CANVAS.emerald
    ctx.lineWidth = 2
    rr(ctx, w / 2 - resW / 2, resY - 24, resW, 48, 12)
    ctx.fill()
    ctx.stroke()
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.emerald
    ctx.fillText(`a^(m/n) = ${res}`, w / 2, resY + 1)

    // arrows
    arrow(ctx, w / 2 + 20, topY + 46, rbx - 24, midY - 44, CANVAS.teal)
    arrow(ctx, w / 2 - 20, topY + 46, lbx + 24, midY - 44, CANVAS.orange)
    arrow(ctx, rbx, midY + 44, w / 2 + resW / 2 - 20, resY - 24, CANVAS.teal)
    arrow(ctx, lbx, midY + 44, w / 2 - resW / 2 + 20, resY - 24, CANVAS.orange)
  }, 380)

  return (
    <SimFrame
      title="کاوشگر توان‌های گویا"
      brief="a^(m/n) را با دو مسیر «اول ریشه» و «اول توان» حساب کن؛ مخرج کسر اندیس ریشه و صورت کسر توان است."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="نمودار دو مسیر محاسبهٔ توان گویا" />
      {chal ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <SimButton variant="secondary" onClick={newChallenge}>
              چالش تازه
            </SimButton>
            <SimButton variant="ghost" onClick={() => setChal(null)}>
              بازگشت به کاوشگر
            </SimButton>
            <span className="text-xs text-muted-foreground">مقدار این توان چند است؟</span>
            <Tex tex={`${chal.a}^{\\frac{${chal.m}}{${chal.n}}}`} />
          </div>
          <div className="flex flex-wrap gap-2">
            {chal.choices.map((v) => (
              <SimButton key={v} variant="outline" onClick={() => pick(v)}>
                {fmt(v, 2)}
              </SimButton>
            ))}
          </div>
          <p role="status" className="text-xs font-medium">
            {chal.status === 'won'
              ? `آفرین! پاسخ ${chal.answer} بود: (ریشهٔ ${chal.n}ام از ${chal.a}) به توان ${chal.m}.`
              : chal.status === 'lost'
                ? 'اشتباه شد؛ اول ریشهٔ nام را پیدا کن، بعد به توان m برسان.'
                : 'با یکی از دو مسیر (اول ریشه یا اول توان) مقدار را حساب کن و گزینهٔ درست را انتخاب کن.'}
          </p>
        </>
      ) : (
        <>
          <Tex
            display
            tex={`${a}^{\\frac{${m}}{${n}}}=\\sqrt[${n}]{${a}^{${m}}}=\\left(\\sqrt[${n}]{${a}}\\right)^{${m}}`}
            className="text-base"
          />
          <div className="flex flex-wrap items-end gap-3">
            <SimSlider label="پایه a" value={a} min={0} max={10} step={1} onChange={setA} />
            <SimSlider label="صورت کسر m (توان)" value={m} min={1} max={5} step={1} onChange={setM} />
            <SimSlider label="مخرج کسر n (اندیس ریشه)" value={n} min={2} max={6} step={1} onChange={setN} />
            <SimButton variant="secondary" onClick={newChallenge}>
              شروع چالش
            </SimButton>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Readout label="۱) ریشه: ⁿ√a" value={fmt(r0, 3)} tone="text-teal-300" />
            <Readout label="۲) توان: (ⁿ√a)^m" value={fmt(pathA, 3)} tone="text-teal-300" />
            <Readout label="۳) توان: a^m" value={fmt(am, 2)} tone="text-orange-300" />
            <Readout label="۴) ریشه: ⁿ√(a^m)" value={fmt(pathB, 3)} tone="text-orange-300" />
            <Readout label="a^(m/n)" value={fmt(val, 3)} tone="text-emerald-300" />
          </div>
          {n % 2 === 0 && (
            <p className="text-xs text-amber-400/90">
              اندیس زوج است؛ در این حالت تعریف ریشه لازم می‌کند a ≥ 0 باشد — اسلایدر از مقدار منفی جلوگیری می‌کند.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            هر دو مسیر همیشه به یک عدد می‌رسند؛ معمولاً «اول ریشه» آسان‌تر است چون عدد کوچک می‌شود (مثل 27^(2/3) = (∛27)² = 9).
          </p>
        </>
      )}
    </SimFrame>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// p4-algebraic-expressions · مدل مساحتی (a+b)² + بازی جمع جمله‌های متشابه
// ─────────────────────────────────────────────────────────────────────────────
interface P4Game {
  terms: Term[]
  correct: string
  choices: string[]
  status: 'idle' | 'won' | 'lost'
}

/** قالب یک جمله برای نمایش ساده در HTML (بدون KaTeX). */
function termHTML(c: number, p: number): string {
  const s = p === 1 ? 'x' : 'x²'
  if (c === 1) return s
  if (c === -1) return '−' + s
  return `${c}${s}`
}

function exprHTML(parts: Term[]): string {
  let out = ''
  for (const t of parts) {
    if (t.c === 0) continue
    const piece = termHTML(Math.abs(t.c), t.p)
    if (out === '') out = t.c < 0 ? '−' + piece : piece
    else out += t.c < 0 ? ' − ' + piece : ' + ' + piece
  }
  return out === '' ? '0' : out
}

/** همان عبارت به صورت TeX برای KaTeX. */
function exprTex(parts: Term[]): string {
  let out = ''
  for (const t of parts) {
    if (t.c === 0) continue
    const coef = Math.abs(t.c) === 1 ? '' : String(Math.abs(t.c))
    const piece = `${coef}x^{${t.p}}`
    if (out === '') out = (t.c < 0 ? '-' : '') + piece
    else out += (t.c < 0 ? ' - ' : ' + ') + piece
  }
  return out || '0'
}

function makeGame(t1: number, t2: number, t3: number, t4: number): P4Game {
  const terms: Term[] = [
    { c: t1, p: 2 },
    { c: t2, p: 1 },
    { c: t3, p: 2 },
    { c: t4, p: 1 },
  ]
  const C1 = t1 + t3
  const C2 = t2 + t4
  const correct = exprHTML([
    { c: C1, p: 2 },
    { c: C2, p: 1 },
  ])
  const cands = [
    exprHTML([
      { c: t1 - t3, p: 2 },
      { c: t2 + t4, p: 1 },
    ]), // فراموشی علامت منفی جملهٔ سوم
    exprHTML([
      { c: t1 + t3, p: 2 },
      { c: t2 - t4, p: 1 },
    ]), // خطای علامت جملهٔ چهارم
    exprHTML([{ c: t1 + t2 + t3 + t4, p: 1 }]), // جمع جمله‌های غیرمتشابه
    exprHTML([
      { c: t1 + t3, p: 2 },
      { c: t2 + t4, p: 2 },
    ]), // توان اشتباه
    exprHTML([
      { c: C1 + 1, p: 2 },
      { c: C2, p: 1 },
    ]),
    exprHTML([
      { c: C1, p: 2 },
      { c: C2 + 1, p: 1 },
    ]),
  ]
  const wrong: string[] = []
  for (const s of shuffle(cands)) {
    if (s !== correct && !wrong.includes(s)) wrong.push(s)
    if (wrong.length === 3) break
  }
  let k = 2
  while (wrong.length < 3) {
    const s = exprHTML([
      { c: C1 + k, p: 2 },
      { c: C2, p: 1 },
    ])
    if (s !== correct && !wrong.includes(s)) wrong.push(s)
    k++
  }
  return { terms, correct, choices: shuffle([correct, ...wrong]), status: 'idle' }
}

function randomGame(): P4Game {
  const t1 = randInt(-4, 5)
  const t2 = randInt(-5, 5)
  let t3 = randInt(-4, 4)
  let t4 = randInt(-5, 5)
  while (t1 + t3 === 0) t3 = randInt(-4, 4)
  while (t2 + t4 === 0) t4 = randInt(-5, 5)
  return makeGame(t1, t2, t3, t4)
}

function P4AlgebraicExpressions(_props: SimProps) {
  const beep = useSimBeep()
  const [a, setA] = useState(2)
  const [b, setB] = useState(3)
  const [game, setGame] = useState<P4Game>(() => makeGame(3, 2, -1, 4))

  const pick = (s: string) => {
    if (game.status !== 'idle') return
    if (s === game.correct) {
      setGame({ ...game, status: 'won' })
      sfxWin(beep)
    } else {
      setGame({ ...game, status: 'lost' })
      sfxLose(beep)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)
    ctx.textBaseline = 'middle'

    // ── نوار بازی جمع جمله‌های متشابه (بالای بوم) ──
    const stripH = 56
    if (game.status !== 'idle') {
      drawBanner(ctx, w, game.status === 'won', game.status === 'won' ? '✓ آفرین! ساده‌سازی درست بود' : '✗ اشتباه شد؛ جمله‌های متشابه را جدا کن')
    }
    ctx.font = FONT_FA
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.yellow
    ctx.fillText('چالش: جمله‌های متشابه را جمع کن', w - 16, stripH - 10)
    const ew = drawExpr(ctx, 0, 0, game.terms, '#000', 17, true)
    drawExpr(ctx, w / 2 - ew / 2, stripH + 14, game.terms, CANVAS.fg, 17)

    // ── مدل مساحتی (a+b)² ──
    const S = a + b
    const side = Math.min(w * 0.52, 224)
    const u = side / S
    const x0 = w / 2 - side / 2
    const y0 = Math.max(stripH + 40, (h - side) / 2 + 12)
    const xSplit = x0 + b * u // ستون چپ: b، ستون راست: a
    const ySplit = y0 + a * u // ردیف بالا: a، ردیف پایین: b

    const quad = (
      x: number, y: number, qw: number, qh: number,
      fill: string, stroke: string, sym: string, v: number,
    ) => {
      ctx.fillStyle = fill
      ctx.fillRect(x, y, qw, qh)
      ctx.strokeStyle = stroke
      ctx.lineWidth = 1.5
      ctx.strokeRect(x, y, qw, qh)
      if (qw >= 24 && qh >= 16) {
        const label = qw >= 80 ? `${sym} = ${v}` : sym
        ctx.font = `700 ${qw >= 60 ? 13 : 11}px ${MONO_FONT}`
        ctx.direction = 'ltr'
        ctx.textAlign = 'center'
        ctx.fillStyle = CANVAS.fg
        ctx.fillText(label, x + qw / 2, y + qh / 2)
      }
    }
    quad(xSplit, y0, a * u, a * u, 'rgba(245,158,11,0.3)', CANVAS.amber, 'a²', a * a)
    quad(x0, y0, b * u, a * u, 'rgba(20,184,166,0.3)', CANVAS.teal, 'ab', a * b)
    quad(xSplit, ySplit, a * u, b * u, 'rgba(20,184,166,0.3)', CANVAS.teal, 'ab', a * b)
    quad(x0, ySplit, b * u, b * u, 'rgba(139,92,246,0.3)', CANVAS.violet, 'b²', b * b)

    // outer border + dimension labels (a بالا-راست، b بالا-چپ)
    ctx.strokeStyle = 'rgba(250,250,249,0.55)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(x0, y0, side, side)
    ctx.font = FONT_MONO
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.muted
    ctx.fillText('a', xSplit + (a * u) / 2, y0 - 10)
    ctx.fillText('b', x0 + (b * u) / 2, y0 - 10)
    ctx.fillText('a', x0 + side + 12, y0 + (a * u) / 2)
    ctx.fillText('b', x0 + side + 12, ySplit + (b * u) / 2)

    // total area caption
    ctx.font = FONT_FA
    ctx.direction = 'rtl'
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.muted
    ctx.fillText('کل مساحت = (a+b)²', w / 2, Math.min(h - 14, y0 + side + 22))
  }, 380)

  return (
    <SimFrame
      title="مدل مساحتی اتحاد مربع دوجمله‌ای"
      brief="مربع به ضلع (a+b) را ببین: a² و b² و دو مستطیل ab — جمعشان همان اتحاد (a+b)² = a² + 2ab + b² است."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="مدل مساحتی اتحاد مربع دوجمله‌ای" />
      <div className="flex flex-wrap items-end gap-3">
        <SimSlider label="ضلع a" value={a} min={1} max={8} step={1} onChange={setA} />
        <SimSlider label="ضلع b" value={b} min={1} max={8} step={1} onChange={setB} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Readout label="a²" value={String(a * a)} tone="text-amber-300" />
        <Readout label="ab" value={String(a * b)} tone="text-teal-300" />
        <Readout label="b²" value={String(b * b)} tone="text-violet-300" />
        <Readout label="(a+b)²" value={String((a + b) ** 2)} tone="text-emerald-300" />
      </div>
      <Tex display tex={`(${a}+${b})^2=${a}^2+2\\times ${a}\\times ${b}+${b}^2=${(a + b) ** 2}`} className="text-base" />
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <Legend color={CANVAS.amber} label="مربع a²" />
        <Legend color={CANVAS.teal} label="دو مستطیل ab" />
        <Legend color={CANVAS.violet} label="مربع b²" />
      </div>
      <p className="text-xs text-muted-foreground">
        هشدار: (a+b)² با a²+b² برابر نیست! جملهٔ وسط 2ab را فراموش نکن؛ مثلاً (2+3)²=25 ولی 2²+3²=13.
      </p>
      <div className="rounded-lg border p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <SimButton variant="secondary" onClick={() => {
            setGame(randomGame())
            beep(520, 60, 'triangle', 0.03)
          }}>
            بازی تازه
          </SimButton>
          <span className="text-xs text-muted-foreground">شکل ساده‌شدهٔ این عبارت کدام است؟</span>
          <Tex tex={exprTex(game.terms)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {game.choices.map((s) => (
            <SimButton key={s} variant="outline" onClick={() => pick(s)}>
              {s}
            </SimButton>
          ))}
        </div>
        <p role="status" className="text-xs font-medium">
          {game.status === 'won'
            ? `آفرین! جمع ضریب‌های جمله‌های متشابه: ${game.correct}`
            : game.status === 'lost'
              ? 'اشتباه شد؛ فقط جمله‌هایی متشابه‌اند که بخش متغیری‌شان دقیقاً یکی باشد (x² با x² و x با x).'
              : 'جمله‌های x² را با هم و جمله‌های x را با هم جمع کن؛ ضریب‌ها جمع می‌شوند و توان ثابت می‌ماند.'}
        </p>
      </div>
    </SimFrame>
  )
}

// ─── registry ─────────────────────────────────────────────────────────────────
export const simsC3: Record<string, SimComponent> = {
  'p1-root-power': P1RootPower,
  'p2-nth-root': P2NthRoot,
  'p3-rational-powers': P3RationalPowers,
  'p4-algebraic-expressions': P4AlgebraicExpressions,
}
