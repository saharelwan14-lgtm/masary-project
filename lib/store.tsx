'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  type AppState,
  type DayRecord,
  AZHAR_SUBJECTS,
  PROGRAMMING_SUBJECTS,
  emptyDay,
  emptyRatings,
  buildAutoTasks,
  todayKey,
  uid,
  getDevTitle,
} from './study'

const STORAGE_KEY = 'masari-state-v1'

function createInitialState(): AppState {
  return {
    profile: { name: 'المهندس يوسف' },
    days: {},
    subjects: [
      ...AZHAR_SUBJECTS.map((name) => ({
        id: uid(),
        name,
        category: 'azhar' as const,
        lessons: [],
        ratings: emptyRatings(),
        totalLessonsCount: 10, // قيمة افتراضية للتقييم والتحكم
      })),
      ...PROGRAMMING_SUBJECTS.map((name) => ({
        id: uid(),
        name,
        category: 'programming' as const,
        lessons: [],
        ratings: emptyRatings(),
        totalLessonsCount: 15,
      })),
    ],
    exams: [],
    tasks: [],
    habits: [
      { id: uid(), name: 'قراءة ورد القرآن' },
      { id: uid(), name: 'مراجعة سريعة قبل النوم' },
      { id: uid(), name: 'رياضة / مشي' },
      { id: uid(), name: 'الابتعاد عن التشتت' },
    ],
    schedule: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [], '6': [] },
    prayerTimes: { fajr: '05:00', dhuhr: '12:30', asr: '15:45', maghrib: '18:15', isha: '19:45' },
    mealTimes: { breakfast: '08:00', lunch: '14:00', dinner: '20:30' },
    totalPomodoros: 0,
    lastAutoGen: '',
    version: 1,
    finance: [], // تهيئة المصفوفة المالية
    aiDev: {
      level: 1,
      xp: 0,
      title: getDevTitle(1),
      dailyQuestions: [
        'ما هي الخوارزمية الفلسفية التي فهمتها اليوم في الذكاء الاصطناعي؟',
        'كيف قمت بتحسين أداء الكود الخاص بك اليوم؟'
      ]
    }
  }
}

function migrate(parsed: AppState): AppState {
  const base = createInitialState()
  const merged: AppState = { ...base, ...parsed }
  merged.subjects = (parsed.subjects ?? base.subjects).map((s) => ({
    ...s,
    lessons: s.lessons ?? [],
    ratings: { ...emptyRatings(), ...(s.ratings ?? {}) },
    totalLessonsCount: s.totalLessonsCount ?? 10
  }))
  merged.exams = (parsed.exams ?? []).map((e) => ({
    ...e,
    resultDate: e.resultDate ?? '',
  }))
  if (!merged.finance) merged.finance = []
  if (!merged.aiDev) merged.aiDev = base.aiDev
  return merged
}

function withAutoTasks(state: AppState): AppState {
  const key = todayKey()
  if (state.lastAutoGen === key) return state
  const kept = state.tasks.filter((t) => !t.auto)
  const generated = buildAutoTasks(state)
  
  // ترتيب المهام حسب الأولوية تلقائياً (High ثم Medium ثم Low) ومن ثم الوقت
  const sortedTasks = [...kept, ...generated].sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const pA = a.priority ? priorityOrder[a.priority] : 4;
    const pB = b.priority ? priorityOrder[b.priority] : 4;
    if (pA !== pB) return pA - pB;
    return (a.time ?? '').localeCompare(b.time ?? '');
  });

  return { ...state, tasks: sortedTasks, lastAutoGen: key }
}

interface StoreContextValue {
  state: AppState
  ready: boolean
  setState: (updater: (prev: AppState) => AppState) => void
  today: DayRecord
  updateToday: (updater: (prev: DayRecord) => DayRecord) => void
  regenerateAutoTasks: () => void
  reset: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setInternal] = useState<AppState>(createInitialState)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AppState
        setInternal(withAutoTasks(migrate(parsed)))
      } else {
        setInternal((prev) => withAutoTasks(prev))
      }
    } catch {
      // تجاهل الخطأ
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // تجاهل الخطأ
    }
  }, [state, ready])

  const setState = useCallback((updater: (prev: AppState) => AppState) => {
    setInternal((prev) => updater(prev))
  }, [])

  const key = todayKey()
  const today = state.days[key] ?? emptyDay(key)

  const updateToday = useCallback((updater: (prev: DayRecord) => DayRecord) => {
    const k = todayKey()
    setInternal((prev) => {
      const current = prev.days[k] ?? emptyDay(k)
      return { ...prev, days: { ...prev.days, [k]: updater(current) } }
    })
  }, [])

  const regenerateAutoTasks = useCallback(() => {
    setInternal((prev) => {
      const kept = prev.tasks.filter((t) => !t.auto)
      return {
        ...prev,
        tasks: [...kept, ...buildAutoTasks(prev)],
        lastAutoGen: todayKey(),
      }
    })
  }, [])

  const reset = useCallback(() => {
    setInternal(withAutoTasks(createInitialState()))
  }, [])

  return (
    <StoreContext.Provider value={{ state, ready, setState, today, updateToday, regenerateAutoTasks, reset }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}