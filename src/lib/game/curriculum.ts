// ─── Math Quest · Curriculum registry & helpers ───────────────────────────────
'use client'

import type { Lesson, Unit, UnitId } from '@/lib/game/types'

import { lessonsCh1 } from '@/data/math/ch1'
import { lessonsCh2 } from '@/data/math/ch2'
import { lessonsCh3 } from '@/data/math/ch3'
import { lessonsCh4 } from '@/data/math/ch4'
import { lessonsCh5 } from '@/data/math/ch5'
import { lessonsCh6 } from '@/data/math/ch6'
import { lessonsCh7 } from '@/data/math/ch7'

/** The 7 chapters of the Grade-10 math textbook (ریاضی ۱). */
export const UNITS: Unit[] = [
  {
    id: 'ch1', title: 'مجموعه، الگو و دنباله', tagline: 'مجموعه‌ها، متمم، الگوها و دنباله‌ها',
    accent: 'text-orange-600 dark:text-orange-400', hex: '#ea580c',
    lessonIds: [...lessonsCh1].sort((a, b) => a.order - b.order).map((l) => l.id),
  },
  {
    id: 'ch2', title: 'مثلثات', tagline: 'نسبت‌های مثلثاتی و دایرهٔ مثلثاتی',
    accent: 'text-teal-600 dark:text-teal-400', hex: '#0d9488',
    lessonIds: [...lessonsCh2].sort((a, b) => a.order - b.order).map((l) => l.id),
  },
  {
    id: 'ch3', title: 'توان‌های گویا و عبارت‌های جبری', tagline: 'ریشه، توان و ساده‌سازی جبری',
    accent: 'text-rose-600 dark:text-rose-400', hex: '#e11d48',
    lessonIds: [...lessonsCh3].sort((a, b) => a.order - b.order).map((l) => l.id),
  },
  {
    id: 'ch4', title: 'معادله‌ها و نامعادله‌ها', tagline: 'معادلهٔ درجه دوم، سهمی و تعیین علامت',
    accent: 'text-violet-600 dark:text-violet-400', hex: '#7c3aed',
    lessonIds: [...lessonsCh4].sort((a, b) => a.order - b.order).map((l) => l.id),
  },
  {
    id: 'ch5', title: 'تابع', tagline: 'مفهوم تابع، دامنه و برد',
    accent: 'text-amber-600 dark:text-amber-400', hex: '#d97706',
    lessonIds: [...lessonsCh5].sort((a, b) => a.order - b.order).map((l) => l.id),
  },
  {
    id: 'ch6', title: 'شمارش، بدون شمردن', tagline: 'اصل شمارش، جایگشت و ترکیب',
    accent: 'text-emerald-600 dark:text-emerald-400', hex: '#059669',
    lessonIds: [...lessonsCh6].sort((a, b) => a.order - b.order).map((l) => l.id),
  },
  {
    id: 'ch7', title: 'آمار و احتمال', tagline: 'شانس، جامعه و نمونه، متغیر',
    accent: 'text-fuchsia-600 dark:text-fuchsia-400', hex: '#c026d3',
    lessonIds: [...lessonsCh7].sort((a, b) => a.order - b.order).map((l) => l.id),
  },
]

const ALL_LESSONS: Lesson[] = [
  ...lessonsCh1, ...lessonsCh2, ...lessonsCh3, ...lessonsCh4,
  ...lessonsCh5, ...lessonsCh6, ...lessonsCh7,
]

const LESSON_MAP = new Map<string, Lesson>(ALL_LESSONS.map((l) => [l.id, l]))

export function getLesson(id: string): Lesson | undefined {
  return LESSON_MAP.get(id)
}

export function getUnit(id: UnitId): Unit {
  return UNITS.find((u) => u.id === id) ?? UNITS[0]
}

export function allLessons(): Lesson[] {
  return UNITS.flatMap((u) => u.lessonIds.map((id) => LESSON_MAP.get(id)!)).filter(Boolean)
}

export function nextLessonAfter(id: string): Lesson | undefined {
  const list = allLessons()
  const i = list.findIndex((l) => l.id === id)
  return i >= 0 && i < list.length - 1 ? list[i + 1] : undefined
}

export function searchLessons(query: string, unit?: UnitId | 'all', difficulty?: string | 'all'): Lesson[] {
  const q = query.trim().toLowerCase()
  return allLessons().filter((l) => {
    if (unit && unit !== 'all' && l.unitId !== unit) return false
    if (difficulty && difficulty !== 'all' && l.difficulty !== difficulty) return false
    if (!q) return true
    const hay = [
      l.title, l.tagline, ...l.objectives,
      getUnit(l.unitId).title,
    ].join(' ').toLowerCase()
    return hay.includes(q)
  })
}

// ─── Textbook coverage map (کتاب درسی ریاضی ۱) ───────────────────────────────
// The 7 chapters of the official Grade-10 math textbook and the lesson(s)
// that teach each one. Chapter titles follow the printed فهرست.
export interface BookChapter {
  ch: number
  title: string
  lessonIds: string[]
}

export const BOOK_CHAPTERS: BookChapter[] = [
  {
    ch: 1, title: 'مجموعه، الگو و دنباله',
    lessonIds: ['g1-sets', 'g2-complement', 'g3-patterns', 'g4-sequences'],
  },
  {
    ch: 2, title: 'مثلثات',
    lessonIds: ['t1-trig-ratios', 't2-unit-circle', 't3-trig-relations'],
  },
  {
    ch: 3, title: 'توان‌های گویا و عبارت‌های جبری',
    lessonIds: ['p1-root-power', 'p2-nth-root', 'p3-rational-powers', 'p4-algebraic-expressions'],
  },
  {
    ch: 4, title: 'معادله‌ها و نامعادله‌ها',
    lessonIds: ['e1-quadratic-equations', 'e2-parabola', 'e3-sign-analysis'],
  },
  {
    ch: 5, title: 'تابع',
    lessonIds: ['f1-function-concept', 'f2-domain-range', 'f3-function-types'],
  },
  {
    ch: 6, title: 'شمارش، بدون شمردن',
    lessonIds: ['c1-counting', 'c2-permutations', 'c3-combinations'],
  },
  {
    ch: 7, title: 'آمار و احتمال',
    lessonIds: ['s1-probability', 's2-population-sample', 's3-variables'],
  },
]

export function bookChapterProgress(chapter: BookChapter, completed: Set<string>): 'done' | 'started' | 'todo' {
  const states = chapter.lessonIds.map((id) => completed.has(id))
  if (states.every(Boolean)) return 'done'
  if (states.some(Boolean)) return 'started'
  return 'todo'
}

// ─── Ranks & badges ──────────────────────────────────────────────────────────
export const RANKS = [
  'نوآموز', 'جستجوگر', 'شمارش‌گر', 'الگویاب', 'معادله‌باز',
  'تابع‌شناس', 'حل‌کننده', 'ریاضی‌دان', 'استاد ریاضی', 'افسانهٔ ریاضی',
]

export function levelFor(xp: number): number {
  return Math.floor(xp / 300) + 1
}

export function rankFor(xp: number): string {
  return RANKS[Math.min(levelFor(xp) - 1, RANKS.length - 1)]
}

export function xpIntoLevel(xp: number): number {
  return xp % 300
}

export interface SpecialBadge {
  id: string
  title: string
  description: string
  icon: string // lucide icon key handled in UI
}

export const SPECIAL_BADGES: SpecialBadge[] = [
  { id: 'first-lesson', title: 'اولین قدم', description: 'اولین درس را کامل کن', icon: 'Footprints' },
  { id: 'five-lessons', title: 'گرم شدی', description: '۵ درس را کامل کن', icon: 'CircleGauge' },
  { id: 'ten-lessons', title: 'نیمی از راه', description: '۱۰ درس را کامل کن', icon: 'Hill' },
  { id: 'twenty-lessons', title: 'پشتکار', description: '۲۰ درس را کامل کن', icon: 'Mountain' },
  { id: 'all-lessons', title: 'قهرمان ریاضی', description: 'همهٔ درس‌های بازی را کامل کن', icon: 'Trophy' },
  { id: 'perfect-quiz', title: 'بی‌نقص', description: 'در یک آزمون نمرهٔ کامل بگیر', icon: 'Sparkles' },
  { id: 'streak-3', title: 'سه روز پیاپی', description: '۳ روز پشت‌سرهم بازی کن', icon: 'Flame' },
  { id: 'sandbox-visitor', title: 'ذهن باز', description: 'به زمین بازی ریاضی سر بزن', icon: 'Wand2' },
]
