import { useState } from 'react'
import { useInternships } from '../../context/InternshipContext'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'

export default function Internships() {
  const { internships, applications, applyToInternship } = useInternships()
  const { user } = useAuth()
  const [appliedId, setAppliedId] = useState<string | null>(null)

  const handleApply = (internshipId: string) => {
    applyToInternship(internshipId)
    setAppliedId(internshipId)
  }

  const hasApplied = (internshipId: string) => {
    return applications.some(
      a => a.internshipId === internshipId && a.studentId === user?.uid
    ) || appliedId === internshipId
  }

  const activeInternships = internships.filter(i => i.isActive)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Стажировки</h1>
      <p className="mt-1 text-slate-500">Доступные стажировки от компаний</p>

      {activeInternships.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Пока нет открытых стажировок</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {activeInternships.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.companyName} · {item.location} · {item.duration}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                  {item.requiredSkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.requiredSkills.map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  {hasApplied(item.id) ? (
                    <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg">
                      Заявка отправлена
                    </span>
                  ) : (
                    <Button onClick={() => handleApply(item.id)}>
                      Откликнуться
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}