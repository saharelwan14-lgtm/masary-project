'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { uid, todayKey, type Exam } from '@/lib/study'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Bell, CheckCircle2, CalendarClock } from 'lucide-react'

const DAY = 24 * 60 * 60 * 1000

function ExamRow({ exam }: { exam: Exam }) {
  const { setState } = useStore()
  const [now, setNow] = useState(() => Date.now())
  const [grade, setGrade] = useState('')

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [])

  const start = new Date(exam.datetime).getTime()
  // يوم ظهور النتيجة (بعد التصحيح) — الافتراضي بعد يوم من الامتحان
  const resultStart = exam.resultDate
    ? new Date(exam.resultDate + 'T00:00:00').getTime()
    : start + DAY
  const resultReady = now >= resultStart
  const upcoming = now < start
  const during = !upcoming && !resultReady

  // عدّ الأيام حتى الامتحان للتذكير
  const daysLeft = Math.ceil((start - now) / DAY)

  const dateLabel = new Date(exam.datetime).toLocaleString('ar-EG', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const resultLabel = new Date(resultStart).toLocaleDateString('ar-EG', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  function saveGrade() {
    const g = Number(grade)
    if (Number.isNaN(g)) return
    setState((prev) => ({
      ...prev,
      exams: prev.exams.map((e) => (e.id === exam.id ? { ...e, grade: g } : e)),
    }))
  }

  function remove() {
    setState((prev) => ({
      ...prev,
      exams: prev.exams.filter((e) => e.id !== exam.id),
    }))
  }

  const pct =
    exam.grade !== null ? Math.round((exam.grade / exam.maxGrade) * 100) : null

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-bold">{exam.subject}</div>
            <div className="text-xs text-muted-foreground">{dateLabel}</div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={remove}
            aria-label="حذف الامتحان"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>

        {upcoming && (
          <div className="flex items-center gap-2 rounded-lg bg-accent/25 px-3 py-2 text-sm font-medium text-accent-foreground">
            <Bell className="size-4 shrink-0" />
            {daysLeft <= 0
              ? 'الامتحان اليوم — بالتوفيق!'
              : daysLeft === 1
                ? 'تذكير: الامتحان غدًا — راجع جيدًا.'
                : `تذكير: باقي ${daysLeft} يوم على الامتحان.`}
          </div>
        )}
        {during && (
          <div className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">
            انتهى الامتحان — النتيجة تظهر يوم {resultLabel} بعد التصحيح.
          </div>
        )}

        {exam.grade === null && resultReady && (
          <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Bell className="size-4" />
              ظهرت النتيجة — سجّل درجتك
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder={`الدرجة من ${exam.maxGrade}`}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring"
              />
              <Button onClick={saveGrade}>
                <CheckCircle2 className="size-4" />
                حفظ النتيجة
              </Button>
            </div>
          </div>
        )}

        {exam.grade !== null && (
          <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
            <span className="text-sm font-medium">النتيجة</span>
            <span className="font-bold text-primary">
              {exam.grade} / {exam.maxGrade} ({pct}%)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function Exams() {
  const { state, setState } = useStore()
  const [subject, setSubject] = useState('')
  const [datetime, setDatetime] = useState('')
  const [resultDate, setResultDate] = useState('')
  const [maxGrade, setMaxGrade] = useState('50')

  function addExam() {
    if (!subject.trim() || !datetime) return
    // لو المستخدم ما حددش يوم النتيجة، نخليه اليوم التالي للامتحان
    let rDate = resultDate
    if (!rDate) {
      const d = new Date(datetime)
      d.setDate(d.getDate() + 1)
      rDate = todayKey(d)
    }
    const exam: Exam = {
      id: uid(),
      subject: subject.trim(),
      datetime: new Date(datetime).toISOString(),
      resultDate: rDate,
      grade: null,
      maxGrade: Number(maxGrade) || 50,
      note: '',
    }
    setState((prev) => ({ ...prev, exams: [...prev.exams, exam] }))
    setSubject('')
    setDatetime('')
    setResultDate('')
  }

  const sorted = [...state.exams].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  )

  const subjectOptions = state.subjects.map((s) => s.name)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <CalendarClock className="size-5 text-primary" />
          مواعيد الامتحانات
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          أضف موعد الامتحان ليذكّرك الموقع قبله، والنتيجة تُسجَّل في يوم منفصل بعد
          التصحيح (ليس نفس يوم الامتحان).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-4 text-primary" />
            إضافة امتحان
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <input
            list="subject-list"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="المادة"
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-ring"
          />
          <datalist id="subject-list">
            {subjectOptions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            موعد الامتحان
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-ring"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            يوم ظهور النتيجة (اختياري)
            <input
              type="date"
              value={resultDate}
              onChange={(e) => setResultDate(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-ring"
            />
          </label>
          <input
            type="number"
            value={maxGrade}
            onChange={(e) => setMaxGrade(e.target.value)}
            placeholder="الدرجة النهائية"
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-ring"
          />
          <Button onClick={addExam} size="lg" className="sm:col-span-1">
            <Plus className="size-4" />
            إضافة الامتحان
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">لا توجد امتحانات مسجلة.</p>
        )}
        {sorted.map((e) => (
          <ExamRow key={e.id} exam={e} />
        ))}
      </div>
    </div>
  )
}
