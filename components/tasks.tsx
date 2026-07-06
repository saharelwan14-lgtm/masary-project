'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { uid, type Task, type TaskScope } from '@/lib/study'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'

const SCOPES: { key: TaskScope; label: string }[] = [
  { key: 'daily', label: 'يومية' },
  { key: 'weekly', label: 'أسبوعية' },
  { key: 'monthly', label: 'شهرية' },
]

function TaskColumn({ scope, label }: { scope: TaskScope; label: string }) {
  const { state, setState } = useStore()
  const [title, setTitle] = useState('')
  const tasks = state.tasks.filter((t) => t.scope === scope)

  function addTask() {
    const t = title.trim()
    if (!t) return
    const task: Task = {
      id: uid(),
      title: t,
      scope,
      done: false,
      createdAt: new Date().toISOString(),
    }
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }))
    setTitle('')
  }

  function toggle(id: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    }))
  }

  function remove(id: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }))
  }

  const done = tasks.filter((t) => t.done).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>مهام {label}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {done}/{tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">لا توجد مهام بعد.</p>
        )}
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggle(t.id)}
              className={cn(
                'flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-right text-sm transition-colors',
                t.done
                  ? 'border-primary/30 bg-primary/5 text-muted-foreground line-through'
                  : 'border-border bg-card hover:bg-muted',
              )}
            >
              {t.done ? (
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
              ) : (
                <Circle className="size-4 shrink-0 text-muted-foreground" />
              )}
              <span className="flex-1">{t.title}</span>
            </button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(t.id)}
              aria-label="حذف المهمة"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) addTask()
            }}
            placeholder={`أضف مهمة ${label}...`}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring"
          />
          <Button onClick={addTask}>
            <Plus className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function Tasks() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold">المهام</h2>
        <p className="text-sm text-muted-foreground">
          نظّم مهامك اليومية والأسبوعية والشهرية في مكان واحد.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {SCOPES.map((s) => (
          <TaskColumn key={s.key} scope={s.key} label={s.label} />
        ))}
      </div>
    </div>
  )
}
