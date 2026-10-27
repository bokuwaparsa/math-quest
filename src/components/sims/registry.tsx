// ─── Math Quest · Simulation (widget) registry ────────────────────────────────
'use client'

import type { SimComponent, SimProps } from '@/lib/game/types'
import { simsC1 } from './math/c1'
import { simsC2 } from './math/c2'
import { simsC3 } from './math/c3'
import { simsC4 } from './math/c4'
import { simsC5 } from './math/c5'
import { simsC6 } from './math/c6'
import { simsC7 } from './math/c7'

export const SIMS: Record<string, SimComponent> = {
  ...simsC1,
  ...simsC2,
  ...simsC3,
  ...simsC4,
  ...simsC5,
  ...simsC6,
  ...simsC7,
}

/** Graceful placeholder rendered when a lesson's widget is not registered yet. */
export function MissingSim({ lessonId }: SimProps) {
  return (
    <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-muted-foreground/40 text-sm text-muted-foreground">
      ویجت تعاملی این درس در دسترس نیست.
    </div>
  )
}

export function getSim(key: string): SimComponent {
  return SIMS[key] ?? MissingSim
}
