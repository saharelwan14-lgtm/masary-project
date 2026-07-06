'use client'

import { useStore } from '@/lib/store'
import {
  computeMetrics,
  dayCompletion,
  quoteOfDay,
  todayKey,
  emptyDay,
  ACHIEVEMENTS,
  PRAYERS,
  WEEKDAYS,
  subjectProgress,
} from '@/lib/study'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import {
  Flame,
  Timer,
  Trophy,
  BookOpen,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

function Stat({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  tint: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tint}`}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-extrabold leading-none">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const { state, today } = useStore()
  const metrics = computeMetrics(state)
  const completion = dayCompletion(today)

  const unlocked = ACHIEVEMENTS.filter(
    (a) => (metrics as Record<string, number>)[a.metric] >= a.target,
  ).length

  const prayersToday = PRAYERS.filter((p) => today.prayers[p.key]).length

  // ملخص آخر 7 أيام
  const week = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = todayKey(d)
    const rec = state.days[key] ?? emptyDay(key)
    return { label: WEEKDAYS[d.getDay()], value: dayCompletion(rec) }
  })

  const topSubjects = [...state.subjects]
    .filter((s) => s.lessons.length > 0)
    .sort((a, b) => subjectProgress(b) - subjectProgress(a))
    .slice(0, 4)

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-primary/20 bg-primary text-primary-foreground">
        <CardContent className="flex items-start gap-3 p-5">
          <Sparkles className="mt-0.5 size-6 shrink-0 opacity-90" />
          <div>
            <div className="text-xs font-medium opacity-80">نصيحة اليوم</div>
            <p className="mt-1 text-lg font-bold leading-relaxed text-balance">
              {quoteOfDay()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          icon={<Flame className="size-5 text-accent-foreground" />}
          label="أيام متتالية من النشاط"
          value={metrics.streak}
          tint="bg-accent/30"
        />
        <Stat
          icon={<Timer className="size-5 text-primary" />}
          label="جلسات مذاكرة (بومودورو)"
          value={metrics.pomodoros}
          tint="bg-primary/10"
        />
        <Stat
          icon={<Trophy className="size-5 text-accent-foreground" />}
          label="إنجازات مفتوحة"
          value={`${unlocked}/${ACHIEVEMENTS.length}`}
          tint="bg-accent/30"
        />
        <Stat
          icon={<BookOpen className="size-5 text-primary" />}
          label="دروس أتقنتها"
          value={metrics.mastered}
          tint="bg-primary/10"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>إنجاز اليوم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-extrabold text-primary">
                {completion}%
              </span>
              <span className="text-sm text-muted-foreground">
                صلوات اليوم: {prayersToday}/5
              </span>
            </div>
            <ProgressBar value={completion} className="h-3" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              يحسب من الصلوات والوجبات ووقت الاستيقاظ. تابع يومك من صفحة
              «المتابعة اليومية».
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر 7 أيام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 pt-2">
              {week.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end justify-center">
                    <div
                      className="w-full max-w-8 rounded-t-md bg-primary/80 transition-all"
                      style={{ height: `${Math.max(4, d.value)}%` }}
                      title={`${d.value}%`}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            أعلى المواد تقدمًا
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topSubjects.length === 0 && (
            <p className="text-sm text-muted-foreground">
              لسه ما أضفت دروس للمواد. ابدأ من صفحة «المواد الدراسية».
            </p>
          )}
          {topSubjects.map((s) => (
            <div key={s.id} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">
                  {subjectProgress(s)}%
                </span>
              </div>
              <ProgressBar value={subjectProgress(s)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
