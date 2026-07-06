'use client'

import React, { useState } from 'react'
import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Plus, Trash2, BookOpen, Star, PlusCircle, MinusCircle } from 'lucide-react'

export function SubjectManager() {
  const { state, dispatch } = useStore()
  const [newSubjectName, setNewSubjectName] = useState('')

  const subjects = state?.subjects || []

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubjectName.trim()) return
    
    const newSubject = {
      id: 'sub-' + Math.random().toString(36).slice(2, 9),
      name: newSubjectName.trim(),
      hoursSpent: 0,
      rating: 5 // التقييم الافتراضي من 10
    }

    dispatch({
      type: 'SET_STATE',
      payload: { ...state, subjects: [...subjects, newSubject] }
    })
    setNewSubjectName('')
  }

  const updateRating = (id: string, currentRating: number, change: number) => {
    const newRating = Math.max(1, Math.min(10, currentRating + change))
    const updated = subjects.map(s => s.id === id ? { ...s, rating: newRating } : s)
    dispatch({
      type: 'SET_STATE',
      payload: { ...state, subjects: updated }
    })
  }

  const handleDeleteSubject = (id: string) => {
    const updated = subjects.filter(s => s.id !== id)
    dispatch({
      type: 'SET_STATE',
      payload: { ...state, subjects: updated }
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 font-bold">
            <BookOpen className="size-5 text-emerald-600" />
            إضافة مادة دراسية وتقييم استيعابك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubject} className="flex gap-3">
            <input
              type="text"
              placeholder="مثال: الفيزياء، الكيمياء، النحو، الأحياء..."
              value={newSubjectName}
              onChange={e => setNewSubjectName(e.target.value)}
              className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Plus className="size-4" /> إضافة المادة
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.length === 0 ? (
          <div className="col-span-full p-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
            لا توجد مواد مضافة حالياً. أضف موادك الدراسية لتقييم مستواك فيها.
          </div>
        ) : (
          subjects.map(subject => {
            const currentRating = subject.rating || 5
            return (
              <Card key={subject.id} className="overflow-hidden border-emerald-500/10 shadow-sm">
                <CardHeader className="bg-muted/40 pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-bold text-foreground">{subject.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteSubject(subject.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">درجة فهم واستيعاب المادة:</span>
                      <span className="text-emerald-600 font-mono">{currentRating * 10}%</span>
                    </div>
                    <ProgressBar value={currentRating * 10} />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      التقييم: {currentRating} / 10
                    </span>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="size-7" 
                        onClick={() => updateRating(subject.id, currentRating, -1)}
                      >
                        <MinusCircle className="size-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="size-7" 
                        onClick={() => updateRating(subject.id, currentRating, 1)}
                      >
                        <PlusCircle className="size-4 text-emerald-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}