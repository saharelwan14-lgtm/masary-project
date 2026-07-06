'use client'

import { useStore } from '@/lib/store'
import { ACHIEVEMENTS, computeMetrics } from '@/lib/study'
import { Card, CardContent } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { cn } from '@/lib/utils'
import { Trophy, Lock } from 'lucide-react'

export function Achievements() {
  const { state } = useStore()
  const metrics = computeMetrics(state) as unknown as Record<string, number>

  const items = ACHIEVEMENTS.map((a) => {
    const current = metrics[a.metric] ?? 0
    const unlocked = current >= a.target
    const pct = Math.min(100, Math.round((current / a.target) * 100))
    return { ...a, current, unlocked, pct }
  })

  const unlockedCount = items.filter((i) => i.unlocked).length

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold">الإنجازات ومراحل التقدم</h2>
        <p className="text-sm text-muted-foreground">
          فتحت {unlockedCount} من {items.length} إنجاز. استمر لتفتح الباقي!
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((a) => (
          <Card
            key={a.id}
            className={cn(a.unlocked && 'border-primary/40 bg-primary/5')}
          >
            <CardContent className="flex gap-3 p-4">
              <div
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl',
                  a.unlocked
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {a.unlocked ? (
                  <Trophy className="size-6" />
                ) : (
                  <Lock className="size-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.desc}</div>
                <div className="mt-2">
                  <ProgressBar value={a.pct} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {Math.min(a.current, a.target)} / {a.target}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
