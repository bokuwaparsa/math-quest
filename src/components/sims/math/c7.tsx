// ─── Math Quest · فصل ۷ widgets: احتمال / جامعه و نمونه / متغیر ──────────────
'use client'

import { useState } from 'react'
import type { SimComponent } from '@/lib/game/types'
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
  useSimBeep,
  drawGrid,
} from '@/components/sims/sim-kit'

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ───────────────────────────────── درس ۱ · آزمایشگاه احتمال (سکه/تاس/چرخ) ────

type Tool = 'coin' | 'dice' | 'spinner'

const TOOL_NAME: Record<Tool, string> = {
  coin: 'سکه', dice: 'تاس', spinner: 'چرخ رنگی',
}

const CATS: Record<Tool, { labels: string[]; colors: string[] }> = {
  coin: { labels: ['رو', 'پشت'], colors: [CANVAS.amber, CANVAS.teal] },
  dice: {
    labels: ['۱', '۲', '۳', '۴', '۵', '۶'],
    colors: [CANVAS.amber, CANVAS.orange, CANVAS.emerald, CANVAS.teal, CANVAS.violet, CANVAS.rose],
  },
  spinner: { labels: ['قرمز', 'آبی', 'سبز', 'زرد'], colors: [CANVAS.rose, CANVAS.teal, CANVAS.emerald, CANVAS.yellow] },
}

/** theoretical probability of every category (all equally likely outcomes) */
const THEORY: Record<Tool, number[]> = {
  coin: [0.5, 0.5],
  dice: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
  spinner: [0.25, 0.25, 0.25, 0.25],
}

const EVENTS: Record<Tool, { value: string; label: string }[]> = {
  coin: [{ value: '0', label: 'رو آمدن' }],
  dice: [
    { value: 'even', label: 'عدد زوج' },
    { value: 'odd', label: 'عدد فرد' },
    { value: 'big', label: 'بزرگ‌تر از ۴' },
    { value: 'six', label: 'عدد ۶' },
  ],
  spinner: [
    { value: '0', label: 'رنگ قرمز' },
    { value: '1', label: 'رنگ آبی' },
    { value: '2', label: 'رنگ سبز' },
    { value: '3', label: 'رنگ زرد' },
  ],
}

function hitIdxs(tool: Tool, ev: string): number[] {
  if (tool === 'coin') return [0]
  if (tool === 'spinner') return [Number(ev) || 0]
  if (ev === 'even') return [1, 3, 5]
  if (ev === 'odd') return [0, 2, 4]
  if (ev === 'big') return [4, 5]
  return [5]
}

function rollIndex(tool: Tool): number {
  if (tool === 'coin') return Math.random() < 0.5 ? 0 : 1
  return Math.floor(Math.random() * (tool === 'dice' ? 6 : 4))
}

interface Stats {
  counts: number[]
  trials: number
  hits: number
  run: number[]
}

function S1Probability() {
  const beep = useSimBeep()
  const [tool, setTool] = useState<Tool>('coin')
  const [diceEvent, setDiceEvent] = useState('even')
  const [spinEvent, setSpinEvent] = useState('0')
  const [stats, setStats] = useState<Stats>({ counts: [0, 0], trials: 0, hits: 0, run: [] })

  const eventKey = tool === 'coin' ? '0' : tool === 'dice' ? diceEvent : spinEvent
  const cats = CATS[tool]
  const theoryAll = THEORY[tool]
  const hits_ = hitIdxs(tool, eventKey)
  const theoryP = hits_.reduce((s, i) => s + theoryAll[i], 0)
  const eventLabel = EVENTS[tool].find((e) => e.value === eventKey)?.label ?? ''

  const resetStats = (t: Tool) =>
    setStats({ counts: CATS[t].labels.map(() => 0), trials: 0, hits: 0, run: [] })

  const doTrials = (k: number) => {
    beep(480, 50)
    setStats((s) => {
      const counts = [...s.counts]
      let trials = s.trials
      let hits = s.hits
      let run = [...s.run]
      const target = hitIdxs(tool, eventKey)
      for (let i = 0; i < k; i++) {
        const idx = rollIndex(tool)
        counts[idx]++
        trials++
        if (target.includes(idx)) hits++
        run.push(hits / trials)
      }
      if (run.length > 2400) run = run.filter((_, i) => i % 2 === 0)
      return { counts, trials, hits, run }
    })
  }

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h)
    drawGrid(ctx, w, h)
    const { counts, trials } = stats

    // ── top: frequency bars per category vs theoretical dashed marks ──
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.fg
    ctx.font = '600 14px Vazirmatn, sans-serif'
    ctx.fillText(`${TOOL_NAME[tool]} — پیشامد موردنظر: ${eventLabel}`, w - 14, 24)

    const nb = cats.labels.length
    const bw = Math.min(64, (w - 110) / nb)
    const span = Math.min(w - 90, nb * (bw + 18))
    const x0 = (w - span) / 2 + (span - nb * (bw + 18)) / 2
    const barTop = 46
    const base = 250
    const plotH = base - barTop
    let maxEmp = 0
    for (let i = 0; i < nb; i++) if (trials > 0) maxEmp = Math.max(maxEmp, counts[i] / trials)
    const scaleMax = Math.max(0.5, maxEmp * 1.15)

    for (let i = 0; i < nb; i++) {
      const x = x0 + i * (bw + 18)
      const emp = trials > 0 ? counts[i] / trials : 0
      const bh = (emp / scaleMax) * plotH
      const isTarget = hits_.includes(i)
      ctx.fillStyle = cats.colors[i]
      ctx.globalAlpha = isTarget ? 1 : 0.55
      roundedRect(ctx, x, base - bh, bw, Math.max(bh, 1.5), 5)
      ctx.fill()
      ctx.globalAlpha = 1
      // theoretical dashed mark
      const ty = base - (theoryAll[i] / scaleMax) * plotH
      ctx.strokeStyle = CANVAS.violet
      ctx.setLineDash([5, 4])
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x - 4, ty)
      ctx.lineTo(x + bw + 4, ty)
      ctx.stroke()
      ctx.setLineDash([])
      if (isTarget) {
        ctx.strokeStyle = CANVAS.yellow
        ctx.lineWidth = 2
        roundedRect(ctx, x - 4, base - Math.max(bh, 1.5) - 4, bw + 8, Math.max(bh, 1.5) + 8, 7)
        ctx.stroke()
      }
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.fg
      ctx.font = '700 12px Vazirmatn, sans-serif'
      ctx.fillText(trials > 0 ? emp.toFixed(2) : '—', x + bw / 2, base - bh - 10)
      ctx.fillStyle = isTarget ? CANVAS.yellow : CANVAS.muted
      ctx.font = '600 12px Vazirmatn, sans-serif'
      ctx.fillText(cats.labels[i], x + bw / 2, base + 18)
    }
    // scale labels
    ctx.textAlign = 'left'
    ctx.fillStyle = CANVAS.muted
    ctx.font = '500 10px Vazirmatn, sans-serif'
    ctx.fillText(`مقیاس: 0 تا ${scaleMax.toFixed(2)}`, 12, barTop + 10)
    ctx.fillStyle = CANVAS.violet
    ctx.fillText('— — خط‌چین: احتمال نظری', 12, barTop + 26)

    // ── bottom: convergence plot ──
    const py0 = 300
    const py1 = h - 30
    const px0 = 56
    const px1 = w - 16
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.muted
    ctx.font = '600 12px Vazirmatn, sans-serif'
    ctx.fillText('همگرایی فراوانی تجربی به احتمال نظری', w - 14, py0 - 14)
    // frame + gridlines
    ctx.strokeStyle = CANVAS.grid
    ctx.lineWidth = 1
    ctx.strokeRect(px0, py0, px1 - px0, py1 - py0)
    ctx.textAlign = 'left'
    for (const p of [0.25, 0.5, 0.75, 1]) {
      const y = py1 - p * (py1 - py0)
      ctx.strokeStyle = CANVAS.grid
      ctx.beginPath()
      ctx.moveTo(px0, y)
      ctx.lineTo(px1, y)
      ctx.stroke()
      ctx.fillStyle = CANVAS.muted
      ctx.font = '500 10px Vazirmatn, sans-serif'
      ctx.fillText(p.toFixed(2), 16, y + 3)
    }
    // theoretical line
    const yTh = py1 - theoryP * (py1 - py0)
    ctx.strokeStyle = CANVAS.violet
    ctx.setLineDash([6, 5])
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(px0, yTh)
    ctx.lineTo(px1, yTh)
    ctx.stroke()
    ctx.setLineDash([])
    // empirical curve
    const run = stats.run
    if (run.length > 1) {
      ctx.strokeStyle = CANVAS.emerald
      ctx.lineWidth = 2
      ctx.beginPath()
      const step = Math.max(1, Math.floor(run.length / (px1 - px0)))
      for (let i = 0; i < run.length; i += step) {
        const x = px0 + (i / Math.max(1, run.length - 1)) * (px1 - px0)
        const y = py1 - Math.min(1, run[i]) * (py1 - py0)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      // last point
      const lx = px1
      const ly = py1 - Math.min(1, run[run.length - 1]) * (py1 - py0)
      ctx.fillStyle = CANVAS.emerald
      ctx.beginPath()
      ctx.arc(lx - 3, ly, 4, 0, Math.PI * 2)
      ctx.fill()
    } else if (run.length === 1) {
      ctx.fillStyle = CANVAS.emerald
      ctx.beginPath()
      ctx.arc(px0 + 2, py1 - run[0] * (py1 - py0), 4, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.muted
      ctx.font = '500 12px Vazirmatn, sans-serif'
      ctx.fillText('هنوز آزمایشی انجام نشده — دکمه‌های پرتاب را بزن', (px0 + px1) / 2, (py0 + py1) / 2)
    }
  }

  const { canvasRef } = useSimCanvas(draw, 440)
  const empP = stats.trials > 0 ? stats.hits / stats.trials : null

  return (
    <SimFrame
      title="آزمایشگاه احتمال: سکه، تاس و چرخ"
      brief="هرچه آزمایش‌ها بیشتر شوند، فراوانی تجربی به احتمال نظری نزدیک می‌شود (قانون اعداد بزرگ)."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" />
      <div className="flex flex-wrap gap-3">
        <SimSelect<Tool>
          label="ابزار تصادفی"
          value={tool}
          onChange={(v) => {
            setTool(v)
            resetStats(v)
          }}
          options={[
            { value: 'coin', label: 'سکه' },
            { value: 'dice', label: 'تاس' },
            { value: 'spinner', label: 'چرخ رنگی (۴ قسمت مساوی)' },
          ]}
        />
        {EVENTS[tool].length > 1 && (
          <SimSelect
            label="پیشامد موردنظر"
            value={eventKey}
            onChange={(v) => {
              if (tool === 'dice') {
                setDiceEvent(v)
                resetStats(tool)
              } else {
                setSpinEvent(v)
                resetStats(tool)
              }
            }}
            options={EVENTS[tool]}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <SimButton onClick={() => doTrials(1)}>۱ پرتاب</SimButton>
        <SimButton onClick={() => doTrials(10)}>۱۰ پرتاب</SimButton>
        <SimButton variant="secondary" onClick={() => doTrials(100)}>۱۰۰ پرتاب</SimButton>
        <SimButton variant="outline" onClick={() => resetStats(tool)}>بازنشانی</SimButton>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Readout label="تعداد آزمایش" value={String(stats.trials)} />
        <Readout label="فراوانی مطلوب" value={String(stats.hits)} tone="text-emerald-500" />
        <Readout
          label="احتمال تجربی"
          value={empP === null ? '—' : empP.toFixed(3)}
          tone="text-emerald-500"
        />
        <Readout label="احتمال نظری" value={theoryP.toFixed(3)} tone="text-violet-400" />
        <Legend color={CANVAS.emerald} label="تجربی" />
        <Legend color={CANVAS.violet} label="نظری (خط‌چین)" />
        <Legend color={CANVAS.yellow} label="پیشامد هدف" />
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {stats.trials === 0
          ? 'شروع کن: با چند پرتاب کوچک احتمال تجربی پرنوسان است.'
          : `فراوانی تجربی ${empP?.toFixed(3)} در برابر احتمال نظری ${theoryP.toFixed(3)} — با ${stats.trials >= 100 ? 'تعداد زیاد' : 'تعداد کم'} آزمایش، فاصله ${stats.trials >= 100 ? 'کم' : 'زیاد'} است.`}
      </p>
    </SimFrame>
  )
}

// ───────────────────────────────── درس ۲ · جامعه، نمونه و پایداری تخمین ──────

const POP = 200
const POP_LIKE_P = 0.38

function makePopulation(): boolean[] {
  return Array.from({ length: POP }, () => Math.random() < POP_LIKE_P)
}

function S2Sampling() {
  const beep = useSimBeep()
  const [pop, setPop] = useState<boolean[]>(() => makePopulation())
  const [sampleSize, setSampleSize] = useState(30)
  const [sampled, setSampled] = useState<number[] | null>(null)
  const [estimates, setEstimates] = useState<number[]>([])
  const [showTruth, setShowTruth] = useState(false)

  const trueCount = pop.filter(Boolean).length
  const sampleHits = sampled ? sampled.filter((i) => pop[i]).length : null
  const sampleRatio = sampled && sampled.length > 0 ? (sampleHits ?? 0) / sampled.length : null
  const estimate = sampleRatio !== null ? Math.round(sampleRatio * POP) : null

  const takeSample = () => {
    // partial Fisher–Yates: uniform random subset without full shuffle
    const idxs = Array.from({ length: POP }, (_, i) => i)
    for (let i = 0; i < sampleSize; i++) {
      const j = i + Math.floor(Math.random() * (POP - i))
      ;[idxs[i], idxs[j]] = [idxs[j], idxs[i]]
    }
    const picked = idxs.slice(0, sampleSize)
    setSampled(picked)
    const hits = picked.filter((i) => pop[i]).length
    const est = Math.round((hits / sampleSize) * POP)
    setEstimates((e) => [...e.slice(-59), est])
    beep(500, 60)
  }

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h)
    drawGrid(ctx, w, h)
    const sampledSet = new Set(sampled ?? [])

    // ── top: population grid ──
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.fg
    ctx.font = '600 14px Vazirmatn, sans-serif'
    ctx.fillText(`جامعه: ${POP} دانش‌آموز — ویژگی: «ریاضی را دوست دارد»`, w - 14, 22)

    const cols = 20
    const rows = POP / cols
    const gx0 = 34
    const gx1 = w - 20
    const gy0 = 38
    const gy1 = 250
    const cw = (gx1 - gx0) / cols
    const chh = (gy1 - gy0) / rows
    const r = Math.min(9, cw * 0.34)
    for (let i = 0; i < POP; i++) {
      const cx = gx0 + (i % cols) * cw + cw / 2
      const cy = gy0 + Math.floor(i / cols) * chh + chh / 2
      const inSample = sampledSet.has(i)
      let color = CANVAS.panelLight
      if (inSample) color = pop[i] ? CANVAS.emerald : CANVAS.white
      else if (showTruth) color = pop[i] ? 'rgba(16,185,129,0.4)' : 'rgba(214,211,209,0.22)'
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(cx, cy, inSample ? r + 1 : r, 0, Math.PI * 2)
      ctx.fill()
      if (inSample) {
        ctx.strokeStyle = CANVAS.amber
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(cx, cy, r + 3.5, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
    ctx.textAlign = 'left'
    ctx.fillStyle = CANVAS.muted
    ctx.font = '500 11px Vazirmatn, sans-serif'
    ctx.fillText(
      sampled
        ? 'حلقهٔ نارنجی = نمونهٔ تصادفی (تنها اعضای بررسی‌شده)'
        : 'هنوز نمونه‌ای انتخاب نشده — جامعه «ناشناخته» است',
      12, gy1 + 16,
    )

    // ── bottom: stability of estimates across repeated samples ──
    const py0 = 300
    const py1 = h - 30
    const px0 = 52
    const px1 = w - 16
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.muted
    ctx.font = '600 12px Vazirmatn, sans-serif'
    ctx.fillText('پایداری تخمین در نمونه‌گیری‌های مکرر (تعداد نفرات)', w - 14, py0 - 12)
    ctx.strokeStyle = CANVAS.grid
    ctx.strokeRect(px0, py0, px1 - px0, py1 - py0)
    ctx.textAlign = 'left'
    for (const v of [0, 50, 100, 150, 200]) {
      const y = py1 - (v / POP) * (py1 - py0)
      ctx.strokeStyle = CANVAS.grid
      ctx.beginPath()
      ctx.moveTo(px0, y)
      ctx.lineTo(px1, y)
      ctx.stroke()
      ctx.fillStyle = CANVAS.muted
      ctx.font = '500 10px Vazirmatn, sans-serif'
      ctx.fillText(String(v), 16, y + 3)
    }
    if (showTruth) {
      const yT = py1 - (trueCount / POP) * (py1 - py0)
      ctx.strokeStyle = CANVAS.amber
      ctx.setLineDash([6, 5])
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(px0, yT)
      ctx.lineTo(px1, yT)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = CANVAS.amber
      ctx.font = '600 11px Vazirmatn, sans-serif'
      ctx.fillText(`مقدار واقعی جامعه: ${trueCount}`, px0 + 8, yT - 6)
    }
    if (estimates.length > 0) {
      ctx.strokeStyle = CANVAS.emerald
      ctx.lineWidth = 2
      ctx.beginPath()
      const spanX = px1 - px0 - 12
      estimates.forEach((e, i) => {
        const x = px0 + 6 + (i / Math.max(1, estimates.length - 1)) * spanX
        const y = py1 - (e / POP) * (py1 - py0)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      const lastX = px0 + 6 + spanX
      const lastY = py1 - (estimates[estimates.length - 1] / POP) * (py1 - py0)
      ctx.fillStyle = CANVAS.emerald
      ctx.beginPath()
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.font = '700 11px Vazirmatn, sans-serif'
      ctx.fillText(String(estimates[estimates.length - 1]), lastX + 4, lastY - 6)
    } else {
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.muted
      ctx.font = '500 12px Vazirmatn, sans-serif'
      ctx.fillText('چند بار «نمونه‌گیری تصادفی» را بزن تا پایداری تخمین را ببینی', (px0 + px1) / 2, (py0 + py1) / 2)
    }
  }

  const { canvasRef } = useSimCanvas(draw, 440)

  return (
    <SimFrame
      title="آزمایشگاه جامعه و نمونه"
      brief="فقط اعضای نمونه بررسی می‌شوند؛ نسبت نمونه به کل جامعه تعمیم می‌شود."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" />
      <div className="flex flex-wrap items-center gap-3">
        <SimSlider
          label="اندازهٔ نمونه"
          value={sampleSize}
          min={5}
          max={100}
          onChange={(v) => {
            setSampleSize(v)
            setSampled(null)
          }}
        />
        <SimButton variant="secondary" onClick={takeSample}>
          نمونه‌گیری تصادفی 🎯
        </SimButton>
        <SimButton
          variant="outline"
          onClick={() => {
            setPop(makePopulation())
            setSampled(null)
            setEstimates([])
          }}
        >
          جامعهٔ جدید
        </SimButton>
        <SimToggle label="نمایش واقعیت کل جامعه" checked={showTruth} onChange={setShowTruth} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Readout label="اندازهٔ نمونه" value={String(sampled ? sampled.length : sampleSize)} unit="نفر" />
        <Readout
          label="دوست‌دار در نمونه"
          value={sampleHits === null ? '—' : String(sampleHits)}
          unit="نفر"
          tone="text-emerald-500"
        />
        <Readout
          label="نسبت نمونه"
          value={sampleRatio === null ? '—' : `${(sampleRatio * 100).toFixed(0)}٪`}
        />
        <Readout
          label="تخمین برای جامعه"
          value={estimate === null ? '—' : String(estimate)}
          unit="نفر"
          tone="text-amber-500"
        />
        {showTruth && (
          <Readout label="واقعی در جامعه" value={String(trueCount)} unit="نفر" tone="text-violet-400" />
        )}
        <Legend color={CANVAS.emerald} label="دوست‌دار (بررسی‌شده)" />
        <Legend color={CANVAS.white} label="غیر دوست‌دار (بررسی‌شده)" />
        <Legend color={CANVAS.panelLight} label="بررسی‌نشده" />
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {sampled
          ? `نسبت ${((sampleHits ?? 0) / sampled.length * 100).toFixed(0)}٪ در نمونهٔ ${sampled.length} نفره → تخمین ${estimate} نفر برای کل جامعه. ${sampled.length >= 60 ? 'نمونهٔ بزرگ: تخمین پایدارتر است.' : 'نمونهٔ کوچک: تخمین پرنوسان‌تر است — چند بار تکرار کن.'}`
          : 'با دکمهٔ «نمونه‌گیری تصادفی» بخشی از جامعه را بررسی کن و بعد با کلید «نمایش واقعیت» مقایسه کن.'}
      </p>
    </SimFrame>
  )
}

// ───────────────────────────────── درس ۳ · بازی دسته‌بندی متغیر + نمودار ─────

type VType = 'q' | 'dg' | 'dp'

const TYPE_LABEL: Record<VType, string> = { q: 'کیفی', dg: 'کمی گسسته', dp: 'کمی پیوسته' }
const TYPE_WHY: Record<VType, string> = {
  q: 'فقط دسته‌بندی می‌شود؛ اندازه‌گیری یا شمردن نمی‌شود.',
  dg: 'با «شمردن» به دست می‌آید و فقط عدد صحیح است.',
  dp: 'با «اندازه‌گیری» به دست می‌آید و مقدار اعشاری هم معنادار است.',
}

const POOL: { text: string; type: VType }[] = [
  { text: 'رنگ چشم افراد', type: 'q' },
  { text: 'قد دانش‌آموزان (سانتی‌متر)', type: 'dp' },
  { text: 'تعداد فرزندان خانواده', type: 'dg' },
  { text: 'رتبهٔ مسابقه (اول/دوم/سوم)', type: 'q' },
  { text: 'وزن کوله‌پشتی (کیلوگرم)', type: 'dp' },
  { text: 'شمارهٔ پیراهن بازیکن', type: 'q' },
  { text: 'تعداد صفحات کتاب', type: 'dg' },
  { text: 'دمای هوا (درجهٔ سانتی‌گراد)', type: 'dp' },
  { text: 'گروه خونی', type: 'q' },
  { text: 'تعداد دانش‌آموزان کلاس', type: 'dg' },
  { text: 'مدرک تحصیلی', type: 'q' },
  { text: 'مدت مطالعهٔ روزانه (ساعت)', type: 'dp' },
]

const BAR_COLORS = [CANVAS.white, '#78716c', CANVAS.muted, CANVAS.rose]
const BAR_NAMES = ['سفید', 'مشکی', 'نقره‌ای', 'قرمز']

function S3Variables() {
  const beep = useSimBeep()
  const [deck, setDeck] = useState<{ text: string; type: VType }[]>(() => shuffle(POOL).slice(0, 6))
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState<('right' | 'wrong' | null)[]>(() => Array(6).fill(null))
  const [picked, setPicked] = useState<VType | null>(null)
  const [freq, setFreq] = useState<number[]>([8, 6, 4, 2])

  const score = results.filter((r) => r === 'right').length
  const done = results.every((r) => r !== null)

  const answer = (t: VType) => {
    if (done || picked !== null) return
    const right = t === deck[idx].type
    const next = [...results]
    next[idx] = right ? 'right' : 'wrong'
    setResults(next)
    setPicked(t)
    if (right) {
      beep(560, 90)
      if (next.filter((r) => r === 'right').length === 6) {
        beep(660, 120)
        window.setTimeout(() => beep(880, 160), 150)
      }
    } else {
      beep(220, 200, 'square')
    }
  }

  const advance = () => {
    if (idx < 5) {
      setIdx(idx + 1)
      setPicked(null)
    } else {
      setDeck(shuffle(POOL).slice(0, 6))
      setIdx(0)
      setResults(Array(6).fill(null))
      setPicked(null)
    }
  }

  // ── game canvas ──
  const drawGame = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h)
    drawGrid(ctx, w, h)
    ctx.textAlign = 'center'

    // progress dots
    const gap = Math.min(46, (w - 80) / 6)
    const x0 = w / 2 - (5 * gap) / 2
    for (let i = 0; i < 6; i++) {
      const x = x0 + i * gap
      const st = results[i]
      ctx.fillStyle = st === 'right' ? CANVAS.emerald : st === 'wrong' ? CANVAS.rose : CANVAS.panelLight
      ctx.beginPath()
      ctx.arc(x, 30, 9, 0, Math.PI * 2)
      ctx.fill()
      if (i === idx && !done) {
        ctx.strokeStyle = CANVAS.amber
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, 30, 13, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    if (done) {
      const perfect = score === 6
      ctx.fillStyle = perfect ? 'rgba(234,179,8,0.16)' : 'rgba(245,158,11,0.12)'
      roundedRect(ctx, w / 2 - 220, 90, 440, 110, 14)
      ctx.fill()
      ctx.strokeStyle = perfect ? CANVAS.yellow : CANVAS.amber
      ctx.lineWidth = 2
      roundedRect(ctx, w / 2 - 220, 90, 440, 110, 14)
      ctx.stroke()
      ctx.fillStyle = perfect ? CANVAS.yellow : CANVAS.amber
      ctx.font = '700 20px Vazirmatn, sans-serif'
      ctx.fillText(perfect ? '🏆 ۶ از ۶ — عالی بود!' : `دور تمام شد: ${score} از ۶`, w / 2, 138)
      ctx.fillStyle = CANVAS.fg
      ctx.font = '500 13px Vazirmatn, sans-serif'
      ctx.fillText(perfect ? 'همهٔ نوع‌های متغیر را درست تشخیص دادی.' : 'برای دیدن پاسخ‌ها و دور جدید، دکمهٔ پایین را بزن.', w / 2, 168)
      return
    }

    // current item card
    ctx.fillStyle = CANVAS.muted
    ctx.font = '600 13px Vazirmatn, sans-serif'
    ctx.fillText(`آیتم ${idx + 1} از ۶ — این متغیر چه نوعی است؟`, w / 2, 78)
    ctx.fillStyle = 'rgba(139,92,246,0.14)'
    roundedRect(ctx, w / 2 - 230, 96, 460, 62, 12)
    ctx.fill()
    ctx.strokeStyle = CANVAS.violet
    ctx.lineWidth = 1.5
    roundedRect(ctx, w / 2 - 230, 96, 460, 62, 12)
    ctx.stroke()
    ctx.fillStyle = CANVAS.fg
    ctx.font = '700 17px Vazirmatn, sans-serif'
    ctx.fillText(deck[idx].text, w / 2, 133)

    // feedback banner
    if (picked !== null) {
      const right = deck[idx].type === picked
      ctx.fillStyle = right ? 'rgba(16,185,129,0.16)' : 'rgba(244,63,94,0.14)'
      roundedRect(ctx, w / 2 - 230, 172, 460, 52, 10)
      ctx.fill()
      ctx.strokeStyle = right ? CANVAS.emerald : CANVAS.rose
      ctx.lineWidth = 1.5
      roundedRect(ctx, w / 2 - 230, 172, 460, 52, 10)
      ctx.stroke()
      ctx.fillStyle = right ? CANVAS.emerald : CANVAS.rose
      ctx.font = '700 14px Vazirmatn, sans-serif'
      ctx.fillText(
        right ? '✓ درست بود!' : `✗ نادرست — پاسخ درست: ${TYPE_LABEL[deck[idx].type]}`,
        w / 2, 194,
      )
      ctx.fillStyle = CANVAS.muted
      ctx.font = '500 12px Vazirmatn, sans-serif'
      ctx.fillText(TYPE_WHY[deck[idx].type], w / 2, 214)
    }
  }
  const { canvasRef: gameRef } = useSimCanvas(drawGame, 240)

  // ── frequency chart canvas ──
  const drawChart = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h)
    drawGrid(ctx, w, h)
    const total = freq.reduce((a, b) => a + b, 0)
    const maxF = Math.max(...freq, 1)

    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.fg
    ctx.font = '600 14px Vazirmatn, sans-serif'
    ctx.fillText('جدول فراوانی متغیر کیفی اسمی: «رنگ کوله‌پشتی‌ها»', w - 14, 24)

    const nb = 4
    const bw = Math.min(84, (w - 100) / nb)
    const span = nb * (bw + 26)
    const x0 = (w - span) / 2
    const base = h - 62
    const top = 48
    const modal = total > 0 ? Math.max(...freq) : -1
    for (let i = 0; i < nb; i++) {
      const x = x0 + i * (bw + 26)
      const bh = (freq[i] / maxF) * (base - top)
      ctx.fillStyle = BAR_COLORS[i]
      roundedRect(ctx, x, base - bh, bw, Math.max(bh, 1.5), 6)
      ctx.fill()
      if (total > 0 && freq[i] === modal && modal > 0) {
        ctx.strokeStyle = CANVAS.yellow
        ctx.lineWidth = 2
        roundedRect(ctx, x - 4, base - bh - 4, bw + 8, bh + 8, 8)
        ctx.stroke()
      }
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.fg
      ctx.font = '700 13px Vazirmatn, sans-serif'
      ctx.fillText(String(freq[i]), x + bw / 2, base - bh - 9)
      ctx.fillStyle = CANVAS.muted
      ctx.font = '600 12px Vazirmatn, sans-serif'
      ctx.fillText(BAR_NAMES[i], x + bw / 2, base + 18)
      ctx.fillStyle = CANVAS.violet
      ctx.font = '500 11px Vazirmatn, sans-serif'
      ctx.fillText(total > 0 ? `نسبی: ${(freq[i] / total).toFixed(2)}` : 'نسبی: —', x + bw / 2, base + 34)
    }
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.fg
    ctx.font = '600 13px Vazirmatn, sans-serif'
    ctx.fillText(
      total > 0 ? `جمع داده‌ها: n = ${total}  ·  مد: ${BAR_NAMES[freq.indexOf(modal)]}` : 'جمع داده‌ها: n = 0',
      w - 14, h - 12,
    )
  }
  const { canvasRef: chartRef } = useSimCanvas(drawChart, 250)

  return (
    <SimFrame
      title="بازی دسته‌بندی متغیر + نمودار فراوانی"
      brief="اول نوع متغیر را تشخیص بده، بعد با اسلایدرها جدول فراوانی و نمودار بساز."
    >
      <canvas ref={gameRef} className="w-full rounded-lg border" />
      <div className="flex flex-wrap gap-2">
        <SimButton onClick={() => answer('q')} disabled={done || picked !== null}>
          کیفی
        </SimButton>
        <SimButton onClick={() => answer('dg')} disabled={done || picked !== null}>
          کمی گسسته
        </SimButton>
        <SimButton onClick={() => answer('dp')} disabled={done || picked !== null}>
          کمی پیوسته
        </SimButton>
        <SimButton variant="secondary" onClick={advance}>
          {done ? 'دور جدید 🔄' : 'آیتم بعدی ←'}
        </SimButton>
      </div>
      <p role="status" className="text-sm font-medium">
        {done
          ? `پایان دور — امتیاز تو: ${score} از ۶.`
          : picked !== null
            ? deck[idx].type === picked
              ? `✓ درست بود! «${deck[idx].text}» ${TYPE_LABEL[deck[idx].type]} است.`
              : `✗ نادرست — «${deck[idx].text}» ${TYPE_LABEL[deck[idx].type]} است: ${TYPE_WHY[deck[idx].type]}`
            : `آیتم ${idx + 1}: «${deck[idx].text}» — یکی از سه دکمه را انتخاب کن.`}
      </p>
      <canvas ref={chartRef} className="w-full rounded-lg border" />
      <div className="flex flex-wrap gap-3">
        {BAR_NAMES.map((name, i) => (
          <SimSlider
            key={name}
            label={`فراوانی ${name}`}
            value={freq[i]}
            min={0}
            max={10}
            onChange={(v) => setFreq((f) => f.map((x, j) => (j === i ? v : x)))}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Readout label="جمع داده‌ها" value={String(freq.reduce((a, b) => a + b, 0))} unit="نفر" />
        <Readout
          label="فراوانی نسبی سفید"
          value={freq.reduce((a, b) => a + b, 0) > 0 ? (freq[0] / freq.reduce((a, b) => a + b, 0)).toFixed(2) : '—'}
          tone="text-amber-500"
        />
        <Legend color={CANVAS.yellow} label="مد (بیشترین فراوانی)" />
      </div>
    </SimFrame>
  )
}

// ─── registry ─────────────────────────────────────────────────────────────────

export const simsC7: Record<string, SimComponent> = {
  's1-probability': S1Probability,
  's2-population-sample': S2Sampling,
  's3-variables': S3Variables,
}
