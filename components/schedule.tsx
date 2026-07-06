'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import {
  WEEKDAYS,
  PRAYERS,
  MEALS,
  uid,
  type ScheduleBlock,
  type PrayerKey,
  type MealKey,
} from '@/lib/study'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarDays, Plus, Trash2, CheckCircle2, Code2, BookOpen } from 'lucide-react'

export function Schedule() {
  const { state, setState, today, updateToday } = useStore()
  const todayIdx = new Date().getDay()
  const [selected, setSelected] = useState<number>(todayIdx)

  const [time, setTime] = useState('')
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<'azhar' | 'programming'>('azhar')

  const blocks = [...(state.schedule[String(selected)] ?? [])].sort((a, b) =>
    a.time.localeCompare(b.time),
  )

  function addBlock() {
    if (!title.trim() || !time) return
    const block: ScheduleBlock = { id: uid(), time, title: title.trim(), kind }
    setState((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [String(selected)]: [...(prev.schedule[String(selected)] ?? []), block],
      },
    }))
    setTitle('')
    setTime('')
  }

  function removeBlock(id: string) {
    setState((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [String(selected)]: (prev.schedule[String(selected)] ?? []).filter(
          (b) => b.id !== id,
        ),
      },
    }))
  }

  function setPrayerTime(key: PrayerKey, value: string) {
    setState((prev) => ({
      ...prev,
      prayerTimes: { ...prev.prayerTimes, [key]: value },
    }))
  }

  function setMealTime(key: MealKey, value: string) {
    setState((prev) => ({
      ...prev,
      mealTimes: { ...prev.mealTimes, [key]: value },
    }))
  }

  const isToday = selected === todayIdx

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold">الجدول الأسبوعي</h2>
        <p className="text-sm text-muted-foreground">
          رتّب جدولك حسب الدور، وحدد مواعيد الصلاة والوجبات. برمجة كل درس مرتين
          بالأسبوع.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {WEEKDAYS.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={cn(
              'shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
              selected === i
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted',
            )}
          >
            {d}
            {i === todayIdx && (
              <span className="mr-1 text-[10px] opacity-80">(اليوم)</span>
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            جدول يوم {WEEKDAYS[selected]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {blocks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              لا يوجد حصص لهذا اليوم بعد. أضف حصة من الأسفل.
            </p>
          )}
          {blocks.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <span className="w-14 shrink-0 text-center text-sm font-bold tabular-nums text-primary">
                {b.time}
              </span>
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-lg',
                  b.kind === 'programming'
                    ? 'bg-accent/30 text-accent-foreground'
                    : 'bg-primary/10 text-primary',
                )}
              >
                {b.kind === 'programming' ? (
                  <Code2 className="size-4" />
                ) : (
                  <BookOpen className="size-4" />
                )}
              </span>
              <span className="flex-1 text-sm font-medium">{b.title}</span>
              {isToday && (
                <button
                  type="button"
                  onClick={() =>
                    updateToday((d) => ({
                      ...d,
                      attended: { ...d.attended, [b.id]: !d.attended[b.id] },
                    }))
                  }
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                    today.attended[b.id]
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted',
                  )}
                >
                  <CheckCircle2 className="size-3.5" />
                  {today.attended[b.id] ? 'حضرت' : 'حضّرت؟'}
                </button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeBlock(b.id)}
                aria-label="حذف الحصة"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="grid gap-2 rounded-xl border border-dashed border-border p-3 sm:grid-cols-[auto_1fr_auto_auto]">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-2 text-sm outline-none focus-visible:border-ring"
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) addBlock()
              }}
              placeholder="اسم الحصة / الدرس"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring"
            />
            <select
              value={kind}
              onChange={(e) =>
                setKind(e.target.value as 'azhar' | 'programming')
              }
              className="rounded-lg border border-border bg-background px-2.5 py-2 text-sm outline-none focus-visible:border-ring"
            >
              <option value="azhar">دراسي</option>
              <option value="programming">برمجة</option>
            </select>
            <Button onClick={addBlock} size="lg">
              <Plus className="size-4" />
              إضافة
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>مواعيد الصلاة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PRAYERS.map((p) => (
              <div key={p.key} className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{p.name}</span>
                <input
                  type="time"
                  value={state.prayerTimes[p.key]}
                  onChange={(e) => setPrayerTime(p.key, e.target.value)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مواعيد الوجبات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MEALS.map((m) => (
              <div key={m.key} className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{m.name}</span>
                <input
                  type="time"
                  value={state.mealTimes[m.key]}
                  onChange={(e) => setMealTime(m.key, e.target.value)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
