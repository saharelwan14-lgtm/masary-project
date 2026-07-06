'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import {
  PRAYERS,
  MEALS,
  uid,
  type HabitDef,
} from '@/lib/study'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Moon, Utensils, Sun, CheckCircle2, Plus, Trash2 } from 'lucide-react'

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:bg-muted',
      )}
    >
      {active && <CheckCircle2 className="size-4" />}
      {children}
    </button>
  )
}

export function DailyTracker() {
  const { today, updateToday, state, setState } = useStore()
  const [newHabit, setNewHabit] = useState('')

  const dateLabel = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  function addHabit() {
    const name = newHabit.trim()
    if (!name) return
    const habit: HabitDef = { id: uid(), name }
    setState((prev) => ({ ...prev, habits: [...prev.habits, habit] }))
    setNewHabit('')
  }

  function removeHabit(id: string) {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold">المتابعة اليومية</h2>
        <p className="text-sm text-muted-foreground">{dateLabel}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="size-4 text-accent-foreground" />
            وقت الاستيقاظ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="time"
            value={today.wakeUpTime}
            onChange={(e) =>
              updateToday((d) => ({ ...d, wakeUpTime: e.target.value }))
            }
            className="w-full max-w-40 rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="size-4 text-primary" />
            الصلوات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {PRAYERS.map((p) => (
              <Chip
                key={p.key}
                active={today.prayers[p.key]}
                onClick={() =>
                  updateToday((d) => ({
                    ...d,
                    prayers: { ...d.prayers, [p.key]: !d.prayers[p.key] },
                  }))
                }
              >
                {p.name}
              </Chip>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="size-4 text-accent-foreground" />
            الوجبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {MEALS.map((m) => (
              <Chip
                key={m.key}
                active={today.meals[m.key]}
                onClick={() =>
                  updateToday((d) => ({
                    ...d,
                    meals: { ...d.meals, [m.key]: !d.meals[m.key] },
                  }))
                }
              >
                {m.name}
              </Chip>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>عاداتي اليومية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {state.habits.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateToday((d) => ({
                      ...d,
                      habits: { ...d.habits, [h.id]: !d.habits[h.id] },
                    }))
                  }
                  aria-pressed={!!today.habits[h.id]}
                  className={cn(
                    'flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                    today.habits[h.id]
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-card hover:bg-muted',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-md border',
                      today.habits[h.id]
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border',
                    )}
                  >
                    {today.habits[h.id] && <CheckCircle2 className="size-3.5" />}
                  </span>
                  {h.name}
                </button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeHabit(h.id)}
                  aria-label={`حذف ${h.name}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) addHabit()
              }}
              placeholder="أضف عادة جديدة..."
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <Button onClick={addHabit} size="lg">
              <Plus className="size-4" />
              إضافة
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ملاحظات اليوم</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={today.note}
            onChange={(e) =>
              updateToday((d) => ({ ...d, note: e.target.value }))
            }
            rows={3}
            placeholder="اكتب أي ملاحظة عن يومك..."
            className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </CardContent>
      </Card>
    </div>
  )
}
