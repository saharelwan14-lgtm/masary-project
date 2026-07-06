'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Timer, Play, Pause, RotateCcw } from 'lucide-react'

const FOCUS = 25 * 60
const BREAK = 5 * 60

export function Pomodoro() {
  const { state, updateToday, setState, today } = useStore()
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const [remaining, setRemaining] = useState(FOCUS)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = mode === 'focus' ? FOCUS : BREAK

  const beep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.value = 0.1
      osc.start()
      setTimeout(() => {
        osc.stop()
        ctx.close()
      }, 500)
    } catch {
      // تجاهل لو الصوت غير مدعوم
    }
  }, [])

  const finishSession = useCallback(() => {
    beep()
    if (mode === 'focus') {
      // احتساب جلسة مذاكرة مكتملة
      setState((prev) => ({ ...prev, totalPomodoros: prev.totalPomodoros + 1 }))
      updateToday((d) => ({ ...d, pomodoros: d.pomodoros + 1 }))
      setMode('break')
      setRemaining(BREAK)
    } else {
      setMode('focus')
      setRemaining(FOCUS)
    }
    setRunning(false)
  }, [beep, mode, setState, updateToday])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  useEffect(() => {
    if (running && remaining === 0) {
      finishSession()
    }
  }, [remaining, running, finishSession])

  function reset() {
    setRunning(false)
    setRemaining(mode === 'focus' ? FOCUS : BREAK)
  }

  function switchMode(m: 'focus' | 'break') {
    setRunning(false)
    setMode(m)
    setRemaining(m === 'focus' ? FOCUS : BREAK)
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const progress = ((total - remaining) / total) * 100
  const circumference = 2 * Math.PI * 120

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold">مؤقت المذاكرة</h2>
        <p className="text-sm text-muted-foreground">
          تقنية بومودورو: 25 دقيقة تركيز و5 دقائق راحة.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => switchMode('focus')}
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
            mode === 'focus'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted',
          )}
        >
          تركيز 25 دقيقة
        </button>
        <button
          onClick={() => switchMode('break')}
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
            mode === 'break'
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted',
          )}
        >
          راحة 5 دقائق
        </button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <div className="relative flex size-64 items-center justify-center">
            <svg className="size-64 -rotate-90" viewBox="0 0 260 260">
              <circle
                cx="130"
                cy="130"
                r="120"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="14"
              />
              <circle
                cx="130"
                cy="130"
                r="120"
                fill="none"
                stroke={mode === 'focus' ? 'var(--primary)' : 'var(--accent)'}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progress / 100) * circumference}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-6xl font-extrabold tabular-nums">
                {mm}:{ss}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                {mode === 'focus' ? 'وقت التركيز' : 'وقت الراحة'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="lg" onClick={() => setRunning((r) => !r)}>
              {running ? (
                <>
                  <Pause className="size-4" /> إيقاف مؤقت
                </>
              ) : (
                <>
                  <Play className="size-4" /> ابدأ
                </>
              )}
            </Button>
            <Button size="lg" variant="outline" onClick={reset}>
              <RotateCcw className="size-4" />
              إعادة
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Timer className="size-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-extrabold">{today.pomodoros}</div>
              <div className="text-xs text-muted-foreground">جلسات اليوم</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-accent/30">
              <Timer className="size-5 text-accent-foreground" />
            </div>
            <div>
              <div className="text-2xl font-extrabold">
                {state.totalPomodoros}
              </div>
              <div className="text-xs text-muted-foreground">
                إجمالي الجلسات
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
