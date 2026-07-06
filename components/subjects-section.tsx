'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { uid } from '@/lib/study'
import { SubjectManager } from '@/components/subject-manager'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function SubjectsSection({
  category,
  title,
  description,
}: {
  category: 'azhar' | 'programming'
  title: string
  description: string
}) {
  const { setState } = useStore()
  const [name, setName] = useState('')

  function addSubject() {
    const n = name.trim()
    if (!n) return
    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { id: uid(), name: n, category, lessons: [] }],
    }))
    setName('')
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) addSubject()
          }}
          placeholder={
            category === 'programming' ? 'أضف مسار برمجة...' : 'أضف مادة...'
          }
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
        <Button onClick={addSubject} size="lg">
          <Plus className="size-4" />
          إضافة
        </Button>
      </div>

      <SubjectManager category={category} />
    </div>
  )
}
