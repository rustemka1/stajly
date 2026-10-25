import { useState } from 'react'
import { useInternships } from '../../context/InternshipContext'
import { Button } from '../../components/ui/Button'

export default function CompanyCheckIns() {
  const { getCompanyCheckIns, addMentorFeedback, internships } = useInternships()
  const checkIns = getCompanyCheckIns()

  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({})

  const getInternshipTitle = (internshipId: string) => {
    return internships.find(i => i.id === internshipId)?.title || 'Стажировка'
  }

  const handleSubmitFeedback = (checkInId: string) => {
    const text = feedbacks[checkInId]?.trim()
    if (!text) return
    addMentorFeedback(checkInId, text)
    setFeedbacks(prev => ({ ...prev, [checkInId]: '' }))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Чек-ины стажёров</h1>
      <p className="mt-1 text-slate-500">Еженедельные отчёты и обратная связь</p>

      {checkIns.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Пока нет чек-инов от стажёров</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {checkIns.map((ci) => (
            <div key={ci.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {ci.studentName} · Неделя {ci.week}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {getInternshipTitle(ci.internshipId)}
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(ci.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">{ci.studentNote}</p>

              {ci.mentorFeedback ? (
                <div className="mt-3 p-3 bg-teal-50 rounded-lg">
                  <p className="text-xs font-medium text-teal-700 mb-1">Твоя обратная связь</p>
                  <p className="text-sm text-teal-900">{ci.mentorFeedback}</p>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <textarea
                    value={feedbacks[ci.id] || ''}
                    onChange={(e) => setFeedbacks(prev => ({ ...prev, [ci.id]: e.target.value }))}
                    rows={2}
                    placeholder="Напиши обратную связь стажёру..."
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
                  />
                  <Button size="sm" onClick={() => handleSubmitFeedback(ci.id)}>
                    Отправить feedback
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}