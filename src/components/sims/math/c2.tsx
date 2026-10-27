// ─── Math Quest · فصل ۲ widgets: مثلثات (agent 3-b) ──────────────────────────
'use client'

import { useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import {
  CANVAS,
  canvasPos,
  drawGrid,
  SimButton,
  SimFrame,
  SimSlider,
  SimToggle,
  Readout,
  Legend,
  useReducedMotion,
  useSimBeep,
  useSimCanvas,
} from '@/components/sims/sim-kit'
import type { SimComponent, SimProps } from '@/lib/game/types'
import { cn } from '@/lib/utils'

// ─── local helpers ────────────────────────────────────────────────────────────
const RAD = Math.PI / 180
const FA = 'Vazirmatn, Tahoma, sans-serif'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

function fmt(x: number, d = 2): string {
  if (!Number.isFinite(x)) return '—'
  let s = x.toFixed(d)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  return s === '-0' ? '0' : s
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Win/lose banner on the canvas. `pulse` ∈ [0,1]; pass 1 for reduced motion. */
function drawBanner(ctx: CanvasRenderingContext2D, w: number, ok: boolean, msg: string, pulse: number) {
  ctx.save()
  ctx.font = `600 13px ${FA}`
  ctx.direction = 'rtl'
  const tw = ctx.measureText(msg).width
  const bw = Math.max(200, tw + 32)
  const x = (w - bw) / 2
  const y = 10
  ctx.globalAlpha = 0.6 + 0.4 * pulse
  rr(ctx, x, y, bw, 34, 10)
  ctx.fillStyle = ok ? 'rgba(16,185,129,0.95)' : 'rgba(244,63,94,0.95)'
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.fillStyle = '#1c1917'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(msg, w / 2, y + 17)
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

/** Build 4 numeric MC options (correct first, then plausible distractors, shuffled). */
function makeNumOptions(correct: number, raw: number[]): { labels: string[]; correctIndex: number } {
  const opts: { v: number; ok: boolean }[] = [{ v: Math.round(correct * 100) / 100, ok: true }]
  const seen = (v: number) => opts.some((o) => Math.abs(o.v - v) < 0.05)
  for (const r of raw) {
    if (opts.length >= 4) break
    if (!Number.isFinite(r)) continue
    const v = Math.round(r * 100) / 100
    if (!seen(v)) opts.push({ v, ok: false })
  }
  let k = 1
  while (opts.length < 4 && k < 40) {
    const v = Math.round((correct + Math.ceil(k / 2) * (k % 2 === 1 ? 1 : -1)) * 100) / 100
    if (!seen(v)) opts.push({ v, ok: false })
    k++
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[opts[i], opts[j]] = [opts[j], opts[i]]
  }
  return { labels: opts.map((o) => fmt(o.v)), correctIndex: opts.findIndex((o) => o.ok) }
}

function makeStrOptions(correct: string, wrong: string[]): { labels: string[]; correctIndex: number } {
  const labels = shuffle([correct, ...wrong.slice(0, 3)])
  return { labels, correctIndex: labels.indexOf(correct) }
}

/** Shared 4-option grid for the mini-games. */
function OptionGrid({
  labels, correctIndex, picked, solved, onPick,
}: {
  labels: string[]
  correctIndex: number
  picked: number | null
  solved: boolean
  onPick: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {labels.map((lb, i) => {
        const reveal = picked !== null
        const isRight = i === correctIndex
        return (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            disabled={solved}
            className={cn(
              'rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
              reveal && isRight && 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              reveal && picked === i && !isRight && 'border-rose-500 bg-rose-500/10',
              !reveal && 'hover:border-primary/60 hover:bg-muted/50',
              reveal && !isRight && picked !== i && 'opacity-50',
              solved && 'cursor-default',
            )}
          >
            <bdi>{lb}</bdi>
          </button>
        )
      })}
    </div>
  )
}

// ─── درس ۱ · آزمایشگاه نسبت‌های مثلثاتی ──────────────────────────────────────
interface Challenge1 {
  theta: number
  hyp: number
  labels: string[]
  correctIndex: number
  picked: number | null
  solved: boolean
}

const EXACT_ANGLES: Record<number, string[]> = {
  30: ['sin 30° = 1/2', 'cos 30° = √3/2', 'tan 30° = √3/3'],
  45: ['sin 45° = √2/2', 'cos 45° = √2/2', 'tan 45° = 1'],
  60: ['sin 60° = √3/2', 'cos 60° = 1/2', 'tan 60° = √3'],
}

function T1TrigRatios(_props: SimProps) {
  const reduced = useReducedMotion()
  const beep = useSimBeep()
  const [theta, setTheta] = useState(30)
  const [exact, setExact] = useState(true)
  const [ch, setCh] = useState<Challenge1 | null>(null)

  const newChallenge = () => {
    const t = [30, 45, 60][Math.floor(Math.random() * 3)]
    const hyp = 4 + Math.floor(Math.random() * 9) // 4..12
    const opp = hyp * Math.sin(t * RAD)
    const adj = hyp * Math.cos(t * RAD)
    const pool = t === 45 ? [opp + 2, adj + 1, opp * 2, hyp] : [adj, hyp * Math.tan(t * RAD), opp + 2, hyp]
    const o = makeNumOptions(opp, pool)
    setCh({ theta: t, hyp, labels: o.labels, correctIndex: o.correctIndex, picked: null, solved: false })
  }

  const answer = (i: number) => {
    if (!ch || ch.solved || ch.picked !== null) return
    const ok = i === ch.correctIndex
    setCh({ ...ch, picked: i, solved: ok })
    if (ok) {
      beep(660, 120)
      beep(880, 160)
    } else {
      beep(180, 160, 'square', 0.03)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)

    const rad = theta * RAD
    const cx = w * 0.58
    const by = h * 0.8
    const R = Math.min(w * 0.46, h * 0.62)
    const adj = R * Math.cos(rad)
    const opp = R * Math.sin(rad)
    const A = { x: cx - adj, y: by }
    const B = { x: cx, y: by - opp }
    const C = { x: cx, y: by }

    // triangle fill
    ctx.beginPath()
    ctx.moveTo(A.x, A.y)
    ctx.lineTo(B.x, B.y)
    ctx.lineTo(C.x, C.y)
    ctx.closePath()
    ctx.fillStyle = 'rgba(20,184,166,0.13)'
    ctx.fill()

    // legs
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = CANVAS.teal
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(C.x, C.y); ctx.stroke()
    ctx.strokeStyle = CANVAS.emerald
    ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.lineTo(B.x, B.y); ctx.stroke()
    ctx.strokeStyle = CANVAS.amber
    ctx.lineWidth = 3.5
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke()

    // right-angle marker at C
    ctx.strokeStyle = CANVAS.muted
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(C.x - 14, C.y)
    ctx.lineTo(C.x - 14, C.y - 14)
    ctx.lineTo(C.x, C.y - 14)
    ctx.stroke()

    // angle arc at A
    ctx.strokeStyle = CANVAS.fg
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(A.x, A.y, 26, 0, -rad, true)
    ctx.stroke()
    ctx.font = `600 12px ${MONO}`
    ctx.direction = 'ltr'
    ctx.fillStyle = CANVAS.fg
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${theta}°`, A.x + 46 * Math.cos(rad / 2), A.y - 46 * Math.sin(rad / 2))

    // side labels (Persian)
    ctx.font = `600 13px ${FA}`
    ctx.direction = 'rtl'
    ctx.fillStyle = CANVAS.amber
    const mx = (A.x + B.x) / 2
    const my = (A.y + B.y) / 2
    ctx.textAlign = 'center'
    ctx.fillText('وتر', mx - 16 * Math.sin(rad), my - 16 * Math.cos(rad))
    ctx.fillStyle = CANVAS.emerald
    ctx.textAlign = 'left'
    ctx.fillText('قببه', C.x + 12, (C.y + B.y) / 2)
    ctx.fillStyle = CANVAS.teal
    ctx.textAlign = 'center'
    ctx.fillText('مجاور', (A.x + C.x) / 2, C.y + 18)

    // exact values panel
    const ex = exact ? EXACT_ANGLES[theta] : undefined
    if (ex) {
      ctx.direction = 'ltr'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.font = `11px ${MONO}`
      ctx.fillStyle = 'rgba(250,250,249,0.75)'
      ex.forEach((line, i) => ctx.fillText(line, 14, 16 + i * 16))
    }

    if (ch && ch.picked !== null) {
      const ok = ch.picked === ch.correctIndex
      const msg = ok
        ? 'آفرین! درست بود ✓'
        : `نشد! جواب درست: ${fmt(ch.hyp * Math.sin(ch.theta * RAD))}`
      drawBanner(ctx, w, ok, msg, reduced ? 1 : 0.5 + 0.5 * Math.sin(Date.now() / 200))
    }
  })

  const rad = theta * RAD
  const s = Math.sin(rad)
  const c = Math.cos(rad)
  const t = Math.tan(rad)

  return (
    <SimFrame
      title="آزمایشگاه نسبت‌های مثلثاتی"
      brief="زاویه را جابه‌جا کن و ببین سینوس، کسینوس و تانژانت چگونه تغییر می‌کنند."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="مثلث قائم‌الزاویه تعاملی" />
      <div className="flex flex-wrap items-end gap-4">
        <SimSlider label="زاویهٔ θ" value={theta} min={5} max={85} step={1} unit="°" onChange={setTheta} />
        <SimToggle label="مقدارهای دقیق زاویه‌های خاص" checked={exact} onChange={setExact} />
        <SimButton variant="secondary" onClick={newChallenge}>🎲 چالش حل مثلث</SimButton>
      </div>
      <div className="flex flex-wrap gap-2">
        <Readout label="sin θ" value={fmt(s, 3)} tone="text-emerald-500" />
        <Readout label="cos θ" value={fmt(c, 3)} tone="text-teal-500" />
        <Readout label="tan θ" value={Math.abs(c) < 1e-9 ? 'تعریف‌نشده' : fmt(t, 3)} tone="text-violet-500" />
        <Readout label="زاویهٔ حاده" value={`θ < 90°`} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <Legend color={CANVAS.emerald} label="قببه (روبه‌روی θ)" />
        <Legend color={CANVAS.teal} label="مجاور (کنار θ)" />
        <Legend color={CANVAS.amber} label="وتر" />
      </div>
      {ch && (
        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
          <p className="text-sm font-medium">
            چالش: وتر = <bdi>{ch.hyp}</bdi> و θ = <bdi>{ch.theta}°</bdi>؛ طول قببه کدام است؟
          </p>
          <OptionGrid
            labels={ch.labels}
            correctIndex={ch.correctIndex}
            picked={ch.picked}
            solved={ch.solved}
            onPick={answer}
          />
          <p role="status" className="text-xs text-muted-foreground">
            {!ch.picked
              ? 'یادآوری: قببه = وتر × sin θ'
              : ch.solved
                ? 'آفرین! با «چالش حل مثلث» یکی دیگر بساز.'
                : `جواب درست ${fmt(ch.hyp * Math.sin(ch.theta * RAD))} بود — دوباره تلاش کن.`}
          </p>
        </div>
      )}
    </SimFrame>
  )
}

// ─── درس ۲ · دایرهٔ مثلثاتی ──────────────────────────────────────────────────
interface Challenge2 {
  deg: number
  picked: number | null
  solved: boolean
}

const QUAD_LABELS = ['ربع اول', 'ربع دوم', 'ربع سوم', 'ربع چهارم']
const QUAD_NAMES = ['اول', 'دوم', 'سوم', 'چهارم']

function norm360(d: number): number {
  return ((d % 360) + 360) % 360
}
function quadIndex(d: number): number {
  const n = norm360(d)
  if (n % 90 === 0) return -1
  return Math.floor(n / 90)
}
function quadrantLabel(d: number): string {
  const i = quadIndex(d)
  return i < 0 ? 'روی محور' : `ربع ${QUAD_NAMES[i]}`
}

function T2UnitCircle(_props: SimProps) {
  const reduced = useReducedMotion()
  const beep = useSimBeep()
  const [deg, setDeg] = useState(60)
  const [snap, setSnap] = useState(true)
  const dragRef = useRef(false)
  const [ch, setCh] = useState<Challenge2 | null>(null)

  const newChallenge = () => {
    const pool = [37, 65, 95, 118, 150, 200, 235, 262, 295, 320]
    const d = pool[Math.floor(Math.random() * pool.length)]
    setCh({ deg: d, picked: null, solved: false })
  }

  const answer = (i: number) => {
    if (!ch || ch.picked !== null) return
    const ok = i === quadIndex(ch.deg)
    setCh({ ...ch, picked: i, solved: ok })
    if (ok) {
      beep(660, 120)
      beep(880, 160)
    } else {
      beep(180, 160, 'square', 0.03)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)

    const cx = w / 2
    const cy = h / 2 + 8
    const R = Math.min(w, h) / 2 - 46
    const rad = deg * RAD

    // axes
    ctx.strokeStyle = CANVAS.muted
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(cx - R - 26, cy); ctx.lineTo(cx + R + 26, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cy - R - 22); ctx.lineTo(cx, cy + R + 22); ctx.stroke()
    ctx.font = `12px ${MONO}`
    ctx.direction = 'ltr'
    ctx.fillStyle = CANVAS.muted
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText('x', cx + R + 22, cy - 6)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('y', cx + 8, cy - R - 14)

    // circle
    ctx.strokeStyle = CANVAS.white
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.stroke()

    // quadrant hints
    ctx.font = `11px ${FA}`
    ctx.direction = 'rtl'
    ctx.fillStyle = 'rgba(168,162,158,0.7)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    QUAD_NAMES.forEach((nm, i) => {
      const a = (45 + i * 90) * RAD
      ctx.fillText(nm, cx + R * 0.62 * Math.cos(a), cy - R * 0.62 * Math.sin(a))
    })

    // angle arc
    if (deg >= 3) {
      ctx.strokeStyle = CANVAS.amber
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cx, cy, 30, 0, -rad, true)
      ctx.stroke()
    }

    // radius
    const px = cx + R * Math.cos(rad)
    const py = cy - R * Math.sin(rad)
    ctx.strokeStyle = CANVAS.amber
    ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke()

    // sin / cos projections
    ctx.setLineDash([5, 4])
    ctx.lineWidth = 2
    ctx.strokeStyle = CANVAS.emerald
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke()
    ctx.strokeStyle = CANVAS.teal
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke()
    ctx.setLineDash([])

    // tan on tangent line x = R (guard: skip when cos ≈ 0 or |tan| too big)
    const cosV = Math.cos(rad)
    if (Math.abs(cosV) > 1e-9) {
      const tanV = Math.tan(rad)
      if (Math.abs(tanV) <= 2.4) {
        const qx = cx + R
        const qy = cy - R * tanV
        ctx.strokeStyle = 'rgba(139,92,246,0.45)'
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(qx, qy); ctx.stroke()
        ctx.strokeStyle = CANVAS.violet
        ctx.lineWidth = 3
        ctx.setLineDash([6, 4])
        ctx.beginPath(); ctx.moveTo(qx, cy); ctx.lineTo(qx, qy); ctx.stroke()
        ctx.setLineDash([])
        ctx.font = `11px ${MONO}`
        ctx.direction = 'ltr'
        ctx.fillStyle = CANVAS.violet
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText('tan θ', qx + 6, (cy + qy) / 2)
      }
    }

    // sin / cos labels
    ctx.font = `11px ${MONO}`
    ctx.direction = 'ltr'
    ctx.fillStyle = CANVAS.emerald
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText('sin θ', cx - 8, py - 4)
    ctx.fillStyle = CANVAS.teal
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('cos θ', px, cy + 6)

    // point
    ctx.beginPath()
    ctx.arc(px, py, 6.5, 0, Math.PI * 2)
    ctx.fillStyle = CANVAS.emerald
    ctx.fill()
    ctx.strokeStyle = CANVAS.bg
    ctx.lineWidth = 2
    ctx.stroke()

    // info: angle + quadrant
    ctx.font = `600 15px ${MONO}`
    ctx.fillStyle = CANVAS.amber
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.direction = 'ltr'
    ctx.fillText(`θ = ${deg}°`, 14, 14)
    ctx.font = `600 13px ${FA}`
    ctx.direction = 'rtl'
    ctx.fillStyle = CANVAS.fg
    ctx.textAlign = 'right'
    ctx.fillText(quadrantLabel(deg), w - 14, 14)

    if (ch && ch.picked !== null) {
      const ok = ch.picked === quadIndex(ch.deg)
      const msg = ok ? 'آفرین! ربع درست بود ✓' : `جواب درست: ${quadrantLabel(ch.deg)}`
      drawBanner(ctx, w, ok, msg, reduced ? 1 : 0.5 + 0.5 * Math.sin(Date.now() / 200))
    }
  }, 420)

  const setFromPointer = (e: RPointerEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current
    if (!cv) return
    const p = canvasPos(e, cv)
    const r = cv.getBoundingClientRect()
    const cx = r.width / 2
    const cy = r.height / 2 + 8
    let d = Math.atan2(-(p.y - cy), p.x - cx) / RAD
    d = norm360(d)
    if (snap) d = Math.round(d / 15) * 15
    setDeg(norm360(d))
  }

  const rad = deg * RAD
  const cosV = Math.cos(rad)
  const tanOK = Math.abs(cosV) > 1e-9

  return (
    <SimFrame
      title="دایرهٔ مثلثاتی"
      brief="نقطهٔ روی دایره را بکش؛ سینوس و کسینوس مختصه‌های همان نقطه‌اند."
    >
      <canvas
        ref={canvasRef}
        className="w-full touch-none cursor-crosshair rounded-lg border"
        aria-label="دایرهٔ مثلثاتی — نقطه را بکش"
        onPointerDown={(e) => { dragRef.current = true; setFromPointer(e) }}
        onPointerMove={(e) => { if (dragRef.current) setFromPointer(e) }}
        onPointerUp={() => { dragRef.current = false }}
        onPointerLeave={() => { dragRef.current = false }}
      />
      <div className="flex flex-wrap items-center gap-4">
        <SimToggle label="چسبیدن به مضرب‌های ۱۵ درجه" checked={snap} onChange={setSnap} />
        <SimButton variant="secondary" onClick={newChallenge}>🎲 چالش ربع</SimButton>
      </div>
      <div className="flex flex-wrap gap-2">
        <Readout label="زاویه" value={`${deg}°`} tone="text-amber-500" />
        <Readout label="sin θ" value={fmt(Math.sin(rad), 3)} tone="text-emerald-500" />
        <Readout label="cos θ" value={fmt(cosV, 3)} tone="text-teal-500" />
        <Readout label="tan θ" value={tanOK ? fmt(Math.tan(rad), 3) : 'تعریف‌نشده'} tone="text-violet-500" />
        <Readout label="ربع" value={quadrantLabel(deg)} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <Legend color={CANVAS.emerald} label="sin θ (مختصهٔ y)" />
        <Legend color={CANVAS.teal} label="cos θ (مختصهٔ x)" />
        <Legend color={CANVAS.violet} label="tan θ" />
      </div>
      {ch && (
        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
          <p className="text-sm font-medium">
            چالش: زاویهٔ <bdi>{ch.deg}°</bdi> در کدام ربع از دایرهٔ مثلثاتی قرار می‌گیرد؟
          </p>
          <OptionGrid
            labels={QUAD_LABELS}
            correctIndex={quadIndex(ch.deg)}
            picked={ch.picked}
            solved={ch.solved}
            onPick={answer}
          />
          <p role="status" className="text-xs text-muted-foreground">
            {!ch.picked
              ? 'راهنما: از ۹۰ و ۱۸۰ و ۲۷۰ فاصله‌اش را بشمار.'
              : ch.solved
                ? 'آفرین! یک چالش دیگر هم بزن.'
                : `جواب درست «${quadrantLabel(ch.deg)}» بود — دوباره تلاش کن.`}
          </p>
        </div>
      )}
    </SimFrame>
  )
}

// ─── درس ۳ · نمایشگر روابط و اتحادهای مثلثاتی ────────────────────────────────
interface Challenge3 {
  deg: number
  sinLabel: string
  labels: string[]
  correctIndex: number
  picked: number | null
  solved: boolean
}

const T3_CASES = [
  { deg: 30, sin: '1/2', labels: ['√3/2', '1/2', '√2/2', '1'], ci: 0 },
  { deg: 45, sin: '√2/2', labels: ['1/2', '√2/2', '√3/2', '2'], ci: 1 },
  { deg: 60, sin: '√3/2', labels: ['√3/2', '1', '1/2', '√2/2'], ci: 2 },
]

function T3TrigRelations(_props: SimProps) {
  const reduced = useReducedMotion()
  const beep = useSimBeep()
  const [theta, setTheta] = useState(30)
  const [ch, setCh] = useState<Challenge3 | null>(null)

  const newChallenge = () => {
    const c = T3_CASES[Math.floor(Math.random() * T3_CASES.length)]
    setCh({
      deg: c.deg,
      sinLabel: c.sin,
      labels: c.labels,
      correctIndex: c.ci,
      picked: null,
      solved: false,
    })
  }

  const answer = (i: number) => {
    if (!ch || ch.picked !== null) return
    const ok = i === ch.correctIndex
    setCh({ ...ch, picked: i, solved: ok })
    if (ok) {
      beep(660, 120)
      beep(880, 160)
    } else {
      beep(180, 160, 'square', 0.03)
    }
  }

  const { canvasRef } = useSimCanvas((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = CANVAS.bg
    ctx.fillRect(0, 0, w, h)
    drawGrid(ctx, w, h, 40)

    const rad = theta * RAD
    const sinV = Math.sin(rad)
    const cosV = Math.cos(rad)

    // ── left: quarter circle ──
    const Ox = w * 0.28
    const Oy = h * 0.74
    const R = Math.min(w * 0.23, h * 0.55)
    ctx.strokeStyle = CANVAS.muted
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(Ox - 18, Oy); ctx.lineTo(Ox + R + 26, Oy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(Ox, Oy + 16); ctx.lineTo(Ox, Oy - R - 18); ctx.stroke()
    ctx.strokeStyle = CANVAS.white
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(Ox, Oy, R, 0, -Math.PI / 2, true)
    ctx.stroke()

    const px = Ox + R * cosV
    const py = Oy - R * sinV
    ctx.strokeStyle = CANVAS.amber
    ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(Ox, Oy); ctx.lineTo(px, py); ctx.stroke()
    ctx.strokeStyle = CANVAS.emerald
    ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, Oy); ctx.stroke()
    ctx.strokeStyle = CANVAS.teal
    ctx.beginPath(); ctx.moveTo(px, Oy); ctx.lineTo(Ox, Oy); ctx.stroke()

    ctx.font = `11px ${MONO}`
    ctx.direction = 'ltr'
    ctx.fillStyle = CANVAS.emerald
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('sin θ', px + 6, (py + Oy) / 2)
    ctx.fillStyle = CANVAS.teal
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('cos θ', (px + Ox) / 2, Oy + 6)

    ctx.strokeStyle = CANVAS.fg
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(Ox, Oy, 20, 0, -rad, true)
    ctx.stroke()
    ctx.font = `600 11px ${MONO}`
    ctx.fillStyle = CANVAS.fg
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${theta}°`, Ox + 34 * Math.cos(rad / 2), Oy - 34 * Math.sin(rad / 2))

    // ── right: sin²+cos² = 1 bar ──
    const bx = w * 0.72
    const byTop = h * 0.28
    const L = h * 0.44
    const bw = 44
    const h1 = L * sinV * sinV
    ctx.fillStyle = 'rgba(16,185,129,0.85)'
    ctx.fillRect(bx - bw / 2, byTop, bw, h1)
    ctx.fillStyle = 'rgba(20,184,166,0.85)'
    ctx.fillRect(bx - bw / 2, byTop + h1, bw, L - h1)
    ctx.strokeStyle = CANVAS.fg
    ctx.lineWidth = 1.5
    ctx.strokeRect(bx - bw / 2, byTop, bw, L)
    ctx.beginPath(); ctx.moveTo(bx - bw / 2, byTop + h1); ctx.lineTo(bx + bw / 2, byTop + h1); ctx.stroke()

    ctx.font = `600 12px ${MONO}`
    ctx.direction = 'ltr'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (h1 > 26) {
      ctx.fillStyle = '#1c1917'
      ctx.fillText('sin²', bx, byTop + h1 / 2)
    }
    if (L - h1 > 26) {
      ctx.fillStyle = '#1c1917'
      ctx.fillText('cos²', bx, byTop + h1 + (L - h1) / 2)
    }
    // bracket + "1"
    ctx.strokeStyle = CANVAS.muted
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(bx + bw / 2 + 10, byTop)
    ctx.lineTo(bx + bw / 2 + 10, byTop + L)
    ctx.stroke()
    ctx.fillStyle = CANVAS.muted
    ctx.textAlign = 'left'
    ctx.fillText('1', bx + bw / 2 + 16, byTop + L / 2)

    ctx.fillStyle = CANVAS.fg
    ctx.font = `600 14px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText('sin²θ + cos²θ = 1', bx, byTop - 12)
    ctx.font = `12px ${MONO}`
    ctx.fillStyle = CANVAS.muted
    ctx.textBaseline = 'top'
    ctx.fillText(
      `${fmt(sinV * sinV, 3)} + ${fmt(cosV * cosV, 3)} = ${fmt(sinV * sinV + cosV * cosV, 3)}`,
      bx,
      byTop + L + 10,
    )

    // complement check line
    const comp = Math.sin((90 - theta) * RAD)
    ctx.fillStyle = CANVAS.muted
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.fillText(
      `sin(90°−${theta}°) = ${fmt(comp, 3)} = cos θ ✓`,
      14,
      h - 12,
    )

    if (ch && ch.picked !== null) {
      const ok = ch.picked === ch.correctIndex
      const msg = ok ? 'آفرین! درست بود ✓' : 'نشد! گزینهٔ سبز جواب درست است'
      drawBanner(ctx, w, ok, msg, reduced ? 1 : 0.5 + 0.5 * Math.sin(Date.now() / 200))
    }
  }, 400)

  const rad = theta * RAD
  const sinV = Math.sin(rad)
  const cosV = Math.cos(rad)
  const tanOK = Math.abs(cosV) > 1e-9

  return (
    <SimFrame
      title="نمایشگر روابط بین نسبت‌های مثلثاتی"
      brief="اتحاد فیثاغورسی و زاویه‌های مکمل را زنده ببین."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" aria-label="نمایش اتحادهای مثلثاتی" />
      <div className="flex flex-wrap items-end gap-4">
        <SimSlider label="زاویهٔ θ" value={theta} min={5} max={85} step={1} unit="°" onChange={setTheta} />
        <SimButton variant="secondary" onClick={newChallenge}>🎲 چالش اتحاد</SimButton>
      </div>
      <div className="flex flex-wrap gap-2">
        <Readout label="sin²θ + cos²θ" value={fmt(sinV * sinV + cosV * cosV, 3)} tone="text-amber-500" />
        <Readout label="tan θ = sin/cos" value={tanOK ? fmt(sinV / cosV, 3) : 'تعریف‌نشده'} tone="text-violet-500" />
        <Readout label="sin(90°−θ)" value={fmt(Math.sin((90 - theta) * RAD), 3)} tone="text-emerald-500" />
        <Readout label="cos θ" value={fmt(cosV, 3)} tone="text-teal-500" />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <Legend color={CANVAS.emerald} label="sin θ" />
        <Legend color={CANVAS.teal} label="cos θ" />
        <Legend color={CANVAS.amber} label="وتر" />
      </div>
      {ch && (
        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
          <p className="text-sm font-medium">
            چالش: θ حاده است و sin θ = <bdi>{ch.sinLabel}</bdi>؛ مقدار cos θ کدام است؟
          </p>
          <OptionGrid
            labels={ch.labels}
            correctIndex={ch.correctIndex}
            picked={ch.picked}
            solved={ch.solved}
            onPick={answer}
          />
          <p role="status" className="text-xs text-muted-foreground">
            {!ch.picked
              ? 'راهنما: از cos²θ = 1 − sin²θ یا زاویهٔ مکمل استفاده کن.'
              : ch.solved
                ? 'آفرین! یک چالش دیگر هم بزن.'
                : 'گزینهٔ سبز جواب درست بود — یک بار دیگر تلاش کن.'}
          </p>
        </div>
      )}
    </SimFrame>
  )
}

// ─── exports ─────────────────────────────────────────────────────────────────
export const simsC2: Record<string, SimComponent> = {
  't1-trig-ratios': T1TrigRatios,
  't2-unit-circle': T2UnitCircle,
  't3-trig-relations': T3TrigRelations,
}
