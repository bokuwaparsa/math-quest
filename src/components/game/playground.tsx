// ─── Math Quest · Free-play math playground (sandbox mode) ─────────────────
'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getSim } from '@/components/sims/registry'
import { useGame } from '@/lib/game/progress'
import { useI18n } from '@/lib/game/i18n'
import { Sigma, CircleDot, TrendingUp, Dices } from 'lucide-react'

const SANDBOX = [
  { key: 't2-unit-circle', labelKey: 'pg.circle', descKey: 'pg.circleDesc', icon: CircleDot },
  { key: 'g4-sequences', labelKey: 'pg.seq', descKey: 'pg.seqDesc', icon: Sigma },
  { key: 'e2-parabola', labelKey: 'pg.parabola', descKey: 'pg.parabolaDesc', icon: TrendingUp },
  { key: 's1-probability', labelKey: 'pg.dice', descKey: 'pg.diceDesc', icon: Dices },
]

const emptySubscribe = () => () => {}

export function Playground() {
  const { t } = useI18n()
  const awardSpecial = useGame((s) => s.awardSpecial)
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  useEffect(() => {
    awardSpecial('sandbox-visitor')
  }, [awardSpecial])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('pg.title')}</h1>
        <p className="max-w-2xl text-muted-foreground">
          {t('pg.sub')}
        </p>
      </header>

      <Tabs defaultValue={SANDBOX[0].key} className="w-full">
        <TabsList className="flex-wrap h-auto">
          {SANDBOX.map((s) => (
            <TabsTrigger key={s.key} value={s.key} className="gap-1.5">
              <s.icon className="h-4 w-4" aria-hidden /> {t(s.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
        {SANDBOX.map((s) => {
          const Sim = getSim(s.key)
          return (
            <TabsContent key={s.key} value={s.key} className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground">{t(s.descKey)}</p>
              {mounted ? <Sim lessonId={s.key} sandbox /> : null}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
