// ─── Math Quest · فصل ۶ widgets: شمارش / جایگشت / ترکیب ──────────────────────
'use client'

import { useState } from 'react'
import type { SimComponent } from '@/lib/game/types'
import {
  CANVAS,
  SimFrame,
  SimSlider,
  SimSelect,
  SimButton,
  Readout,
  Legend,
  useSimCanvas,
  useSimBeep,
  useReducedMotion,
  drawGrid,
} from '@/components/sims/sim-kit'

// ── shared numeric helpers (iterative → no factorial overflow for n ≤ 20) ────

function factorialSafe(n: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 20) return NaN
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

function nPr(n: number, k: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 20) return NaN
  if (k < 0 || k > n) return 0
  let r = 1
  for (let i = 0; i < k; i++) r *= n - i
  return r
}

function nCr(n: number, k: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 20) return NaN
  if (k < 0 || k > n) return 0
  const kk = Math.min(k, n - k)
  let r = 1
  for (let i = 1; i <= kk; i++) r = (r * (n - kk + i)) / i
  return r
}

/** Latin-digit grouping; never renders NaN/Infinity. */
function fmt(n: number): string {
  return Number.isFinite(n) ? n.toLocaleString('en-US') : '—'
}

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

// ─────────────────────────────────────────────── درس ۱ · شمارش (درخت) ────────

type Scenario = 'meal' | 'outfit'

const SCEN: Record<Scenario, { l1: string[]; l2: string[]; title: string; n1: string; n2: string }> = {
  meal: {
    l1: ['کباب', 'پیتزا', 'ماکارونی', 'ساندویچ', 'عدس‌پلو', 'قرمه‌سبزی'],
    l2: ['دوغ', 'آب', 'چای', 'شربت', 'نوشابه', 'آب‌میوه'],
    title: 'سفارش کافه: یک غذا و یک نوشیدنی',
    n1: 'غذا', n2: 'نوشیدنی',
  },
  outfit: {
    l1: ['سفید', 'آبی', 'سبز', 'قرمز', 'زرد', 'مشکی'],
    l2: ['جین', 'کتان', 'خاکی', 'مشکی', 'سرمه‌ای', 'پارچه‌ای'],
    title: 'انتخاب لباس: یک پیراهن و یک شلوار',
    n1: 'پیراهن', n2: 'شلوار',
  },
}

function C1Counting() {
  const beep = useSimBeep()
  const reduced = useReducedMotion()
  const [scenario, setScenario] = useState<Scenario>('meal')
  const [m, setM] = useState(3)
  const [n, setN] = useState(2)
  // challenge state
  const [chOn, setChOn] = useState(false)
  const [chMN, setChMN] = useState({ m: 3, n: 3 })
  const [chOpts, setChOpts] = useState<number[]>([])
  const [chPicked, setChPicked] = useState<number | null>(null)

  const sc = SCEN[scenario]
  const total = m * n

  const startChallenge = () => {
    const cm = 2 + Math.floor(Math.random() * 4) // 2..5
    const cn = 2 + Math.floor(Math.random() * 4)
    const correct = cm * cn
    const pool = shuffle(
      [cm + cn, cm * cn + cm, cm * cn + cn, cm * cn + 1, cm * (cn + 1), (cm + 1) * cn]
        .filter((v) => v !== correct && v > 0)
        .filter((v, i, a) => a.indexOf(v) === i),
    ).slice(0, 3)
    setChMN({ m: cm, n: cn })
    setChOpts(shuffle([correct, ...pool]))
    setChPicked(null)
    setChOn(true)
  }

  const answer = (v: number) => {
    if (chPicked !== null) return
    setChPicked(v)
    if (v === chMN.m * chMN.n) {
      beep(660, 120)
      window.setTimeout(() => beep(880, 160), 150)
    } else {
      beep(220, 200, 'square')
    }
  }

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.clearRect(0, 0, w, h)
    drawGrid(ctx, w, h)

    // ── challenge mode: question banner instead of tree ──
    if (chOn) {
      const correct = chMN.m * chMN.n
      const won = chPicked === correct
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.amber
      ctx.font = '700 20px Vazirmatn, sans-serif'
      ctx.fillText('چالش اصل ضرب', w / 2, 46)
      ctx.fillStyle = CANVAS.fg
      ctx.font = '500 15px Vazirmatn, sans-serif'
      ctx.fillText(
        `گروه اول: ${chMN.m} حالت  و  گروه دوم: ${chMN.n} حالت`,
        w / 2, 86,
      )
      ctx.fillStyle = CANVAS.yellow
      ctx.font = '700 18px Vazirmatn, sans-serif'
      ctx.fillText('چند مسیر ممکن است؟', w / 2, 124)

      if (chPicked !== null) {
        const bannerY = 190
        ctx.font = '700 17px Vazirmatn, sans-serif'
        if (won) {
          ctx.fillStyle = 'rgba(16,185,129,0.18)'
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.fill()
          ctx.strokeStyle = CANVAS.emerald
          ctx.lineWidth = 2
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.stroke()
          ctx.fillStyle = CANVAS.emerald
          ctx.fillText('✓ آفرین! جواب درست بود', w / 2, bannerY + 34)
          ctx.fillStyle = CANVAS.fg
          ctx.font = '500 14px Vazirmatn, sans-serif'
          ctx.fillText(`${chMN.m} × ${chMN.n} = ${correct}`, w / 2, bannerY + 62)
        } else {
          ctx.fillStyle = 'rgba(244,63,94,0.15)'
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.fill()
          ctx.strokeStyle = CANVAS.rose
          ctx.lineWidth = 2
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.stroke()
          ctx.fillStyle = CANVAS.rose
          ctx.fillText('✗ اشتباه بود؛ دوباره تلاش کن!', w / 2, bannerY + 34)
          ctx.fillStyle = CANVAS.fg
          ctx.font = '500 14px Vazirmatn, sans-serif'
          ctx.fillText(`جواب درست: ${chMN.m} × ${chMN.n} = ${correct}`, w / 2, bannerY + 62)
        }
      } else {
        ctx.fillStyle = CANVAS.muted
        ctx.font = '500 13px Vazirmatn, sans-serif'
        ctx.fillText('یکی از گزینه‌ها را انتخاب کن', w / 2, 200)
      }
      return
    }

    // ── normal mode: tree diagram ──
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.fg
    ctx.font = '600 14px Vazirmatn, sans-serif'
    ctx.fillText(sc.title, w - 14, 24)

    const top = 46
    const bot = h - 52
    const xRoot = 52
    const x1 = Math.max(165, Math.min(250, w * 0.33))
    const x2 = Math.max(x1 + 110, w - 80)
    const showLabels = total <= 12

    const yRoot = (top + bot) / 2
    const pathIdx = reduced ? 0 : Math.floor(t * 1.4) % Math.max(1, total)
    const activeI = Math.floor(pathIdx / Math.max(1, n))
    const activeJ = pathIdx % Math.max(1, n)

    // edges root → level 1
    for (let i = 0; i < m; i++) {
      const y1 = top + ((bot - top) * (i + 0.5)) / m
      ctx.strokeStyle = i === activeI ? CANVAS.amber : CANVAS.grid
      ctx.lineWidth = i === activeI ? 2.5 : 1.2
      ctx.beginPath()
      ctx.moveTo(xRoot + 14, yRoot)
      ctx.lineTo(x1 - 14, y1)
      ctx.stroke()
    }
    // edges level 1 → leaves
    for (let i = 0; i < m; i++) {
      const y1 = top + ((bot - top) * (i + 0.5)) / m
      const bh = (bot - top) / m
      for (let j = 0; j < n; j++) {
        const y2 = y1 - bh * 0.36 + (bh * 0.72 * (j + 0.5)) / n
        const active = i === activeI && j === activeJ
        ctx.strokeStyle = active ? CANVAS.amber : CANVAS.grid
        ctx.lineWidth = active ? 2 : 1
        ctx.beginPath()
        ctx.moveTo(x1 + 14, y1)
        ctx.lineTo(x2 - 10, y2)
        ctx.stroke()
      }
    }
    // root node
    ctx.fillStyle = CANVAS.violet
    ctx.beginPath()
    ctx.arc(xRoot, yRoot, 14, 0, Math.PI * 2)
    ctx.fill()
    // level-1 nodes
    ctx.textAlign = 'center'
    for (let i = 0; i < m; i++) {
      const y1 = top + ((bot - top) * (i + 0.5)) / m
      ctx.fillStyle = i === activeI ? CANVAS.amber : CANVAS.teal
      ctx.beginPath()
      ctx.arc(x1, y1, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = CANVAS.bg
      ctx.font = '700 11px Vazirmatn, sans-serif'
      ctx.fillText(String(i + 1), x1, y1 + 4)
      // level-1 name
      ctx.fillStyle = i === activeI ? CANVAS.amber : CANVAS.muted
      ctx.font = '600 11px Vazirmatn, sans-serif'
      ctx.fillText(sc.l1[i], x1, y1 - 20)
      // leaves
      const bh = (bot - top) / m
      for (let j = 0; j < n; j++) {
        const y2 = y1 - bh * 0.36 + (bh * 0.72 * (j + 0.5)) / n
        const active = i === activeI && j === activeJ
        ctx.fillStyle = active ? CANVAS.amber : CANVAS.panelLight
        ctx.beginPath()
        ctx.arc(x2, y2, showLabels ? 9 : 3.5, 0, Math.PI * 2)
        ctx.fill()
        if (active) {
          ctx.strokeStyle = CANVAS.yellow
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x2, y2, 13, 0, Math.PI * 2)
          ctx.stroke()
        }
        if (showLabels) {
          ctx.fillStyle = active ? CANVAS.yellow : CANVAS.muted
          ctx.font = '500 11px Vazirmatn, sans-serif'
          ctx.textAlign = 'left'
          ctx.fillText(sc.l2[j], x2 + 14, y2 + 4)
          ctx.textAlign = 'center'
        }
      }
    }
    // caption
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.fg
    ctx.font = '700 15px Vazirmatn, sans-serif'
    ctx.fillText(`کل مسیرها = ${m} × ${n} = ${total}`, w / 2, h - 14)
  }

  const { canvasRef } = useSimCanvas(draw, 400)

  return (
    <SimFrame
      title="آزمایشگاه درخت شمارش"
      brief="هر مسیر از ریشه تا برگ، یک حالت کامل است — کل مسیرها = ضرب حالت‌های هر مرحله."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" />
      <div className="flex flex-wrap gap-3">
        <SimSelect<Scenario>
          label="سناریو"
          value={scenario}
          onChange={(v) => setScenario(v)}
          options={[
            { value: 'meal', label: 'غذا و نوشیدنی' },
            { value: 'outfit', label: 'پیراهن و شلوار' },
          ]}
        />
        <SimSlider
          label={`تعداد ${sc.n1}`}
          value={m}
          min={1}
          max={6}
          onChange={(v) => setM(v)}
        />
        <SimSlider
          label={`تعداد ${sc.n2}`}
          value={n}
          min={1}
          max={6}
          onChange={(v) => setN(v)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Readout label={sc.n1} value={String(m)} unit="حالت" />
        <Readout label={sc.n2} value={String(n)} unit="حالت" />
        <Readout label="کل مسیرها (ضرب)" value={fmt(total)} unit="مسیر" tone="text-amber-500" />
        <Readout label="جمع (اگر فقط یکی)" value={fmt(m + n)} unit="حالت" />
        <Legend color={CANVAS.amber} label="مسیر فعال" />
        <Legend color={CANVAS.teal} label={sc.n1} />
        <Legend color={CANVAS.panelLight} label={sc.n2} />
      </div>
      {chOn ? (
        <div className="space-y-2">
          <p role="status" className="text-sm font-medium">
            {chPicked === null
              ? 'چالش: چند مسیر ممکن است؟ یک گزینه را انتخاب کن.'
              : chPicked === chMN.m * chMN.n
                ? `✓ درست بود! ${chMN.m} × ${chMN.n} = ${chMN.m * chMN.n}`
                : `✗ اشتباه بود؛ جواب درست ${chMN.m * chMN.n} است.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {chOpts.map((o) => (
              <SimButton
                key={o}
                variant={chPicked === null ? 'default' : o === chMN.m * chMN.n ? 'secondary' : 'outline'}
                disabled={chPicked !== null}
                onClick={() => answer(o)}
              >
                {o}
              </SimButton>
            ))}
            <SimButton variant="secondary" onClick={startChallenge}>
              چالش جدید 🎲
            </SimButton>
            <SimButton variant="ghost" onClick={() => setChOn(false)}>
              بازگشت به درخت
            </SimButton>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <SimButton variant="secondary" onClick={startChallenge}>
            شروع چالش اصل ضرب 🎲
          </SimButton>
        </div>
      )}
    </SimFrame>
  )
}

// ─────────────────────────────────────────────── درس ۲ · جایگشت (جایگاه‌ها) ──

const LETTERS6 = ['آ', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح']

function C2Permutations() {
  const beep = useSimBeep()
  const reduced = useReducedMotion()
  const [n, setN] = useState(5)
  const [k, setK] = useState(3)
  // challenge state
  const [chOn, setChOn] = useState(false)
  const [chNK, setChNK] = useState({ n: 6, k: 3 })
  const [chOpts, setChOpts] = useState<number[]>([])
  const [chPicked, setChPicked] = useState<number | null>(null)

  const kk = Math.min(k, n)
  const p = nPr(n, kk)
  const fN = factorialSafe(n)
  const fD = factorialSafe(n - kk)

  const startChallenge = () => {
    const cn = 4 + Math.floor(Math.random() * 5) // 4..8
    const ck = 2 + Math.floor(Math.random() * Math.min(3, cn - 2)) // 2..4
    const correct = nPr(cn, ck)
    const pool = shuffle(
      [nCr(cn, ck), correct + cn, nPr(cn, ck - 1), correct * 2]
        .filter((v) => v !== correct && Number.isFinite(v) && v > 0)
        .filter((v, i, a) => a.indexOf(v) === i),
    ).slice(0, 2)
    setChNK({ n: cn, k: ck })
    setChOpts(shuffle([correct, ...pool]))
    setChPicked(null)
    setChOn(true)
  }

  const answer = (v: number) => {
    if (chPicked !== null) return
    setChPicked(v)
    if (v === nPr(chNK.n, chNK.k)) {
      beep(660, 120)
      window.setTimeout(() => beep(880, 160), 150)
    } else {
      beep(220, 200, 'square')
    }
  }

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.clearRect(0, 0, w, h)
    drawGrid(ctx, w, h)

    if (chOn) {
      const correct = nPr(chNK.n, chNK.k)
      const won = chPicked === correct
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.amber
      ctx.font = '700 20px Vazirmatn, sans-serif'
      ctx.fillText('چالش: مسابقه با فرمول', w / 2, 46)
      ctx.fillStyle = CANVAS.fg
      ctx.font = '600 17px Vazirmatn, sans-serif'
      ctx.fillText(
        `${chNK.n} شیء داریم و ${chNK.k} جایگاه — چند جایگشت؟  یعنی P(${chNK.n},${chNK.k}) = ?`,
        w / 2, 92,
      )
      if (chPicked !== null) {
        const bannerY = 150
        ctx.font = '700 17px Vazirmatn, sans-serif'
        if (won) {
          ctx.fillStyle = 'rgba(16,185,129,0.18)'
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.fill()
          ctx.strokeStyle = CANVAS.emerald
          ctx.lineWidth = 2
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.stroke()
          ctx.fillStyle = CANVAS.emerald
          ctx.fillText('✓ آفرین! جواب درست بود', w / 2, bannerY + 34)
          ctx.fillStyle = CANVAS.fg
          ctx.font = '500 14px Vazirmatn, sans-serif'
          const terms = Array.from({ length: chNK.k }, (_, i) => chNK.n - i).join(' × ')
          ctx.fillText(`P(${chNK.n},${chNK.k}) = ${terms} = ${correct}`, w / 2, bannerY + 62)
        } else {
          ctx.fillStyle = 'rgba(244,63,94,0.15)'
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.fill()
          ctx.strokeStyle = CANVAS.rose
          ctx.lineWidth = 2
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.stroke()
          ctx.fillStyle = CANVAS.rose
          ctx.fillText('✗ اشتباه بود؛ دوباره تلاش کن!', w / 2, bannerY + 34)
          ctx.fillStyle = CANVAS.fg
          ctx.font = '500 14px Vazirmatn, sans-serif'
          ctx.fillText(`جواب درست: P(${chNK.n},${chNK.k}) = ${correct}`, w / 2, bannerY + 62)
        }
      } else {
        ctx.fillStyle = CANVAS.muted
        ctx.font = '500 13px Vazirmatn, sans-serif'
        ctx.fillText('راهنما: n × (n−1) × … × (n−k+1)', w / 2, 150)
      }
      return
    }

    // items row
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.muted
    ctx.font = '600 12px Vazirmatn, sans-serif'
    ctx.fillText(`اشیاء (n = ${n})`, w / 2, 28)
    const r = 17
    const gap = Math.min(56, (w - 80) / Math.max(1, n))
    const x0 = w / 2 - ((n - 1) * gap) / 2
    for (let i = 0; i < n; i++) {
      const x = x0 + i * gap
      const used = i < kk
      ctx.fillStyle = used ? CANVAS.emerald : CANVAS.panelLight
      ctx.beginPath()
      ctx.arc(x, 64, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = used ? CANVAS.bg : CANVAS.muted
      ctx.font = '700 14px Vazirmatn, sans-serif'
      ctx.fillText(LETTERS6[i], x, 69)
    }

    // slots row
    const slotW = 54
    const slotGap = Math.min(72, (w - 60) / Math.max(1, kk))
    const sx0 = w / 2 - ((kk - 1) * slotGap) / 2
    for (let i = 0; i < kk; i++) {
      const x = sx0 + i * slotGap
      const isLast = i === kk - 1
      const pulse = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * 3)
      ctx.strokeStyle = isLast ? CANVAS.amber : CANVAS.teal
      ctx.lineWidth = isLast ? 2 + pulse : 1.6
      roundedRect(ctx, x - slotW / 2, 150, slotW, slotW, 10)
      ctx.stroke()
      ctx.fillStyle = 'rgba(20,184,166,0.12)'
      roundedRect(ctx, x - slotW / 2, 150, slotW, slotW, 10)
      ctx.fill()
      ctx.fillStyle = CANVAS.fg
      ctx.font = '700 18px Vazirmatn, sans-serif'
      ctx.fillText(LETTERS6[i], x, 150 + slotW / 2 + 6)
      ctx.fillStyle = CANVAS.amber
      ctx.font = '700 12px Vazirmatn, sans-serif'
      ctx.fillText(`${n - i} حالت`, x, 142)
      ctx.fillStyle = CANVAS.muted
      ctx.font = '500 11px Vazirmatn, sans-serif'
      ctx.fillText(`جایگاه ${i + 1}`, x, 150 + slotW + 18)
    }

    // formula strip
    const terms = Array.from({ length: kk }, (_, i) => n - i).join(' × ')
    ctx.fillStyle = CANVAS.fg
    ctx.font = '700 15px Vazirmatn, sans-serif'
    ctx.fillText(`P(${n},${kk}) = ${terms} = ${fmt(p)}`, w / 2, 262)
    if (Number.isFinite(fN) && Number.isFinite(fD) && fD !== 0) {
      ctx.fillStyle = CANVAS.muted
      ctx.font = '500 12px Vazirmatn, sans-serif'
      ctx.fillText(`فرمول: n! ÷ (n−k)! = ${fmt(fN)} ÷ ${fmt(fD)} = ${fmt(p)}`, w / 2, 286)
    }
    ctx.fillStyle = CANVAS.yellow
    ctx.font = '500 12px Vazirmatn, sans-serif'
    ctx.fillText('ترتیب مهم است: هر جابه‌جایی یک حالت جدید است', w / 2, 308)
  }

  const { canvasRef } = useSimCanvas(draw, 330)

  return (
    <SimFrame
      title="آزمایشگاه جایگاه‌های جایگشت"
      brief="جایگاه اول n انتخاب دارد، بعدی n−1 و … — حاصل‌ضرب، همان P(n,k) است."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" />
      <div className="flex flex-wrap gap-3">
        <SimSlider
          label="تعداد اشیاء (n)"
          value={n}
          min={2}
          max={8}
          onChange={(v) => {
            setN(v)
            if (k > v) setK(v)
          }}
        />
        <SimSlider label="تعداد جایگاه‌ها (k)" value={kk} min={1} max={n} onChange={(v) => setK(v)} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Readout label="n" value={String(n)} />
        <Readout label="k" value={String(kk)} />
        <Readout label="P(n,k)" value={fmt(p)} unit="جایگشت" tone="text-emerald-500" />
        <Readout label="n!" value={fmt(fN)} />
        <Legend color={CANVAS.emerald} label="اشیاء انتخاب‌شده" />
        <Legend color={CANVAS.panelLight} label="باقی‌مانده" />
      </div>
      {chOn ? (
        <div className="space-y-2">
          <p role="status" className="text-sm font-medium">
            {chPicked === null
              ? `چالش: ${chNK.n} شیء و ${chNK.k} جایگاه — چند جایگشت؟`
              : chPicked === nPr(chNK.n, chNK.k)
                ? `✓ درست بود! P(${chNK.n},${chNK.k}) = ${nPr(chNK.n, chNK.k)}`
                : `✗ اشتباه بود؛ جواب درست P(${chNK.n},${chNK.k}) = ${nPr(chNK.n, chNK.k)} است.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {chOpts.map((o) => (
              <SimButton
                key={o}
                variant={chPicked === null ? 'default' : o === nPr(chNK.n, chNK.k) ? 'secondary' : 'outline'}
                disabled={chPicked !== null}
                onClick={() => answer(o)}
              >
                {o}
              </SimButton>
            ))}
            <SimButton variant="secondary" onClick={startChallenge}>
              چالش جدید 🎲
            </SimButton>
            <SimButton variant="ghost" onClick={() => setChOn(false)}>
              بازگشت به آزمایشگاه
            </SimButton>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <SimButton variant="secondary" onClick={startChallenge}>
            شروع چالش: مسابقه با فرمول 🎲
          </SimButton>
        </div>
      )}
    </SimFrame>
  )
}

// ─────────────────────────────────────────────── درس ۳ · ترکیب (انتخاب گروه) ─

const LETTERS10 = ['آ', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د']

/** k-th subset (unranking via combinatorial number system) — exact & bounded. */
function subsetFromRank(n: number, k: number, rank: number): number[] {
  const res: number[] = []
  let idx = rank
  let rest = k
  for (let i = n; i >= 1 && rest > 0; i--) {
    const c = nCr(i - 1, rest - 1)
    if (idx < c) {
      res.push(i)
      rest--
    } else {
      idx -= c
    }
  }
  return res
}

function permsOf(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr]
  const out: number[][] = []
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
    for (const p of permsOf(rest)) out.push([arr[i], ...p])
  }
  return out
}

function C3Combinations() {
  const beep = useSimBeep()
  const reduced = useReducedMotion()
  const [n, setN] = useState(6)
  const [k, setK] = useState(2)
  // challenge state
  const [chOn, setChOn] = useState(false)
  const [chNK, setChNK] = useState({ n: 6, k: 3 })
  const [chOpts, setChOpts] = useState<number[]>([])
  const [chPicked, setChPicked] = useState<number | null>(null)

  const c = nCr(n, k)
  const p = nPr(n, k)
  const fK = factorialSafe(k)

  const startChallenge = () => {
    const cn = 5 + Math.floor(Math.random() * 5) // 5..9
    const ck = 2 + Math.floor(Math.random() * 3) // 2..4
    const correct = nCr(cn, ck)
    const pool = shuffle(
      [nPr(cn, ck), correct + cn, correct * 2, nCr(cn, ck) + nCr(cn, ck - 1)]
        .filter((v) => v !== correct && Number.isFinite(v) && v > 0)
        .filter((v, i, a) => a.indexOf(v) === i),
    ).slice(0, 2)
    setChNK({ n: cn, k: ck })
    setChOpts(shuffle([correct, ...pool]))
    setChPicked(null)
    setChOn(true)
  }

  const answer = (v: number) => {
    if (chPicked !== null) return
    setChPicked(v)
    if (v === nCr(chNK.n, chNK.k)) {
      beep(660, 120)
      window.setTimeout(() => beep(880, 160), 150)
    } else {
      beep(220, 200, 'square')
    }
  }

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.clearRect(0, 0, w, h)
    drawGrid(ctx, w, h)

    if (chOn) {
      const correct = nCr(chNK.n, chNK.k)
      const won = chPicked === correct
      ctx.textAlign = 'center'
      ctx.fillStyle = CANVAS.amber
      ctx.font = '700 20px Vazirmatn, sans-serif'
      ctx.fillText('چالش کمیته', w / 2, 46)
      ctx.fillStyle = CANVAS.fg
      ctx.font = '600 16px Vazirmatn, sans-serif'
      ctx.fillText(
        `از بین ${chNK.n} داوطلب، ${chNK.k} عضو کمیته انتخاب می‌شود (ترتیب مهم نیست)`,
        w / 2, 90,
      )
      ctx.fillStyle = CANVAS.yellow
      ctx.font = '700 17px Vazirmatn, sans-serif'
      ctx.fillText('چند کمیتهٔ مختلف می‌توان ساخت؟', w / 2, 122)
      if (chPicked !== null) {
        const bannerY = 165
        ctx.font = '700 17px Vazirmatn, sans-serif'
        if (won) {
          ctx.fillStyle = 'rgba(16,185,129,0.18)'
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.fill()
          ctx.strokeStyle = CANVAS.emerald
          ctx.lineWidth = 2
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.stroke()
          ctx.fillStyle = CANVAS.emerald
          ctx.fillText('✓ آفرین! جواب درست بود', w / 2, bannerY + 34)
          ctx.fillStyle = CANVAS.fg
          ctx.font = '500 14px Vazirmatn, sans-serif'
          ctx.fillText(`C(${chNK.n},${chNK.k}) = ${correct} — برای گروه، ترتیب مهم نیست`, w / 2, bannerY + 62)
        } else {
          ctx.fillStyle = 'rgba(244,63,94,0.15)'
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.fill()
          ctx.strokeStyle = CANVAS.rose
          ctx.lineWidth = 2
          roundedRect(ctx, w / 2 - 190, bannerY, 380, 92, 12)
          ctx.stroke()
          ctx.fillStyle = CANVAS.rose
          ctx.fillText('✗ اشتباه بود؛ دوباره تلاش کن!', w / 2, bannerY + 34)
          ctx.fillStyle = CANVAS.fg
          ctx.font = '500 14px Vazirmatn, sans-serif'
          ctx.fillText(`جواب درست: C(${chNK.n},${chNK.k}) = ${correct}`, w / 2, bannerY + 62)
        }
      } else {
        ctx.fillStyle = CANVAS.muted
        ctx.font = '500 13px Vazirmatn, sans-serif'
        ctx.fillText('یادآوری: C(n,k) = n! ÷ ( k! × (n−k)! )', w / 2, 165)
      }
      return
    }

    // ── dots row with rotating highlighted subset ──
    ctx.textAlign = 'center'
    const combos = nCr(n, k)
    const rot = reduced ? 0 : Math.floor(t / 1.2) % Math.max(1, combos)
    const subset = subsetFromRank(n, k, rot)
    const r = 15
    const gap = Math.min(64, (w - 70) / Math.max(1, n))
    const x0 = w / 2 - ((n - 1) * gap) / 2
    ctx.fillStyle = CANVAS.muted
    ctx.font = '600 12px Vazirmatn, sans-serif'
    ctx.fillText(`گروه شمارهٔ ${rot + 1} از ${fmt(combos)} گروه ممکن`, w / 2, 24)
    for (let i = 1; i <= n; i++) {
      const x = x0 + (i - 1) * gap
      const picked = subset.includes(i)
      ctx.fillStyle = picked ? CANVAS.emerald : CANVAS.panelLight
      ctx.beginPath()
      ctx.arc(x, 64, r, 0, Math.PI * 2)
      ctx.fill()
      if (picked) {
        ctx.strokeStyle = CANVAS.yellow
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, 64, r + 4, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.fillStyle = picked ? CANVAS.bg : CANVAS.muted
      ctx.font = '700 13px Vazirmatn, sans-serif'
      ctx.fillText(LETTERS10[i - 1], x, 69)
    }

    // ── left panel: C vs P bars (log-ish scale) ──
    const panelTop = 150
    const panelBot = h - 56
    const halfW = (w - 45) / 2
    ctx.fillStyle = CANVAS.muted
    ctx.font = '600 12px Vazirmatn, sans-serif'
    ctx.fillText('ترکیب در برابر جایگشت', halfW / 2 + 10, panelTop)
    const maxV = Math.max(c, p, 1)
    const scale = (v: number) => (Math.log(1 + v) / Math.log(1 + maxV)) * (panelBot - panelTop - 46)
    const barW = 44
    const bx1 = halfW / 2 - 4
    const bx2 = halfW / 2 + 52
    const base = panelBot - 24
    // C bar
    const hc = scale(c)
    ctx.fillStyle = CANVAS.emerald
    roundedRect(ctx, bx1 - barW / 2, base - hc, barW, hc, 6)
    ctx.fill()
    ctx.fillStyle = CANVAS.fg
    ctx.font = '700 12px Vazirmatn, sans-serif'
    ctx.fillText(fmt(c), bx1, base - hc - 8)
    ctx.fillStyle = CANVAS.muted
    ctx.font = '500 11px Vazirmatn, sans-serif'
    ctx.fillText('C (بدون ترتیب)', bx1, base + 16)
    // P bar
    const hp = scale(p)
    ctx.fillStyle = CANVAS.violet
    roundedRect(ctx, bx2 - barW / 2, base - hp, barW, hp, 6)
    ctx.fill()
    ctx.fillStyle = CANVAS.fg
    ctx.font = '700 12px Vazirmatn, sans-serif'
    ctx.fillText(fmt(p), bx2, base - hp - 8)
    ctx.fillStyle = CANVAS.muted
    ctx.font = '500 11px Vazirmatn, sans-serif'
    ctx.fillText('P (با ترتیب)', bx2, base + 16)
    ctx.strokeStyle = CANVAS.grid
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(10, base)
    ctx.lineTo(halfW - 10, base)
    ctx.stroke()

    // ── right panel: orderings of the same group ──
    const rx = halfW + 24
    ctx.textAlign = 'right'
    ctx.fillStyle = CANVAS.muted
    ctx.font = '600 12px Vazirmatn, sans-serif'
    ctx.fillText(
      k >= 1 && Number.isFinite(fK) ? `همین گروه ${k} نفره، ${fmt(fK)} ترتیب دارد:` : 'گروه خالی',
      w - 14,
      panelTop,
    )
    if (k >= 1 && k <= 4) {
      const names = subset.slice().sort((a, b) => a - b)
      const list = permsOf(names)
      ctx.font = '600 13px Vazirmatn, sans-serif'
      list.slice(0, 8).forEach((ord, i) => {
        ctx.fillStyle = i === 0 ? CANVAS.emerald : CANVAS.white
        const y = panelTop + 28 + i * 24
        if (y > panelBot - 6) return
        ctx.fillText(ord.map((v) => LETTERS10[v - 1]).join('  ،  '), w - 14, y)
      })
      if (list.length > 8) {
        ctx.fillStyle = CANVAS.muted
        ctx.font = '500 11px Vazirmatn, sans-serif'
        ctx.fillText('… و بقیهٔ ترتیب‌ها', w - 14, panelTop + 28 + 8 * 24)
      }
    } else if (k > 4) {
      ctx.fillStyle = CANVAS.white
      ctx.font = '600 13px Vazirmatn, sans-serif'
      ctx.fillText(`${fmt(fK)} ترتیب — برای نمایش زیاد است!`, w - 14, panelTop + 30)
      ctx.fillStyle = CANVAS.yellow
      ctx.font = '500 12px Vazirmatn, sans-serif'
      ctx.fillText('P = C × k! یعنی هر گروه k! بار شمرده می‌شود', w - 14, panelTop + 56)
    }
    ctx.textAlign = 'center'
    ctx.fillStyle = CANVAS.fg
    ctx.font = '700 15px Vazirmatn, sans-serif'
    ctx.fillText(`P(${n},${k}) = C(${n},${k}) × ${k}!  →  ${fmt(p)} = ${fmt(c)} × ${fmt(fK)}`, w / 2, h - 12)
  }

  const { canvasRef } = useSimCanvas(draw, 400)

  return (
    <SimFrame
      title="آزمایشگاه انتخاب گروه: C(n,k) در برابر P(n,k)"
      brief="ترتیب مهم نیست → هر گروه k! بار در جایگشت‌ها تکرار می‌شود؛ پس C = P ÷ k!."
    >
      <canvas ref={canvasRef} className="w-full rounded-lg border" />
      <div className="flex flex-wrap gap-3">
        <SimSlider
          label="تعداد نفرات (n)"
          value={n}
          min={1}
          max={10}
          onChange={(v) => {
            setN(v)
            if (k > v) setK(v)
          }}
        />
        <SimSlider label="اندازهٔ گروه (k)" value={k} min={0} max={n} onChange={(v) => setK(v)} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Readout label={`C(${n},${k})`} value={fmt(c)} unit="گروه" tone="text-emerald-500" />
        <Readout label={`P(${n},${k})`} value={fmt(p)} unit="جایگشت" tone="text-violet-400" />
        <Readout label="k!" value={fmt(fK)} />
        <Legend color={CANVAS.emerald} label="اعضای گروه فعال" />
        <Legend color={CANVAS.violet} label="جایگشت (با ترتیب)" />
      </div>
      {chOn ? (
        <div className="space-y-2">
          <p role="status" className="text-sm font-medium">
            {chPicked === null
              ? `چالش: کمیتهٔ ${chNK.k} نفره از ${chNK.n} داوطلب — چند حالت؟`
              : chPicked === nCr(chNK.n, chNK.k)
                ? `✓ درست بود! C(${chNK.n},${chNK.k}) = ${nCr(chNK.n, chNK.k)}`
                : `✗ اشتباه بود؛ جواب درست C(${chNK.n},${chNK.k}) = ${nCr(chNK.n, chNK.k)} است.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {chOpts.map((o) => (
              <SimButton
                key={o}
                variant={chPicked === null ? 'default' : o === nCr(chNK.n, chNK.k) ? 'secondary' : 'outline'}
                disabled={chPicked !== null}
                onClick={() => answer(o)}
              >
                {o}
              </SimButton>
            ))}
            <SimButton variant="secondary" onClick={startChallenge}>
              چالش جدید 🎲
            </SimButton>
            <SimButton variant="ghost" onClick={() => setChOn(false)}>
              بازگشت به آزمایشگاه
            </SimButton>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <SimButton variant="secondary" onClick={startChallenge}>
            شروع چالش کمیته 🎲
          </SimButton>
        </div>
      )}
    </SimFrame>
  )
}

// ─── registry ─────────────────────────────────────────────────────────────────

export const simsC6: Record<string, SimComponent> = {
  'c1-counting': C1Counting,
  'c2-permutations': C2Permutations,
  'c3-combinations': C3Combinations,
}
