// ─── Math Quest · فصل ۱ widgets: مجموعه‌ها، متمم، الگو، دنباله ────────────────
// Content agent Task 3-a — built entirely on sim-kit. simKey == lesson id.
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CANVAS,
  SimFrame,
  SimSlider,
  SimSelect,
  SimButton,
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
interface Pt {
  x: number
  y: number
}

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

const SUB_DIGITS = '₀₁₂₃₄₅₆₇₈₉'
function sub(n: number): string {
  return String(n)
    .split('')
    .map((c) => SUB_DIGITS[Number(c)] ?? c)
    .join('')
}

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

/** Fire the win jingle (respects the sound setting). */
function useWinBeep(beep: (freq?: number, ms?: number, type?: OscillatorType, gain?: number) => void, won: boolean) {
  const wonRef = useRef(false)
  useEffect(() => {
    const was = wonRef.current
    wonRef.current = won
    if (won && !was) {
      beep(660, 120)
      const id = window.setTimeout(() => beep(880, 160), 150)
      return () => window.clearTimeout(id)
    }
  }, [won, beep])
}

// ─────────────────────────────────────────────────────────────────────────────
// g1-sets · آزمایشگاه مجموعه‌ها: Venn + عضویت + متناهی/نامتناهی
// ─────────────────────────────────────────────────────────────────────────────
type G1State = 0 | 1 | 2 | 3 // بیرون / فقط A / فقط B / هر دو
const G1_NEXT: Record<G1State, G1State> = { 0: 1, 1: 3, 3: 2, 2: 0 }
const G1_EL = 12
const G1_A: [number, number][] = [
  [-0.5, -0.5], [-0.65, -0.1], [-0.5, 0.35], [-0.3, -0.65], [-0.2, 0.6], [-0.12, -0.3],
  [-0.35, 0.1], [-0.6, 0.5], [-0.25, -0.15], [-0.45, 0.55], [-0.15, 0.3], [-0.3, -0.45],
]
const G1_B: [number, number][] = G1_A.map(([ox, oy]) => [-ox, oy])
const G1_L: [number, number][] = [[0, -0.35], [0, -0.175], [0, 0], [0, 0.175], [0, 0.35]]

function g1Layout(w: number, h: number) {
  const R = Math.min(h * 0.3, w * 0.24)
  const cy = h * 0.55
  const gap = 0.62 * R
  return { R, cy, cx1: w / 2 - gap, cx2: w / 2 + gap, midX: w / 2 }
}

function g1Targets(members: Record<number, G1State>, w: number, h: number): Record<number, Pt> {
  const { R, cy, cx1, cx2, midX } = g1Layout(w, h)
  const aOnly: number[] = []
  const bOnly: number[] = []
  const lens: number[] = []
  const out: number[] = []
  for (let i = 1; i <= G1_EL; i++) {
    const s = members[i] ?? 0
    if (s === 1) aOnly.push(i)
    else if (s === 2) bOnly.push(i)
    else if (s === 3) lens.push(i)
    else out.push(i)
  }
  const t: Record<number, Pt> = {}
  aOnly.forEach((el, j) => {
    const [ox, oy] = G1_A[j % G1_A.length]
    t[el] = { x: cx1 + ox * R, y: cy + oy * R }
  })
  bOnly.forEach((el, j) => {
    const [ox, oy] = G1_B[j % G1_B.length]
    t[el] = { x: cx2 + ox * R, y: cy + oy * R }
  })
  lens.forEach((el, j) => {
    const [ox, oy] = G1_L[j % G1_L.length]
    t[el] = { x: midX + ox * R, y: cy + oy * R }
  })
  out.forEach((el, j) => {
    t[el] = j < 6 ? { x: w * (0.07 + 0.172 * j), y: h * 0.09 } : { x: w * (0.07 + 0.172 * (j - 6)), y: h * 0.93 }
  })
  return t
}

function G1Sets() {
  const beep = useSimBeep()
  const reduced = useReducedMotion()
  const [mode, setMode] = useState<'finite' | 'infinite'>('finite')
  const [members, setMembers] = useState<Record<number, G1State>>(() => {
    const m: Record<number, G1State> = {}
    for (let i = 1; i <= G1_EL; i++) m[i] = 0
    m[2] = 1
    m[4] = 1
    m[7] = 1
    m[3] = 2
    m[6] = 2
    m[9] = 2
    return m
  })
  const [nCount, setNCount] = useState(5)
  const [target, setTarget] = useState(3)
  const posRef = useRef<Record<number, Pt>>({})

  const { countA, countB, countLens } = useMemo(() => {
    let a = 0
    let b = 0
    let l = 0
    for (let i = 1; i <= G1_EL; i++) {
      const s = members[i] ?? 0
      if (s === 1 || s === 3) a++
      if (s === 2 || s === 3) b++
      if (s === 3) l++
    }
    return { countA: a, countB: b, countLens: l }
  }, [members])
  const equalAB = useMemo(() => {
    for (let i = 1; i <= G1_EL; i++) {
      const s = members[i] ?? 0
      if ((s === 1 || s === 3) !== (s === 2 || s === 3)) return false
    }
    return true
  }, [members])
  const won = equalAB && countA === target && countA > 0
  useWinBeep(beep, won)

  const { canvasRef } = useSimCanvas((ctx, w, h, _t, dt) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)
    ctx.textBaseline = 'middle'

    if (mode === 'infinite') {
      ctx.strokeStyle = CANVAS.muted
      ctx.lineWidth = 2
      const y = h * 0.46
      ctx.beginPath()
      ctx.moveTo(w * 0.07, y)
      ctx.lineTo(w * 0.93, y)
      ctx.moveTo(w * 0.93, y)
      ctx.lineTo(w * 0.93 - 12, y - 6)
      ctx.moveTo(w * 0.93, y)
      ctx.lineTo(w * 0.93 - 12, y + 6)
      ctx.stroke()
      ctx.font = FONT_MONO
      ctx.fillStyle = CANVAS.fg
      ctx.direction = 'ltr'
      ctx.textAlign = 'center'
      ctx.fillText('N = {1, 2, 3, …}', w / 2, 34)
      const step = (w * 0.72) / 9
      for (let i = 1; i <= 10; i++) {
        const x = w * 0.12 + (i - 1) * step
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = CANVAS.emerald
        ctx.fill()
        ctx.font = FONT_MONO
        ctx.fillStyle = CANVAS.fg
        ctx.fillText(String(i), x, y + 26)
      }
      ctx.font = FONT_MONO
      ctx.fillStyle = CANVAS.muted
      ctx.fillText('⋯', w * 0.9, y)
      // amber bracket over the counted part
      const xn = Math.min(nCount, 10)
      const xa = w * 0.12
      const xb = w * 0.12 + (xn - 1) * step
      const y2 = y + 46
      ctx.strokeStyle = CANVAS.amber
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(xa, y2)
      ctx.lineTo(xb, y2)
      ctx.moveTo(xa, y2 - 7)
      ctx.lineTo(xa, y2 + 7)
      ctx.moveTo(xb, y2 - 7)
      ctx.lineTo(xb, y2 + 7)
      ctx.stroke()
      ctx.font = FONT_FA
      ctx.fillStyle = CANVAS.amber
      ctx.direction = 'rtl'
      ctx.fillText(`شمرده‌شده: ${nCount} عضو`, (xa + xb) / 2, y2 + 24)
      ctx.fillStyle = CANVAS.muted
      ctx.font = FONT_FA
      ctx.fillText('هرچقدر جلو بروی، شمارش تمام نمی‌شود؛ پس N نامتناهی است.', w / 2, h - 26)
      return
    }

    // ── finite view: U + دو دایره ──
    ctx.strokeStyle = CANVAS.muted
    ctx.lineWidth = 1.5
    rr(ctx, 8, 8, w - 16, h - 16, 14)
    ctx.stroke()
    ctx.font = FONT_FA
    ctx.fillStyle = CANVAS.muted
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'
    ctx.fillText('جهان U', w - 24, 26)

    const { R, cy, cx1, cx2 } = g1Layout(w, h)
    const circle = (cx: number, color: string) => {
      ctx.globalAlpha = 0.1
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.stroke()
    }
    circle(cx1, CANVAS.amber)
    circle(cx2, CANVAS.violet)
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.font = '800 16px Vazirmatn, Tahoma, sans-serif'
    ctx.fillStyle = CANVAS.amber
    ctx.fillText('A', cx1, cy - R - 14)
    ctx.fillStyle = CANVAS.violet
    ctx.fillText('B', cx2, cy - R - 14)

    const targets = g1Targets(members, w, h)
    for (let i = 1; i <= G1_EL; i++) {
      const tg = targets[i]
      const p = posRef.current[i] ?? { ...tg }
      if (reduced) {
        p.x = tg.x
        p.y = tg.y
      } else {
        const k = Math.min(1, dt * 7)
        p.x += (tg.x - p.x) * k
        p.y += (tg.y - p.y) * k
      }
      posRef.current[i] = p
      const s = members[i] ?? 0
      const fill = s === 0 ? CANVAS.panelLight : s === 1 ? CANVAS.amber : s === 2 ? CANVAS.violet : CANVAS.emerald
      ctx.beginPath()
      ctx.arc(p.x, p.y, 11, 0, Math.PI * 2)
      ctx.fillStyle = fill
      ctx.fill()
      ctx.strokeStyle = s === 0 ? 'rgba(250,250,249,0.35)' : 'rgba(28,25,23,0.55)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.font = FONT_MONO
      ctx.fillStyle = s === 2 ? CANVAS.fg : s === 0 ? CANVAS.fg : '#1c1917'
      ctx.direction = 'ltr'
      ctx.fillText(String(i), p.x, p.y + 1)
    }
    if (won) drawBanner(ctx, w, true, '✓ چالش حل شد!')
  }, 380)

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== 'finite') return
    const c = canvasRef.current
    if (!c) return
    const { x, y } = canvasPos(e, c)
    const targets = g1Targets(members, c.clientWidth || 640, c.clientHeight || 380)
    let hit = 0
    for (let i = 1; i <= G1_EL; i++) {
      const p = posRef.current[i] ?? targets[i]
      if (Math.hypot(p.x - x, p.y - y) < 16) {
        hit = i
        break
      }
    }
    if (hit) {
      const cur = members[hit] ?? 0
      setMembers((m) => ({ ...m, [hit]: G1_NEXT[cur] }))
      beep(560, 45, 'triangle', 0.03)
    }
  }

  return (
    <SimFrame title="آزمایشگاه مجموعه‌ها" brief="روی نقطه‌ها کلیک کن تا عضو A یا B شوند؛ تساوی و شمارش را زنده ببین.">
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        className="w-full cursor-pointer rounded-lg border"
        aria-label="نمودار ون تعاملی مجموعه‌های A و B در جهان U"
      />
      <div className="flex flex-wrap items-center gap-2">
        <SimSelect
          label="حالت"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'finite', label: 'مجموعه‌های متناهی — دایره‌ها' },
            { value: 'infinite', label: 'مجموعهٔ نامتناهی N — عدد خط' },
          ]}
        />
        {mode === 'infinite' ? (
          <>
            <SimSlider label="چند عضو شمرده شود؟" value={nCount} min={1} max={10} step={1} onChange={setNCount} />
            <Readout label="شمرده‌شده" value={String(nCount)} unit="عضو" tone="text-emerald-300" />
          </>
        ) : (
          <>
            <Readout label="اعضای A" value={String(countA)} tone="text-amber-300" />
            <Readout label="اعضای B" value={String(countB)} tone="text-violet-300" />
            <Readout label="اعضای مشترک" value={String(countLens)} tone="text-emerald-300" />
            <Readout label="A = B ؟" value={equalAB ? 'بله' : 'خیر'} tone={equalAB ? 'text-emerald-300' : undefined} />
            <SimButton
              variant="secondary"
              onClick={() => {
                setTarget(randInt(2, 4))
                beep(520, 60, 'triangle', 0.03)
              }}
            >
              چالش تازه
            </SimButton>
          </>
        )}
      </div>
      {mode === 'finite' && (
        <>
          <p role="status" className="text-xs font-medium">
            {won
              ? `آفرین! A و B برابر شدند و ${target} عضو دارند.`
              : `چالش: مجموعه‌های A و B را مساوی کن، به‌طوری که هرکدام دقیقاً ${target} عضو داشته باشند (عضوهای مشترک).`}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Legend color={CANVAS.amber} label="فقط عضو A" />
            <Legend color={CANVAS.violet} label="فقط عضو B" />
            <Legend color={CANVAS.emerald} label="عضو هر دو (اشتراک)" />
            <Legend color={CANVAS.white} label="بیرون از هر دو" />
          </div>
          <p className="text-xs text-muted-foreground">
            با هر کلیک، نقطه یک عضویت می‌گیرد یا می‌بازد: بیرون ← عضو A ← عضو هر دو ← عضو B ← بیرون. یادت باشد ترتیب و تکرار در تساوی مجموعه‌ها اهمیتی ندارد!
          </p>
        </>
      )}
      {mode === 'infinite' && (
        <p className="text-xs text-muted-foreground">
          هر عدد طبیعی، عضو بعدی را دارد؛ برای همین شمارش اعضای N هیچ‌وقت به پایان نمی‌رسد و مجموعه نامتناهی است.
        </p>
      )}
    </SimFrame>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// g2-complement · ماشین سایه‌بان متمم
// ─────────────────────────────────────────────────────────────────────────────
type Shade = 'A' | 'Ap' | 'AU' | 'AI' | 'U' | 'E'
const G2_N = 10

function g2Layout(w: number, h: number) {
  const R = Math.min(h * 0.36, w * 0.3)
  return { R, cx: w * 0.66, cy: h * 0.53 }
}

function g2Targets(members: boolean[], w: number, h: number): Record<number, Pt> {
  const { R, cx, cy } = g2Layout(w, h)
  const inside: number[] = []
  const outside: number[] = []
  for (let i = 1; i <= G2_N; i++) (members[i - 1] ? inside : outside).push(i)
  const t: Record<number, Pt> = {}
  inside.forEach((el, j) => {
    const rad = 0.58 * R * Math.sqrt((j + 0.6) / G2_N)
    const ang = 0.7 + j * 2.4
    t[el] = { x: cx + rad * Math.cos(ang), y: cy + rad * Math.sin(ang) }
  })
  outside.forEach((el, j) => {
    const col = j % 2
    const row = Math.floor(j / 2)
    t[el] = { x: w * (0.1 + 0.11 * col), y: h * (0.16 + 0.17 * row) }
  })
  return t
}

function G2Complement() {
  const beep = useSimBeep()
  const reduced = useReducedMotion()
  const [members, setMembers] = useState<boolean[]>(() => Array.from({ length: G2_N }, (_, i) => i % 2 === 0))
  const [shade, setShade] = useState<Shade>('Ap')
  const [target, setTarget] = useState(6)
  const posRef = useRef<Record<number, Pt>>({})

  const countA = members.filter(Boolean).length
  const countAp = G2_N - countA
  const won = countAp === target
  useWinBeep(beep, won)

  const { canvasRef } = useSimCanvas((ctx, w, h, _t, dt) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)
    ctx.textBaseline = 'middle'

    ctx.strokeStyle = CANVAS.muted
    ctx.lineWidth = 1.5
    rr(ctx, 8, 8, w - 16, h - 16, 14)
    ctx.stroke()
    ctx.font = FONT_FA
    ctx.fillStyle = CANVAS.muted
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'
    ctx.fillText('جهان U', w - 24, 26)

    const { R, cx, cy } = g2Layout(w, h)

    // ── shading ──
    ctx.save()
    if (shade === 'A') {
      ctx.globalAlpha = 0.3
      ctx.fillStyle = CANVAS.amber
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()
    } else if (shade === 'Ap') {
      ctx.globalAlpha = 0.28
      ctx.fillStyle = CANVAS.rose
      ctx.beginPath()
      ctx.rect(9, 9, w - 18, h - 18)
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill('evenodd')
    } else if (shade === 'AU') {
      ctx.globalAlpha = 0.16
      ctx.fillStyle = CANVAS.emerald
      ctx.beginPath()
      ctx.rect(9, 9, w - 18, h - 18)
      ctx.fill()
    } else if (shade === 'U') {
      ctx.globalAlpha = 0.08
      ctx.fillStyle = CANVAS.white
      ctx.beginPath()
      ctx.rect(9, 9, w - 18, h - 18)
      ctx.fill()
    }
    ctx.restore()

    // ── circle A + labels ──
    ctx.strokeStyle = CANVAS.amber
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.stroke()
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.font = '800 15px Vazirmatn, Tahoma, sans-serif'
    ctx.fillStyle = CANVAS.amber
    ctx.fillText('A', cx, cy - R + 20)
    ctx.fillStyle = CANVAS.rose
    ctx.direction = 'ltr'
    ctx.fillText('A′', w * 0.15, h * 0.09)

    if (shade === 'AI' || shade === 'E') {
      ctx.font = '700 44px ui-monospace, monospace'
      ctx.fillStyle = 'rgba(244,63,94,0.85)'
      ctx.fillText('∅', w * 0.33, h * 0.48)
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.fillStyle = CANVAS.muted
      ctx.fillText(
        shade === 'AI' ? 'اشتراک A و متممش تهی است: A ∩ A′ = ∅' : 'هیچ ناحیه‌ای رنگ نمی‌شود: مجموعهٔ تهی',
        w * 0.33,
        h * 0.6,
      )
    }

    // ── dots ──
    const targets = g2Targets(members, w, h)
    for (let i = 1; i <= G2_N; i++) {
      const tg = targets[i]
      const p = posRef.current[i] ?? { ...tg }
      if (reduced) {
        p.x = tg.x
        p.y = tg.y
      } else {
        const k = Math.min(1, dt * 7)
        p.x += (tg.x - p.x) * k
        p.y += (tg.y - p.y) * k
      }
      posRef.current[i] = p
      const m = !!members[i - 1]
      ctx.beginPath()
      ctx.arc(p.x, p.y, 11, 0, Math.PI * 2)
      ctx.fillStyle = m ? CANVAS.amber : CANVAS.panelLight
      ctx.fill()
      ctx.strokeStyle = m ? 'rgba(28,25,23,0.55)' : 'rgba(250,250,249,0.35)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.font = FONT_MONO
      ctx.fillStyle = m ? '#1c1917' : CANVAS.fg
      ctx.direction = 'ltr'
      ctx.fillText(String(i), p.x, p.y + 1)
    }
    if (won) drawBanner(ctx, w, true, '✓ چالش حل شد!')
  }, 380)

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current
    if (!c) return
    const { x, y } = canvasPos(e, c)
    const targets = g2Targets(members, c.clientWidth || 640, c.clientHeight || 380)
    let hit = 0
    for (let i = 1; i <= G2_N; i++) {
      const p = posRef.current[i] ?? targets[i]
      if (Math.hypot(p.x - x, p.y - y) < 16) {
        hit = i
        break
      }
    }
    if (hit) {
      setMembers((m) => m.map((v, idx) => (idx === hit - 1 ? !v : v)))
      beep(500, 40, 'triangle', 0.03)
    }
  }

  const laws = ["A \\cup A' = U", "A \\cap A' = \\varnothing", "(A')' = A", "U' = \\varnothing", "\\varnothing' = U"]

  return (
    <SimFrame title="ماشین سایه‌بان متمم" brief="ناحیهٔ دلخواه را رنگ کن و با کلیک روی نقطه‌ها ببین متمم چطور جابه‌جا می‌شود.">
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        className="w-full cursor-pointer rounded-lg border"
        aria-label="نمودار ون تعاملی متمم مجموعهٔ A در جهان U"
      />
      <div className="flex flex-wrap items-center gap-2">
        <SimSelect<Shade>
          label="ناحیهٔ رنگی"
          value={shade}
          onChange={setShade}
          options={[
            { value: 'A', label: 'خودِ A' },
            { value: 'Ap', label: 'متمم A′' },
            { value: 'AU', label: 'اجتماع A ∪ A′' },
            { value: 'AI', label: 'اشتراک A ∩ A′' },
            { value: 'U', label: 'کل جهان U' },
            { value: 'E', label: 'هیچ (تهی)' },
          ]}
        />
        <Readout label="اعضای A" value={String(countA)} tone="text-amber-300" />
        <Readout label="اعضای A′" value={String(countAp)} tone="text-rose-300" />
        <Readout label="اعضای U" value={String(G2_N)} />
        <SimButton
          variant="secondary"
          onClick={() => {
            setTarget(randInt(1, 9))
            beep(520, 60, 'triangle', 0.03)
          }}
        >
          چالش تازه
        </SimButton>
      </div>
      <p role="status" className="text-xs font-medium">
        {won
          ? `آفرین! الان دقیقاً ${target} عضو بیرون از A مانده‌اند؛ یعنی |A′| = ${target}.`
          : `چالش: A را طوری تنظیم کن که ${target} عضو در متمم بماند (|A′| = ${target}).`}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {laws.map((s) => (
          <span key={s} className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-xs">
            <Tex tex={s} />
            <span className="text-emerald-500" aria-hidden>
              ✓
            </span>
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        نکته: عضوی مثل ۱۰ می‌تواند زوج باشد ولی عضو A′ شود — متمم یعنی «هرچه در A نیست»، نه «اعداد فرد»!
      </p>
    </SimFrame>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// g3-patterns · ماشین الگو: کبریت/نقطه + چالش جملهٔ بعدی
// ─────────────────────────────────────────────────────────────────────────────
type G3Pattern = 'tri' | 'sq' | 'dots'
const G3_COUNT: Record<G3Pattern, (n: number) => number> = {
  tri: (n) => 2 * n + 1,
  sq: (n) => 3 * n + 1,
  dots: (n) => n * n,
}
const G3_TEX: Record<G3Pattern, string> = {
  tri: 'a_n = 2n + 1',
  sq: 'a_n = 3n + 1',
  dots: 'a_n = n^2',
}
const G3_PLAIN: Record<G3Pattern, string> = {
  tri: 'aₙ = 2n + 1',
  sq: 'aₙ = 3n + 1',
  dots: 'aₙ = n²',
}
const G3_NAME: Record<G3Pattern, string> = {
  tri: 'مثلث‌های چوب‌کبریت',
  sq: 'مربع‌های چوب‌کبریت',
  dots: 'نقطه‌های مربعی',
}

interface G3Chal {
  pattern: G3Pattern
  m: number
  answer: number
  choices: number[]
  status: 'idle' | 'won' | 'lost'
}

function g3NewChallenge(): G3Chal {
  const pattern = (['tri', 'sq', 'dots'] as G3Pattern[])[randInt(0, 2)]
  const m = randInt(5, 6)
  const f = G3_COUNT[pattern]
  const answer = f(m)
  const pool = shuffle([answer + 1, answer - 1, answer + 2, answer - 2, answer + 3, f(m - 1), f(m + 1)])
  const wrong: number[] = []
  for (const v of pool) {
    if (v !== answer && v > 0 && !wrong.includes(v)) wrong.push(v)
    if (wrong.length === 3) break
  }
  let extra = 1
  while (wrong.length < 3) {
    const v = answer + extra
    if (v !== answer && !wrong.includes(v)) wrong.push(v)
    extra++
  }
  return { pattern, m, answer, choices: shuffle([answer, ...wrong]), status: 'idle' }
}

function G3Patterns() {
  const beep = useSimBeep()
  const [pattern, setPattern] = useState<G3Pattern>('sq')
  const [n, setN] = useState(3)
  const [chal, setChal] = useState<G3Chal | null>(null)
  const count = G3_COUNT[pattern](n)

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)
    ctx.textBaseline = 'middle'

    const hasBanner = chal !== null && chal.status !== 'idle'
    if (chal && chal.status !== 'idle') {
      drawBanner(ctx, w, chal.status === 'won', chal.status === 'won' ? '✓ آفرین! پاسخ درست بود' : '✗ اشتباه شد؛ دوباره تلاش کن')
    }
    const top = hasBanner ? 58 : 14

    ctx.font = FONT_FA
    ctx.fillStyle = CANVAS.muted
    ctx.direction = 'rtl'
    ctx.textAlign = 'left'
    ctx.fillText(G3_NAME[pattern], 18, top + 8)

    ctx.direction = 'ltr'
    ctx.textAlign = 'left'
    ctx.font = FONT_MONO
    ctx.fillStyle = CANVAS.muted
    ctx.fillText(G3_PLAIN[pattern], 18, h - 22)
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.fg
    ctx.font = '700 15px ui-monospace, monospace'
    ctx.fillText(`a${sub(n)} = ${count}`, w - 18, h - 22)

    const amber = CANVAS.amber
    ctx.strokeStyle = amber
    ctx.lineWidth = 5
    ctx.lineCap = 'round'

    if (pattern === 'tri') {
      const s = Math.min(130, (w - 130) / n, (h - top - 70) / 0.95)
      const hs = 0.866 * s
      const x0 = (w - n * s) / 2
      const y0 = top + (h - top - 50 + hs) / 2
      const segs = new Set<string>()
      const add = (ax: number, ay: number, bx: number, by: number) => {
        const k1 = `${Math.round(ax)},${Math.round(ay)}`
        const k2 = `${Math.round(bx)},${Math.round(by)}`
        const key = k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`
        if (!segs.has(key)) {
          segs.add(key)
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(bx, by)
          ctx.stroke()
        }
      }
      for (let j = 1; j <= n; j++) {
        if (j % 2 === 1) {
          const m2 = (j - 1) / 2
          const bmx = x0 + m2 * s
          const bmx1 = x0 + (m2 + 1) * s
          const tmx = x0 + (m2 + 0.5) * s
          add(bmx, y0, bmx1, y0)
          add(bmx, y0, tmx, y0 - hs)
          add(bmx1, y0, tmx, y0 - hs)
        } else {
          const m2 = j / 2 - 1
          const tmx = x0 + (m2 + 0.5) * s
          const tmx1 = x0 + (m2 + 1.5) * s
          const bmx1 = x0 + (m2 + 1) * s
          add(tmx, y0 - hs, tmx1, y0 - hs)
          add(bmx1, y0, tmx1, y0 - hs)
        }
      }
    } else if (pattern === 'sq') {
      const s = Math.min(110, (w - 130) / n, h - top - 70)
      const x0 = (w - n * s) / 2
      const y0 = top + (h - top - 50 - s) / 2
      for (let i = 0; i <= n; i++) {
        ctx.beginPath()
        ctx.moveTo(x0 + i * s, y0)
        ctx.lineTo(x0 + i * s, y0 + s)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x0 + n * s, y0)
      ctx.moveTo(x0, y0 + s)
      ctx.lineTo(x0 + n * s, y0 + s)
      ctx.stroke()
    } else {
      const sd = Math.min(46, (w - 130) / n, (h - top - 70) / n)
      const x0 = (w - (n - 1) * sd) / 2
      const y0 = top + (h - top - 50 - (n - 1) * sd) / 2
      ctx.fillStyle = CANVAS.violet
      for (let r2 = 0; r2 < n; r2++) {
        for (let c2 = 0; c2 < n; c2++) {
          ctx.beginPath()
          ctx.arc(x0 + c2 * sd, y0 + r2 * sd, 8, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  }, 380)

  return (
    <SimFrame title="ماشین الگو" brief="الگو را انتخاب و شکل nام را بساز؛ سپس در چالش، جملهٔ بعدی را حدس بزن.">
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="نمایش تعاملی الگوی شکل‌دار" />
      <div className="flex flex-wrap items-center gap-3">
        <SimSelect<G3Pattern>
          label="الگو"
          value={pattern}
          onChange={setPattern}
          options={[
            { value: 'tri', label: G3_NAME.tri },
            { value: 'sq', label: G3_NAME.sq },
            { value: 'dots', label: G3_NAME.dots },
          ]}
        />
        <SimSlider label="شکل nام" value={n} min={1} max={8} step={1} onChange={setN} />
        <Readout label={`جملهٔ ${n}ام`} value={String(count)} tone="text-amber-300" />
        <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">جملهٔ عمومی</span>
          <Tex tex={G3_TEX[pattern]} />
        </div>
      </div>
      <div className="rounded-lg border p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <SimButton variant="secondary" onClick={() => setChal(g3NewChallenge())}>
            چالش تازه
          </SimButton>
          {chal && (
            <span className="text-xs text-muted-foreground">
              پرسش: جملهٔ {chal.m}ام الگوی «{G3_NAME[chal.pattern]}» چند است؟
            </span>
          )}
        </div>
        {chal && (
          <div className="flex flex-wrap gap-2">
            {chal.choices.map((v) => (
              <SimButton
                key={v}
                variant="outline"
                onClick={() => {
                  if (v === chal.answer) {
                    setChal({ ...chal, status: 'won' })
                    beep(660, 120)
                    window.setTimeout(() => beep(880, 160), 150)
                  } else {
                    setChal({ ...chal, status: 'lost' })
                    beep(220, 180, 'square', 0.03)
                  }
                }}
              >
                {v}
              </SimButton>
            ))}
          </div>
        )}
        <p role="status" className="text-xs font-medium">
          {!chal
            ? 'اگر آماره‌ای، «چالش تازه» را بزن: چند جمله از یک الگو را می‌بینی و باید جملهٔ بعدی را پیدا کنی.'
            : chal.status === 'won'
              ? `آفرین! پاسخ درست ${chal.answer} بود.`
              : chal.status === 'lost'
                ? 'اشتباه شد؛ اول جدول اختلاف‌ها را بساز، بعد دوباره امتحان کن.'
                : 'از روی جملات اول، الگو را کشف کن و گزینهٔ درست را انتخاب کن.'}
        </p>
      </div>
    </SimFrame>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// g4-sequences · کاوشگر حسابی/هندسی + چالش مجموع
// ─────────────────────────────────────────────────────────────────────────────
type G4Type = 'ap' | 'gp'
interface G4Chal {
  terms: number[] // t1..t5
  answer: number // S5
  choices: number[]
  status: 'idle' | 'won' | 'lost'
}

function G4Sequences() {
  const beep = useSimBeep()
  const [type, setType] = useState<G4Type>('ap')
  const [a1, setA1] = useState(5)
  const [d, setD] = useState(3)
  const [r, setR] = useState(2)
  const [n, setN] = useState(6)
  const [mode, setMode] = useState<'explore' | 'chal'>('explore')
  const [chal, setChal] = useState<G4Chal | null>(null)

  const terms = useMemo(() => {
    const arr: number[] = []
    for (let i = 1; i <= 10; i++) arr.push(type === 'ap' ? a1 + (i - 1) * d : a1 * Math.pow(r, i - 1))
    return arr
  }, [type, a1, d, r])
  const an = terms[n - 1] ?? 0
  const sn = useMemo(() => {
    if (type === 'ap') return (n * (2 * a1 + (n - 1) * d)) / 2
    if (r === 1) return n * a1
    return (a1 * (1 - Math.pow(r, n))) / (1 - r)
  }, [type, a1, d, r, n])

  const newChallenge = () => {
    const t: G4Type = Math.random() < 0.5 ? 'ap' : 'gp'
    let tms: number[]
    let answer: number
    if (t === 'ap') {
      const s1 = randInt(1, 12)
      const dd = randInt(2, 6)
      tms = [0, 1, 2, 3, 4].map((i) => s1 + i * dd)
      answer = (5 * (tms[0] + tms[4])) / 2
    } else {
      const s1 = randInt(1, 5)
      const rr2 = Math.random() < 0.5 ? 2 : 3
      tms = [0, 1, 2, 3, 4].map((i) => s1 * Math.pow(rr2, i))
      answer = (s1 * (Math.pow(rr2, 5) - 1)) / (rr2 - 1)
    }
    const pool = shuffle([answer + 3, answer - 3, answer + 7, answer - 7, tms[4], answer + tms[0]])
    const wrong: number[] = []
    for (const v of pool) {
      if (v !== answer && v > 0 && !wrong.includes(v)) wrong.push(v)
      if (wrong.length === 3) break
    }
    let extra = 1
    while (wrong.length < 3) {
      const v = answer + extra
      if (v !== answer && !wrong.includes(v)) wrong.push(v)
      extra++
    }
    setChal({ terms: tms, answer, choices: shuffle([answer, ...wrong]), status: 'idle' })
    setMode('chal')
    beep(520, 60, 'triangle', 0.03)
  }

  const pick = (v: number) => {
    if (!chal) return
    if (v === chal.answer) {
      setChal({ ...chal, status: 'won' })
      beep(660, 120)
      window.setTimeout(() => beep(880, 160), 150)
    } else {
      setChal({ ...chal, status: 'lost' })
      beep(220, 180, 'square', 0.03)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)
    ctx.textBaseline = 'middle'

    if (mode === 'explore') {
      ctx.font = FONT_FA
      ctx.direction = 'rtl'
      ctx.textAlign = 'right'
      ctx.fillStyle = type === 'ap' ? CANVAS.amber : CANVAS.teal
      ctx.fillText(type === 'ap' ? 'دنبالهٔ حسابی' : 'دنبالهٔ هندسی', w - 18, 22)
      ctx.direction = 'ltr'
      ctx.textAlign = 'left'
      ctx.font = FONT_MONO
      ctx.fillStyle = CANVAS.muted
      ctx.fillText(type === 'ap' ? `a₁ = ${a1},  d = ${d}` : `a₁ = ${a1},  r = ${fmtNum(r)}`, 18, 22)

      const y0 = h * 0.58
      const maxAbs = Math.max(1, ...terms.map(Math.abs))
      const step = (w - 60) / 10
      const barW = Math.min(26, step - 12)
      ctx.strokeStyle = CANVAS.muted
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(20, y0)
      ctx.lineTo(w - 20, y0)
      ctx.stroke()
      for (let i = 1; i <= 10; i++) {
        const x = 30 + (i - 0.5) * step
        const v = terms[i - 1] ?? 0
        const bh = (v / maxAbs) * (h * 0.4)
        ctx.fillStyle = type === 'ap' ? CANVAS.amber : CANVAS.teal
        if (Math.abs(bh) > 0.5) {
          ctx.fillRect(x - barW / 2, Math.min(y0, y0 - bh), barW, Math.max(1.5, Math.abs(bh)))
        }
        if (i === n) {
          ctx.strokeStyle = CANVAS.fg
          ctx.lineWidth = 2
          const hh = Math.max(8, Math.abs(bh))
          ctx.strokeRect(x - barW / 2 - 4, Math.min(y0, y0 - bh) - 4, barW + 8, hh + 8)
          ctx.strokeStyle = CANVAS.muted
          ctx.lineWidth = 1.5
        }
        ctx.font = '700 10px ui-monospace, monospace'
        ctx.direction = 'ltr'
        ctx.textAlign = 'center'
        ctx.fillStyle = CANVAS.fg
        ctx.fillText(fmtNum(v), x, bh >= 0 ? y0 - bh - 12 : y0 + Math.abs(bh) + 14)
      }
      ctx.font = '700 15px ui-monospace, monospace'
      ctx.direction = 'ltr'
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.emerald
      ctx.fillText(`S${sub(n)} = ${fmtNum(sn)}`, w / 2, h - 22)
      return
    }

    // ── challenge view ──
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'
    ctx.font = FONT_FA
    ctx.fillStyle = CANVAS.amber
    ctx.fillText('چالش مجموع', w - 18, 60)
    if (chal) {
      const hasBanner = chal.status !== 'idle'
      if (hasBanner) {
        drawBanner(ctx, w, chal.status === 'won', chal.status === 'won' ? '✓ آفرین! پاسخ درست بود' : '✗ اشتباه شد؛ دوباره تلاش کن')
      }
      const y = h * 0.42
      const gapx = Math.min(96, (w - 80) / 4)
      const x0 = w / 2 - (3 * gapx) / 2
      for (let i = 0; i < 4; i++) {
        const x = x0 + i * gapx
        ctx.beginPath()
        ctx.arc(x, y, 26, 0, Math.PI * 2)
        ctx.fillStyle = CANVAS.panelLight
        ctx.fill()
        ctx.strokeStyle = CANVAS.amber
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.font = '700 14px ui-monospace, monospace'
        ctx.direction = 'ltr'
        ctx.textAlign = 'center'
        ctx.fillStyle = CANVAS.fg
        ctx.fillText(fmtNum(chal.terms[i] ?? 0), x, y + 1)
      }
      ctx.font = '700 18px ui-monospace, monospace'
      ctx.fillStyle = CANVAS.muted
      ctx.fillText('⋯', x0 + 3 * gapx + gapx * 0.62, y)
      ctx.font = '600 14px Vazirmatn, Tahoma, sans-serif'
      ctx.direction = 'rtl'
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.fg
      ctx.fillText('مجموع ۵ جملهٔ اول چند است؟', w / 2, h * 0.68)
    }
  }, 380)

  return (
    <SimFrame title="کاوشگر دنباله‌ها" brief="پارامترها را جابه‌جا کن، جملهٔ nام و مجموع را ببین؛ بعد به چالش مجموع برو.">
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="نمودار میله‌ای جملات دنباله و مجموع آنها" />
      {mode === 'explore' ? (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <SimSelect<G4Type>
              label="نوع دنباله"
              value={type}
              onChange={setType}
              options={[
                { value: 'ap', label: 'حسابی' },
                { value: 'gp', label: 'هندسی' },
              ]}
            />
            <SimSlider label="جملهٔ اول a₁" value={a1} min={-5} max={10} step={1} onChange={setA1} />
            {type === 'ap' ? (
              <SimSlider label="قدر نسبت d" value={d} min={-5} max={8} step={1} onChange={setD} />
            ) : (
              <SimSlider label="نسبت مشترک r" value={r} min={-3} max={3} step={0.5} onChange={setR} format={fmtNum} />
            )}
            <SimSlider label="جملهٔ nام" value={n} min={1} max={10} step={1} onChange={setN} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Readout label={`جملهٔ ${n}ام`} value={fmtNum(an)} tone="text-amber-300" />
            <Readout label={`مجموع تا جملهٔ ${n}`} value={fmtNum(sn)} tone="text-emerald-300" />
            <Readout label={type === 'ap' ? 'قدر نسبت d' : 'نسبت مشترک r'} value={fmtNum(type === 'ap' ? d : r)} />
            <SimButton variant="secondary" onClick={newChallenge}>
              شروع چالش
            </SimButton>
          </div>
          {type === 'ap' && d === 0 && (
            <p className="text-xs text-amber-400/90">
              d = 0: دنباله ثابت است — همهٔ جمله‌ها برابر a₁ هستند و مجموع به‌صورت Sₙ = n·a₁ حساب می‌شود.
            </p>
          )}
          {type === 'gp' && r === 1 && (
            <p className="text-xs text-amber-400/90">
              r = 1: همهٔ جمله‌ها برابر a₁ هستند؛ فرمول کسر Sₙ = a₁(1−rⁿ)/(1−r) اینجا قابل استفاده نیست چون مخرج صفر می‌شود و مجموع را با Sₙ = n·a₁ می‌گیریم.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            میله‌ها جملات a₁ تا a₁₀ هستند و میلهٔ پررنگ‌شده، جملهٔ nام است. در دنبالهٔ هندسی با r منفی، علامت جملات یکی‌درمیان عوض می‌شود.
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <SimButton variant="secondary" onClick={newChallenge}>
              چالش تازه
            </SimButton>
            <SimButton variant="ghost" onClick={() => setMode('explore')}>
              بازگشت به آزمایشگاه
            </SimButton>
          </div>
          <p role="status" className="text-xs font-medium">
            {!chal
              ? 'الگوی چهار جملهٔ داده‌شده را پیدا کن و مجموع ۵ جملهٔ اول را حساب کن.'
              : chal.status === 'won'
                ? `آفرین! مجموع ۵ جملهٔ اول برابر ${chal.answer} بود.`
                : chal.status === 'lost'
                  ? 'اشتباه شد؛ جملهٔ پنجم را پیدا کن و دوباره جمع بزن.'
                  : 'به چهار جملهٔ روی صفحه نگاه کن: الگو را کشف کن، جملهٔ پنجم را بساز و جمع بزن.'}
          </p>
          {chal && (
            <div className="flex flex-wrap gap-2">
              {chal.choices.map((v) => (
                <SimButton key={v} variant="outline" onClick={() => pick(v)}>
                  {v}
                </SimButton>
              ))}
            </div>
          )}
        </>
      )}
    </SimFrame>
  )
}

// ─── registry ─────────────────────────────────────────────────────────────────
export const simsC1: Record<string, SimComponent> = {
  'g1-sets': G1Sets,
  'g2-complement': G2Complement,
  'g3-patterns': G3Patterns,
  'g4-sequences': G4Sequences,
}
