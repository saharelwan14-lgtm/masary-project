// أنواع البيانات والثوابت والدوال المساعدة لموقع "مساري"

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'
export type MealKey = 'breakfast' | 'lunch' | 'dinner'
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type TaskScope = 'daily' | 'weekly' | 'monthly'
export type LessonStatus = 0 | 1 | 2 | 3 // لم يبدأ / ذاكرت / راجعت / أتقنت
export type TaskPriority = 'high' | 'medium' | 'low'

export interface DayRecord {
  date: string // YYYY-MM-DD
  prayers: Record<PrayerKey, boolean>
  meals: Record<MealKey, boolean>
  wakeUpTime: string // HH:MM
  habits: Record<string, boolean>
  attended: Record<string, boolean> // blockId -> حضرت الدرس
  pomodoros: number
  note: string
  aiReflection?: string // الإجابة اليومية لتقييم البرمجة
}

export interface SubjectLesson {
  id: string
  title: string
  status: LessonStatus
}

export type RatingKey =
  | 'attendance'
  | 'homework'
  | 'behavior'
  | 'understanding'
  | 'preparation'

export type SubjectRatings = Record<RatingKey, number>

export interface Subject {
  id: string
  name: string
  category: 'azhar' | 'programming'
  lessons: SubjectLesson[]
  ratings: SubjectRatings
  totalLessonsCount?: number // عدد دروس المادة الإجمالي للتقييم
}

export const RATINGS: { key: RatingKey; name: string }[] = [
  { key: 'attendance', name: 'حضور الحصص' },
  { key: 'homework', name: 'تأدية الواجب' },
  { key: 'behavior', name: 'السلوك' },
  { key: 'understanding', name: 'الفهم' },
  { key: 'preparation', name: 'التحضير' },
]

export function emptyRatings(): SubjectRatings {
  return {
    attendance: 0,
    homework: 0,
    behavior: 0,
    understanding: 0,
    preparation: 0,
  }
}

export interface ScheduleBlock {
  id: string
  time: string // HH:MM
  title: string
  kind: 'azhar' | 'programming'
}

export interface Exam {
  id: string
  subject: string
  datetime: string // ISO — موعد الامتحان
  resultDate: string
  grade: number | null
  maxGrade: number
  note: string
}

export interface Task {
  id: string
  title: string
  scope: TaskScope
  done: boolean
  createdAt: string
  auto?: boolean
  time?: string // وقت محدد للمهمة لترتيبها حسب الوقت والأولوية
  priority?: TaskPriority // الأولوية الافتراضية
}

export interface HabitDef {
  id: string
  name: string
  isCustom?: boolean // لتحديد العادات المضافة من قبلك
}

// واجهة البيانات المالية
export interface FinancialTransaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense' | 'savings'
  date: string
}

// واجهة حالة المبرمج للذكاء الاصطناعي
export interface AiDeveloperProfile {
  level: number // 1 - 50
  xp: number
  title: string // مبتدئ -> التنين المجنح
  dailyQuestions: string[] // أسئلة اليوم للفهم
}

export interface AppState {
  profile: { name: string }
  days: Record<string, DayRecord>
  subjects: Subject[]
  exams: Exam[]
  tasks: Task[]
  habits: HabitDef[]
  schedule: Record<string, ScheduleBlock[]>
  prayerTimes: Record<PrayerKey, string>
  mealTimes: Record<MealKey, string>
  totalPomodoros: number
  lastAutoGen: string
  version: number
  finance: FinancialTransaction[] // النظام المالي
  aiDev: AiDeveloperProfile // مسار برمجة الذكاء الاصطناعي
}

export const PRAYERS: { key: PrayerKey; name: string }[] = [
  { key: 'fajr', name: 'الفجر' },
  { key: 'dhuhr', name: 'الظهر' },
  { key: 'asr', name: 'العصر' },
  { key: 'maghrib', name: 'المغرب' },
  { key: 'isha', name: 'العشاء' },
]

export const MEALS: { key: MealKey; name: string }[] = [
  { key: 'breakfast', name: 'الفطار' },
  { key: 'lunch', name: 'الغداء' },
  { key: 'dinner', name: 'العشاء' },
]

export const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
export const LESSON_STATUS_LABELS = ['لم يبدأ', 'ذاكرت', 'راجعت', 'أتقنت']

export const AZHAR_SUBJECTS = [
  'فيزياء', 'كيمياء', 'أحياء', 'إنجليزي (درس أول)', 'إنجليزي (درس ثانٍ)',
  'فقه', 'تفسير', 'حديث', 'توحيد', 'مطالعة', 'نصوص', 'أدب', 'نحو', 'صرف', 'بلاغة', 'قرآن'
]

export const PROGRAMMING_SUBJECTS = ['أساسيات البرمجة', 'مشاريع تطبيقية']

export const QUOTES = [
  'من جدّ وجد، ومن زرع حصد.', 'العلم في الصغر كالنقش على الحجر.',
  'لا تؤجل عمل اليوم إلى الغد.', 'الطريق إلى النجاح خطوة كل يوم.',
  'ذاكر الآن لتفرح لاحقًا.', 'النجاح مجموع مجهودات صغيرة تتكرر كل يوم.'
]

export interface AchievementDef {
  id: string
  title: string
  desc: string
  target: number
  metric: 'streak' | 'pomodoros' | 'mastered' | 'lessonsStudied' | 'prayersTotal' | 'tasksDone'
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'a1', title: 'بداية الطريق', desc: 'أكمل أول ميزانية وجلسة مذاكرة', target: 1, metric: 'pomodoros' },
  { id: 'a2', title: 'مثابر', desc: 'أكمل 10 جلسات مذاكرة', target: 10, metric: 'pomodoros' },
  { id: 'a3', title: 'التنين المبتدئ', desc: 'أكمل 50 جلسة مذاكرة والتحم بالبرمجة', target: 50, metric: 'pomodoros' },
  { id: 'a4', title: 'سبعة أيام', desc: 'حافظ على نشاطك 7 أيام متتالية', target: 7, metric: 'streak' },
]

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function emptyDay(date: string): DayRecord {
  return {
    date,
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    meals: { breakfast: false, lunch: false, dinner: false },
    wakeUpTime: '',
    habits: {},
    attended: {},
    pomodoros: 0,
    note: '',
    aiReflection: ''
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function getDevTitle(level: number): string {
  if (level >= 50) return 'التنين المجنح 🐉'
  if (level >= 40) return 'خبير خوارزميات الذكاء الاصطناعي 🧠'
  if (level >= 30) return 'مهندس نماذج التعلم العميق ⚡'
  if (level >= 20) return 'مطور بايثون وماشين ليرنينج متمكن 🐍'
  if (level >= 10) return 'مطور ذكاء اصطناعي صاعد 🚀'
  return 'مبرمج ذكاء اصطناعي مبتدئ 🌱'
}

export function subjectProgress(s: Subject): number {
  if (s.lessons.length === 0) return 0
  const total = s.lessons.reduce((acc, l) => acc + l.status, 0)
  return Math.round((total / (s.lessons.length * 3)) * 100)
}

export function subjectRatingAvg(s: Subject): number {
  if (!s.ratings) return 0
  const keys = Object.keys(s.ratings) as RatingKey[]
  if (keys.length === 0) return 0
  const total = keys.reduce((acc, key) => acc + (s.ratings[key] || 0), 0)
  return Math.round(total / keys.length)
}

export function dayCompletion(day: DayRecord): number {
  const prayers = PRAYERS.filter((p) => day.prayers[p.key]).length
  const meals = MEALS.filter((m) => day.meals[m.key]).length
  const wake = day.wakeUpTime ? 1 : 0
  const done = prayers + meals + wake
  const total = PRAYERS.length + MEALS.length + 1
  return Math.round((done / total) * 100)
}

export function computeStreak(days: Record<string, DayRecord>): number {
  let streak = 0
  const d = new Date()
  for (let i = 0; i < 400; i++) {
    const key = todayKey(d)
    const rec = days[key]
    const active = rec && (rec.pomodoros > 0 || PRAYERS.some((p) => rec.prayers[p.key]) || !!rec.wakeUpTime)
    if (active) streak++
    else if (i === 0) {} 
    else break
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export function computeMetrics(state: AppState) {
  const days = Object.values(state.days)
  const prayersTotal = days.reduce(
    (acc, d) => acc + PRAYERS.filter((p) => d.prayers[p.key]).length,
    0,
  )
  const allLessons = state.subjects.flatMap((s) => s.lessons)
  const mastered = allLessons.filter((l) => l.status === 3).length
  const lessonsStudied = allLessons.filter((l) => l.status >= 1).length
  const tasksDone = state.tasks.filter((t) => t.done).length
  return {
    streak: computeStreak(state.days),
    pomodoros: state.totalPomodoros,
    mastered,
    lessonsStudied,
    prayersTotal,
    tasksDone,
  }
}

export function computeGeneralProgress(state: AppState): number {
  const disc = evaluateDiscipline(state).score
  const prog = evaluateProgress(state).score
  return Math.round((disc + prog) / 2)
}

export function evaluateDiscipline(state: AppState): Evaluation {
  const days: DayRecord[] = []
  const d = new Date()
  for (let i = 0; i < 14; i++) {
    const rec = state.days[todayKey(d)]
    if (rec) days.push(rec)
    d.setDate(d.getDate() - 1)
  }
  const n = Math.max(days.length, 1)

  const prayersPct = Math.round((days.reduce((a, r) => a + PRAYERS.filter((p) => r.prayers[p.key]).length, 0) / (n * PRAYERS.length)) * 100)
  const wakePct = Math.round((days.filter((r) => !!r.wakeUpTime).length / n) * 100)
  const habitCount = Math.max(state.habits.length, 1)
  const habitsPct = Math.round((days.reduce((a, r) => a + state.habits.filter((h) => r.habits[h.id]).length, 0) / (n * habitCount)) * 100)
  const tasksPct = Math.round((state.tasks.filter((t) => t.done).length / Math.max(state.tasks.length, 1)) * 100)

  const rows = [
    { label: 'المحافظة على الصلاة', value: prayersPct },
    { label: 'الاستيقاظ مبكرًا', value: wakePct },
    { label: 'الالتزام بالعادات', value: habitsPct },
    { label: 'إنجاز المهام', value: tasksPct },
  ]
  return { score: Math.round(rows.reduce((a, r) => a + r.value, 0) / rows.length), label: verdict(Math.round(rows.reduce((a, r) => a + r.value, 0) / rows.length)), rows }
}

export function evaluateProgress(state: AppState): Evaluation {
  const allLessons = state.subjects.flatMap((s) => s.lessons)
  const lessonPct = allLessons.length === 0 ? 0 : Math.round((allLessons.reduce((a, l) => a + l.status, 0) / (allLessons.length * 3)) * 100)
  const gradedExams = state.exams.filter((e) => e.grade !== null)
  const examPct = gradedExams.length === 0 ? 0 : Math.round(gradedExams.reduce((a, e) => a + ((e.grade as number) / e.maxGrade) * 100, 0) / gradedExams.length)

  const rows = [
    { label: 'تقدم الدروس', value: lessonPct },
    { label: 'نتائج الامتحانات', value: examPct },
  ]
  return { score: Math.round(rows.reduce((a, r) => a + r.value, 0) / rows.length), label: verdict(Math.round(rows.reduce((a, r) => a + r.value, 0) / rows.length)), rows }
}

function verdict(score: number): string {
  if (score >= 90) return 'ممتاز'
  if (score >= 75) return 'جيد جدًا'
  if (score >= 60) return 'جيد'
  if (score >= 40) return 'مقبول'
  return 'يحتاج تحسين'
}

export function buildAutoTasks(state: AppState, base = new Date()): Task[] {
  const todayIdx = base.getDay()
  const yest = new Date(base)
  yest.setDate(base.getDate() - 1)
  const yestIdx = yest.getDay()

  const todayBlocks = [...(state.schedule[String(todayIdx)] ?? [])]
  const yestBlocks = [...(state.schedule[String(yestIdx)] ?? [])]

  const nowIso = base.toISOString()
  const tasks: Task[] = []

  yestBlocks.forEach((b) => {
    tasks.push({
      id: uid(),
      title: `حل واجب: ${b.title} (درس أمس)`,
      scope: 'daily',
      done: false,
      createdAt: nowIso,
      auto: true,
      time: b.time,
      priority: 'high'
    })
  })

  todayBlocks.forEach((b) => {
    tasks.push({
      id: uid(),
      title: `تحضير ومذاكرة: ${b.title} (درس اليوم)`,
      scope: 'daily',
      done: false,
      createdAt: nowIso,
      auto: true,
      time: b.time,
      priority: 'medium'
    })
  })

  return tasks
}

export function quoteOfDay(): string {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const diff = Number(new Date()) - Number(start)
  const dayOfYear = Math.floor(diff / 86400000)
  return QUOTES[dayOfYear % QUOTES.length]
}

export interface EvalRow {
  label: string
  value: number
}

export interface Evaluation {
  score: number
  label: string
  rows: EvalRow[]
}