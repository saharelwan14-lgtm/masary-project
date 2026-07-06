'use client'

import React, { useState } from 'react'
import { useStore } from '@/lib/store'
import { Dashboard } from '@/components/dashboard'
import { DailyTracker } from '@/components/daily-tracker'
import { SubjectManager } from '@/components/subject-manager'
import { Tasks } from '@/components/tasks'
import { Exams } from '@/components/exams'
import { Pomodoro } from '@/components/pomodoro'
import { Schedule } from '@/components/schedule'
import { Achievements } from '@/components/achievements'
import { todayKey, PRAYERS } from '@/lib/study'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { 
  LayoutDashboard, CheckSquare, BookOpen, Calendar, GraduationCap, 
  Timer, Wallet, History, Menu, ChevronRight, ChevronLeft, Plus, 
  Trash2, ArrowUpRight, ArrowDownLeft, Trophy, Code2, CheckCircle2, XCircle, FileText, Sparkles
} from 'lucide-react'

// دالة حساب رتبة البرمجة من لفل 1 إلى 50 بالتفصيل
function getProgrammingRank(level: number): string {
  if (level <= 5) return 'مبتدئ الشفرة 🌱'
  if (level <= 10) return 'مستكشف بايثون الصغير 🐍'
  if (level <= 15) return 'مطور واجهات فرونت-إند واعد 💻'
  if (level <= 20) return 'محارب الخوارزميات وهياكل البيانات ⚔️'
  if (level <= 25) return 'مهندس خلفيات فلاسك وقواعد البيانات 🗄️'
  if (level <= 30) return 'خبير Full-Stack داهية 🚀'
  if (level <= 35) return 'مطور نماذج ذكاء اصطناعي وتعلم آلي 🧠'
  if (level <= 40) return 'صياد الثغرات ومخترع سيبراني 🛡️'
  if (level <= 45) return 'جنرال ومخطط معماري للبرمجيات 👑'
  return 'التنين المجنح الأسطوري العظيم 🐉🔥'
}

export function AppShell() {
  const { state, dispatch } = useStore()
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'tracker' | 'subjects' | 'tasks' | 'exams' | 'pomodoro' | 'schedule' | 'finance' | 'history' | 'achievements' | 'ai-dev'>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // ==========================================
  // 💻 نظام تقييم البرمجة الديناميكي (المهندس يوسف)
  // ==========================================
  const [conceptTitle, setConceptTitle] = useState('')
  const [appliedProject, setAppliedProject] = useState('')
  const [understandingLevel, setUnderstandingLevel] = useState<'basic' | 'good' | 'excellent'>('good')

  const currentDevLevel = state?.aiDev?.level || 1
  const currentDevXp = state?.aiDev?.xp || 0
  const programmingLogs = state?.aiDev?.logs || [] // سجل التقنيات المفهومة والمطبقة
  const xpNeededForNextLevel = 100

  const handleAddProgrammingAchievement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!conceptTitle || !appliedProject) return

    // حساب الـ XP بناءً على مستوى الفهم والتطبيق الفعلي
    let xpGained = 20 // مسبق للفهم الأساسي
    if (understandingLevel === 'good') xpGained = 40
    if (understandingLevel === 'excellent') xpGained = 60

    let newXp = currentDevXp + xpGained
    let newLevel = currentDevLevel

    while (newXp >= xpNeededForNextLevel && newLevel < 50) {
      newXp -= xpNeededForNextLevel
      newLevel += 1
    }

    const newLog = {
      id: Math.random().toString(36).slice(2, 10),
      concept: conceptTitle,
      project: appliedProject,
      level: understandingLevel,
      xpGained,
      date: todayKey()
    }

    dispatch({
      type: 'SET_STATE',
      payload: {
        ...state,
        aiDev: {
          level: newLevel,
          xp: newXp,
          logs: [newLog, ...programmingLogs]
        }
      }
    })

    setConceptTitle('')
    setAppliedProject('')
  }

  // ==========================================
  // 📚 نظام التقييم الدراسي التلقائي الذكي
  // ==========================================
  // حساب تقييم تراكمي للمواد بناءً على: الحضور، درجات الامتحانات والواجبات، والتحضير والملخصات الطلوبة
  const calculateAcademicScore = () => {
    const subjects = state?.subjects || []
    if (subjects.length === 0) return 0

    let totalScore = 0
    let criteriaCount = 0

    subjects.forEach((sub: any) => {
      // 1. الحضور والالتزام (25%)
      const attendanceRate = sub.attendanceRate || 0
      totalScore += attendanceRate * 0.25

      // 2. متوسط درجات الامتحانات (35%)
      const exams = (state?.exams || []).filter((e: any) => e.subjectId === sub.id)
      const avgExamScore = exams.length > 0 
        ? (exams.reduce((sum: number, e: any) => sum + (e.score || 0), 0) / exams.length)
        : 80 // قيمة افتراضية متوسطة في حال عدم وجود امتحانات بعد
      totalScore += avgExamScore * 0.35

      // 3. حل الواجبات المدرسية (20%)
      const tasks = (state?.tasks || []).filter((t: any) => t.subjectId === sub.id)
      const completedTasks = tasks.filter((t: any) => t.completed).length
      const taskRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 90
      totalScore += taskRate * 0.20

      // 4. التحضير وتلخيص الدروس المطلوبة (20%)
      const preparationRate = sub.preparationRate || 0 // نسبة مئوية يتم تحديثها من مدير المواد
      totalScore += preparationRate * 0.20

      criteriaCount++
    })

    return criteriaCount > 0 ? Math.round(totalScore / criteriaCount) : 0
  }

  const academicPerformance = calculateAcademicScore()

  // دالة تحديد الوصف الدراسي التلقائي
  const getAcademicStatusLabel = (score: number) => {
    if (score >= 95) return '🎯 ممتاز مع مرتبة الشرف الصدارة (مستعد تماماً للامتحانات)'
    if (score >= 85) return '✨ متفوق ومستقر جداً (استمر على هذا المنوال)'
    if (score >= 75) return '📚 جيد جداً ولكن يحتاج لتكثيف التلخيصات والواجبات'
    if (score >= 60) return '⚠️ مقبول (هناك تقصير في الحضور أو درجات الاختبارات)'
    return '🚨 حرج جداً (مستوى بحاجة لمراجعة طارئة لجدول المذاكرة)'
  }

  // حالات القسم المالي
  const [finTitle, setFinTitle] = useState('')
  const [finAmount, setFinAmount] = useState('')
  const [finType, setFinType] = useState<'income' | 'expense' | 'savings'>('expense')

  // حالة يوم الأرشيف المختار
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(todayKey())

  // إضافة معاملة مالية
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!finTitle || !finAmount) return
    const tx = {
      id: Math.random().toString(36).slice(2, 10),
      title: finTitle,
      amount: parseFloat(finAmount),
      type: finType,
      date: todayKey()
    }
    dispatch({ type: 'SET_STATE', payload: { ...state, finance: [...(state?.finance || []), tx] } })
    setFinTitle('')
    setFinAmount('')
  }

  const handleDeleteTransaction = (id: string) => {
    const updated = (state?.finance || []).filter(t => t.id !== id)
    dispatch({ type: 'SET_STATE', payload: { ...state, finance: updated } })
  }

  const finTransactions = state?.finance || []
  const totalIncome = finTransactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0)
  const totalExpense = finTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0)
  const totalSavings = finTransactions.filter(t => t.type === 'savings').reduce((a, b) => a + b.amount, 0)
  const balance = totalIncome - totalExpense - totalSavings

  const historyRecord = state?.days?.[selectedHistoryDate] || null
  const historyTasks = (state?.tasks || []).filter(t => t.date === selectedHistoryDate || t.dueDate === selectedHistoryDate)
  const historyExams = (state?.exams || []).filter(e => e.date === selectedHistoryDate)

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans antialiased" dir="rtl">
      
      {/* القائمة الجانبية (Sidebar) */}
      <aside className={`bg-card border-l border-border flex flex-col transition-all duration-300 relative z-20 ${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border overflow-hidden">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">م</div>
              <span className="font-extrabold text-xl text-emerald-600 tracking-tight">مَسَاري</span>
            </div>
          )}
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'لوحة التحكم الرئيسية', icon: <LayoutDashboard className="size-4" /> },
            { id: 'tracker', label: 'المتابعة اليومية والصلاة', icon: <CheckSquare className="size-4" /> },
            { id: 'tasks', label: 'إدارة المهام والأولويات', icon: <CheckSquare className="size-4" /> },
            { id: 'subjects', label: 'المواد الدراسية والتقييم', icon: <BookOpen className="size-4" /> },
            { id: 'schedule', label: 'جدول الحصص والدروس', icon: <Calendar className="size-4" /> },
            { id: 'exams', label: 'مواعيد الامتحانات وقربها', icon: <GraduationCap className="size-4" /> },
            { id: 'pomodoro', label: 'عداد بومودورو للتركيز', icon: <Timer className="size-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentTab === tab.id ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              {tab.icon}
              {sidebarOpen && <span className="truncate">{tab.label}</span>}
            </button>
          ))}

          <hr className="my-2 border-border" />

          {/* مسار البرمجة للباشمهندس يوسف */}
          <button
            onClick={() => setCurrentTab('ai-dev')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentTab === 'ai-dev' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20'}`}
          >
            <Code2 className="size-4" />
            {sidebarOpen && <span>مسار تقييم البرمجة الذاتي 🐉</span>}
          </button>

          {/* لوحة الإنجازات */}
          <button
            onClick={() => setCurrentTab('achievements')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentTab === 'achievements' ? 'bg-amber-500 text-black shadow-sm font-bold' : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20'}`}
          >
            <Trophy className="size-4" />
            {sidebarOpen && <span>لوحة الإنجازات والأوسمة</span>}
          </button>

          <hr className="my-2 border-border" />
          
          <button
            onClick={() => setCurrentTab('finance')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentTab === 'finance' ? 'bg-teal-600 text-white shadow-sm font-bold' : 'text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/20'}`}
          >
            <Wallet className="size-4" />
            {sidebarOpen && <span>القسم المالي الخاص</span>}
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentTab === 'history' ? 'bg-orange-600 text-white shadow-sm font-bold' : 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20'}`}
          >
            <History className="size-4" />
            {sidebarOpen && <span>سجل الأيام والأرشيف التفصيلي</span>}
          </button>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="size-4" />
            </Button>
            <h1 className="font-bold text-lg text-foreground">
              {currentTab === 'dashboard' && 'لوحة القيادة والمؤشرات الكلية'}
              {currentTab === 'tracker' && 'المتابعة اليومية'}
              {currentTab === 'tasks' && 'قائمة المهام المجدولة'}
              {currentTab === 'subjects' && 'إدارة المواد والتقييمات الذكية'}
              {currentTab === 'schedule' && 'الجدول الأسبوعي'}
              {currentTab === 'exams' && 'جدول الامتحانات القادمة'}
              {currentTab === 'pomodoro' && 'مؤقت بومودورو'}
              {currentTab === 'finance' && 'إدارة الدخل والمصاريف'}
              {currentTab === 'history' && 'مستعرض واستدعاء بيانات الأرشيف'}
              {currentTab === 'achievements' && 'الأوسمة والإنجازات المحققة'}
              {currentTab === 'ai-dev' && 'نظام تقييم وتطور لفل البرمجة'}
            </h1>
          </div>
          
          {/* عرض التقييم الأكاديمي والبرمجي السريع بالهيدر لزيادة الحماس */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-full">
              <Code2 className="size-3.5" />
              <span>لفل البرمجة: {currentDevLevel}</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
              <GraduationCap className="size-3.5" />
              <span>المعدل الأكاديمي: {academicPerformance}%</span>
            </div>
            <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-mono">
              اليوم: {todayKey()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* بطاقة التقييم الأكاديمي الذكي المضافة لربط المواد الدراسية */}
              <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-right">
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 justify-center sm:justify-start">
                      <Sparkles className="size-3.5 animate-pulse" /> مؤشر الأداء الأكاديمي التراكمي
                    </div>
                    <CardTitle className="text-xl font-extrabold text-foreground">
                      {getAcademicStatusLabel(academicPerformance)}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      محسوب تلقائياً من واقع الحضور، نسب التلخيص والتحضير، وحل واجبات ودرجات اختبارات المواد بالسيستم.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-card px-5 py-3 rounded-2xl border shadow-sm shrink-0">
                    <div className="text-center">
                      <div className="text-3xl font-black text-emerald-600 font-mono">{academicPerformance}%</div>
                      <div className="text-[10px] text-muted-foreground font-bold">الدرجة الكلية</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Dashboard />
            </div>
          )}
          
          {currentTab === 'tracker' && <DailyTracker />}
          {currentTab === 'subjects' && <SubjectManager />}
          {currentTab === 'tasks' && <Tasks />}
          {currentTab === 'exams' && <Exams />}
          {currentTab === 'pomodoro' && <Pomodoro />}
          {currentTab === 'schedule' && <Schedule />}
          {currentTab === 'achievements' && <Achievements />}

          {/* 🐉 لوحة تقييم الـ 50 لفل للبرمجة القائمة على المدخلات الحقيقية */}
          {currentTab === 'ai-dev' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                
                {/* عمود إدخال البيانات المفهومة والمطبقة */}
                <Card className="md:col-span-1 border-indigo-500/20 bg-card">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="size-4 text-indigo-600" />
                      تسجيل إنجاز برمجي
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddProgrammingAchievement} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground">التقنية / المفهوم الذي فهمته</label>
                        <input 
                          type="text" 
                          placeholder="مثال: الـ Structs في C، الـ Hooks في React" 
                          value={conceptTitle} 
                          onChange={e => setConceptTitle(e.target.value)} 
                          required 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground">المشروع أو الكود الذي طبقت عليه</label>
                        <input 
                          type="text" 
                          placeholder="مثال: نظام إدارة الصيدلية، لوحة مساري" 
                          value={appliedProject} 
                          onChange={e => setAppliedProject(e.target.value)} 
                          required 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground">مستوى استيعابك وتماسك الكود</label>
                        <select 
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" 
                          value={understandingLevel} 
                          onChange={e => setUnderstandingLevel(e.target.value as any)}
                        >
                          <option value="basic">فهمت الأساسيات وجربت كود بسيط (+20 XP)</option>
                          <option value="good">استيعاب ممتاز وحللت مشكلات جيدة الكفاءة (+40 XP)</option>
                          <option value="excellent">اتقان تام وبناء مشروع صلب بمفردي (+60 XP)</option>
                        </select>
                      </div>
                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-bold">
                        <Plus className="size-4" /> احتساب وتطوير المستوي
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* لوحة عرض اللفل والتقدم الحالي للباشمهندس */}
                <Card className="md:col-span-2 border-indigo-500/20 bg-indigo-500/5 flex flex-col justify-between">
                  <CardHeader className="text-center pb-2">
                    <Code2 className="size-12 mx-auto text-indigo-600 mb-1" />
                    <CardTitle className="text-lg font-extrabold text-indigo-950 dark:text-indigo-200">نظام الرتب المتطور للمهندس يوسف</CardTitle>
                    <p className="text-xs text-muted-foreground">يتم ترقية رتبتك تلقائياً كلما أضفت تقنيات قمت بتطبيقها عملياً</p>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
                    <div className="p-4 bg-card rounded-2xl border text-center space-y-2 shadow-sm">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">الرتبة البرمجية الحالية بناءً على الإنتاجية</div>
                      <div className="text-xl font-black text-indigo-600">
                        {getProgrammingRank(currentDevLevel)}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-mono px-4 pt-1 border-t">
                        <span>مستوى المهندس: <strong className="text-indigo-600 text-sm">{currentDevLevel} / 50</strong></span>
                        <span>الـ XP الحالي: <strong>{currentDevXp} / {xpNeededForNextLevel}</strong></span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <ProgressBar value={(currentDevXp / xpNeededForNextLevel) * 100} />
                      </div>
                    </div>

                    <div className="rounded-xl border p-3 bg-card space-y-2 text-xs">
                      <h4 className="font-bold text-indigo-950 dark:text-indigo-300">🗺️ دليل المستويات الخمسين السريع:</h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground font-medium">
                        <div className="p-1.5 bg-muted/40 rounded">🌱 1 - 5: مبتدئ الشفرة</div>
                        <div className="p-1.5 bg-muted/40 rounded">💻 6 - 15: بايثون وواجهات فرونت</div>
                        <div className="p-1.5 bg-muted/40 rounded">🚀 16 - 30: فلاسك، نكست وخوارزميات</div>
                        <div className="p-1.5 bg-indigo-600 text-white rounded text-center font-bold col-span-2">
                          🐉 لفل 46 - 50: التنين المجنح الأسطوري العظيم 🔥
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* سجل التقنيات المطبقة تفصيلياً */}
              <Card className="border-border">
                <CardHeader><CardTitle className="text-base flex items-center gap-2">📂 سجل التقنيات المفهومة والمشاريع التطبيقية</CardTitle></CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  {programmingLogs.length === 0 ? (
                    <p className="p-6 text-sm text-center text-muted-foreground italic">لا توجد تقنيات مسجلة بعد. ابدأ بكتابة ما فهمته وطبقته بالأعلى لتفعيل لوحة التحكم.</p>
                  ) : (
                    <table className="w-full text-sm text-right">
                      <thead className="bg-muted text-xs">
                        <tr>
                          <th className="p-3">التقنية / المفهوم</th>
                          <th className="p-3">المشروع التطبيقي</th>
                          <th className="p-3">جودة الاستيعاب</th>
                          <th className="p-3">الـ XP المكتسب</th>
                          <th className="p-3">التاريخ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {programmingLogs.map((log: any) => (
                          <tr key={log.id} className="hover:bg-muted/30">
                            <td className="p-3 font-bold text-indigo-600">{log.concept}</td>
                            <td className="p-3 font-medium">{log.project}</td>
                            <td className="p-3 text-xs">
                              <span className={`px-2 py-0.5 rounded-full font-bold ${log.level === 'excellent' ? 'bg-emerald-100 text-emerald-800' : log.level === 'good' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                                {log.level === 'excellent' ? 'اتقان تام 🎯' : log.level === 'good' ? 'فهم ممتاز ✨' : 'أساسي 🌱'}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-emerald-600">+{log.xpGained} XP</td>
                            <td className="p-3 text-xs text-muted-foreground font-mono">{log.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* القسم المالي الخاص */}
          {currentTab === 'finance' && (
            <div className="space-y-6">
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600"><CardContent className="p-4 flex items-center gap-3"><ArrowUpRight className="size-8" /><div><div className="text-2xl font-black">{totalIncome} ج.م</div><div className="text-xs">إجمالي الدخل</div></div></CardContent></Card>
                <Card className="bg-destructive/10 border-destructive/20 text-destructive"><CardContent className="p-4 flex items-center gap-3"><ArrowDownLeft className="size-8" /><div><div className="text-2xl font-black">{totalExpense} ج.م</div><div className="text-xs">إجمالي المصاريف</div></div></CardContent></Card>
                <Card className="bg-blue-500/10 border-blue-500/20 text-blue-600"><CardContent className="p-4 flex items-center gap-3"><Wallet className="size-8" /><div><div className="text-2xl font-black">{totalSavings} ج.م</div><div className="text-xs">المدخرات</div></div></CardContent></Card>
                <Card className="bg-primary/10 border-primary/20 text-primary"><CardContent className="p-4 flex items-center gap-3"><Wallet className="size-8" /><div><div className="text-2xl font-black">{balance} ج.م</div><div className="text-xs">الصافي المتبقي</div></div></CardContent></Card>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                  <CardHeader><CardTitle className="text-base">تسجيل معاملة مالية</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddTransaction} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">البيان / الوصف</label>
                        <input type="text" placeholder="مثال: مصاريف درس، كتب خارجية" value={finTitle} onChange={e => setFinTitle(e.target.value)} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">المبلغ (ج.م)</label>
                        <input type="number" placeholder="0.00" value={finAmount} onChange={e => setFinAmount(e.target.value)} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">التصنيف</label>
                        <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={finType} onChange={e => setFinType(e.target.value as any)}>
                          <option value="expense">مصروفات (-)</option>
                          <option value="income">دخل وارد (+)</option>
                          <option value="savings">مدخرات محجوزة (🔒)</option>
                        </select>
                      </div>
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="size-4" /> حفظ المعاملة</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader><CardTitle className="text-base">دفتر الحسابات اليومي</CardTitle></CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    {finTransactions.length === 0 ? <p className="p-6 text-sm text-center text-muted-foreground">لا توجد حركات مالية مسجلة.</p> : (
                      <table className="w-full text-sm text-right"><thead className="bg-muted text-xs"><tr><th className="p-3">البيان</th><th className="p-3">النوع</th><th className="p-3">المبلغ</th><th className="p-3 text-center">إجراء</th></tr></thead>
                        <tbody className="divide-y divide-border">{finTransactions.map(t => (
                            <tr key={t.id} className="hover:bg-muted/50"><td className="p-3 font-medium">{t.title}</td><td>{t.type === 'income' ? 'وارد' : t.type === 'savings' ? 'إدخار' : 'منصرف'}</td><td className="p-3 font-bold">{t.amount} ج.م</td><td className="p-3 text-center"><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive size-8" onClick={() => handleDeleteTransaction(t.id)}><Trash2 className="size-4" /></Button></td></tr>
                          ))}</tbody></table>)}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* واجهة استرجاع وتتبع بيانات الأرشيف */}
          {currentTab === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <Card className="border-orange-500/20 bg-orange-500/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold">
                    <History className="size-5" />
                    مستعرض وباحث سجل الأيام والذكريات لـ مَسَاري
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground block">اختر أي يوم قمت بتسجيله من الرزنامة لعرض بياناته فوراً وبأثر رجعي:</label>
                    <input 
                      type="date" 
                      value={selectedHistoryDate} 
                      onChange={e => setSelectedHistoryDate(e.target.value)} 
                      className="flex h-10 w-full sm:w-64 rounded-md border border-orange-500/40 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                
                {/* الصلوات الخمس وسجلها التاريخي */}
                <Card>
                  <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2">🕌 صلوات هذا اليوم المسجلة</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {PRAYERS.map(p => {
                      const prayed = historyRecord?.prayers?.[p.key]
                      return (
                        <div key={p.key} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border text-sm">
                          <span className="font-medium">{p.name}</span>
                          <div className="flex items-center gap-1.5">
                            {prayed ? (
                              <><CheckCircle2 className="size-4 text-emerald-600" /><span className="text-xs font-bold text-emerald-600">تمت في وقتها وجماعة ✓</span></>
                            ) : (
                              <><XCircle className="size-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">غير مسجلة في هذا التاريخ ✗</span></>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* الحضور والدروس وحل الواجبات المدرسية */}
                <Card>
                  <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2">📚 حضور الدروس والواجبات المدرسية والمنزلية</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-xl border space-y-2">
                      <div className="text-xs font-bold text-muted-foreground mb-1">حالة حضور الحصص المجدولة والدروس للشهادات:</div>
                      {historyRecord?.attended && Object.keys(historyRecord.attended).length > 0 ? (
                        Object.keys(historyRecord.attended).map((blockId, idx) => (
                          <div key={idx} className="text-xs bg-emerald-500/10 text-emerald-700 p-2 rounded border border-emerald-500/20 flex justify-between items-center">
                            <span>✓ درس/حصة برقم معرّف [{blockId}]</span>
                            <span className="font-bold">حضرته وعلمت عليه بنجاح</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">لم تكن هناك حصص مؤكدة حضورها في هذا اليوم بالذات.</p>
                      )}
                    </div>

                    <div className="p-3 bg-muted/50 rounded-xl border space-y-2">
                      <div className="text-xs font-bold text-muted-foreground mb-1">الواجبات والمهام المنتهية في هذا التاريخ:</div>
                      {historyTasks.length > 0 ? (
                        historyTasks.map(task => (
                          <div key={task.id} className="text-xs p-2 rounded border bg-card flex justify-between items-center">
                            <span className={task.completed ? 'line-through text-muted-foreground' : 'font-medium'}>{task.title}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {task.completed ? 'حليته وأنجزته مية مية ✓' : 'لم يحل بعد في هذا الميعاد ✗'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">لا توجد واجبات أو مهام منشأة ومسجلة مباشرة لهذا التاريخ في الـ Database.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* نتائج الامتحانات والملاحظات المدونة تفصيلياً */}
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2">📊 نتائج الامتحانات والاختبارات الدورية</CardTitle></CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="p-3 rounded-xl border bg-card space-y-2">
                      <div className="text-xs font-bold text-muted-foreground">الاختبارات التي صادفت هذا اليوم ونتاجها المحفوظ:</div>
                      {historyExams.length > 0 ? (
                        historyExams.map(exam => (
                          <div key={exam.id} className="p-2 rounded bg-muted/60 text-xs flex justify-between items-center border">
                            <div>
                              <span className="font-bold text-foreground block">{exam.title}</span>
                              <span className="text-[10px] text-muted-foreground">المادة المرتبطة: {exam.subjectId}</span>
                            </div>
                            <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                              {exam.score !== undefined ? `الدرجة: ${exam.score}` : 'تمت المذاكرة والميعاد اليوم'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">لا توجد اختبارات مسجلة أو مضافة في تاريخ اليوم المحدد.</p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl border bg-card space-y-1">
                      <div className="text-xs font-bold text-muted-foreground flex items-center gap-1"><FileText className="size-3.5" /> مذكرات وخلاصة اليوم:</div>
                      <p className="text-xs text-foreground p-2 rounded bg-muted/40 min-h-[50px] leading-relaxed">
                        {historyRecord?.note || 'لم تقم بكتابة أي خلاصة أو مذكرات عامة في هذا اليوم.'}
                      </p>
                      <div className="mt-2 text-[11px] text-muted-foreground font-mono">
                        جلسات الـ Pomodoro المنجزة بالكامل: <span className="font-bold text-foreground">{historyRecord?.pomodoros || 0} جلسة تركيز دافورة</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}