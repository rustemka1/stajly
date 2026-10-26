import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipContext'
import { Button } from '../../components/ui/Button'

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function getMatch(studentSkills: string[], required: string[]) {
  if (!required || required.length === 0) {
    return { percent: 0, matched: [] as string[], label: 'Без требований' }
  }
  const studentSet = new Set(studentSkills.map(normalize))
  const matched = required.filter(r => studentSet.has(normalize(r)))
  const percent = Math.round((matched.length / required.length) * 100)
  return { percent, matched, label: `${percent}% match` }
}

export default function Internships() {
  const { user } = useAuth()
  const { internships, applications, applyToInternship } = useInternships()
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const studentSkills = user?.skills || []
  const active = internships.filter(i => i.isActive)

  const sorted = [...active].sort((a, b) => {
    const ma = getMatch(studentSkills, a.requiredSkills || []).percent
    const mb = getMatch(studentSkills, b.requiredSkills || []).percent
    return mb - ma
  })

  const hasApplied = (internshipId: string) =>
    applications.some(a => a.internshipId === internshipId && a.studentId === user?.uid)

  const handleApply = async (id: string) => {
    setApplyingId(id)
    try {
      await applyToInternship(id, message)
      setMessage('')
    } finally {
      setApplyingId(null)
    }
  }

  const matchColor = (percent: number) => {
    if (percent >= 70) return 'bg-teal-50 text-teal-700'
    if (percent >= 40) return 'bg-amber-50 text-amber-700'
    if (percent > 0) return 'bg-slate-100 text-slate-600'
    return 'bg-slate-50 text-slate-400'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Стажировки</h1>
      <p className="mt-1 text-slate-500">
        Отсортировано по совпадению с твоими навыками
        {studentSkills.length === 0 && (
          <span className="text-amber-600"> · заполни skills в профиле для matching</span>
        )}
      </p>

      {studentSkills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-slate-500 self-center">Твои skills:</span>
          {studentSkills.map((s) => (
            <span key={s} className="text-xs px-2 py-1 rounded-md bg-teal-50 text-teal-700">
              {s}
            </span>
          ))}
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Пока нет активных стажировок</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {sorted.map((item) => {
            const match = getMatch(studentSkills, item.requiredSkills || [])
            const applied = hasApplied(item.id)

            return (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-lg">{item.title}</h3>
                      {studentSkills.length > 0 && (item.requiredSkills?.length ?? 0) > 0 && (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${matchColor(match.percent)}`}>
                          {match.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {item.companyName} · {item.location} · {item.duration}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>

                    {item.requiredSkills && item.requiredSkills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.requiredSkills.map((skill) => {
                          const isMatched = match.matched.some(
                            m => normalize(m) === normalize(skill)
                          )
                          return (
                            <span
                              key={skill}
                              className={`text-xs px-2 py-1 rounded-md ${
                                isMatched
                                  ? 'bg-teal-50 text-teal-700 font-medium'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {skill}{isMatched ? ' ✓' : ''}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {applied ? (
                      <span className="text-sm font-medium text-teal-600 px-3 py-2">
                        Заявка отправлена
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        disabled={applyingId === item.id}
                        onClick={() => handleApply(item.id)}
                      >
                        {applyingId === item.id ? '...' : 'Откликнуться'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}