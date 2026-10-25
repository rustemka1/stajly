import { useInternships } from '../../context/InternshipContext'
import { useAuth } from '../../context/AuthContext'

export default function MyApplications() {
  const { applications, internships } = useInternships()
  const { user } = useAuth()

  const myApplications = applications.filter(a => a.studentId === user?.uid)

  const getInternship = (internshipId: string) => {
    return internships.find(i => i.id === internshipId)
  }

  const statusLabel = {
    pending: 'На рассмотрении',
    accepted: 'Принята',
    rejected: 'Отклонена',
  }

  const statusStyle = {
    pending: 'bg-amber-50 text-amber-700',
    accepted: 'bg-teal-50 text-teal-700',
    rejected: 'bg-red-50 text-red-600',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Мои заявки</h1>
      <p className="mt-1 text-slate-500">Статус твоих откликов на стажировки</p>

      {myApplications.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Ты ещё не подавал заявки</p>
          <p className="text-sm text-slate-400 mt-1">Зайди в раздел «Стажировки» и откликнись</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {myApplications.map((app) => {
            const internship = getInternship(app.internshipId)
            return (
              <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {internship?.title || 'Стажировка'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {internship?.companyName} · {internship?.location}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Подана: {new Date(app.createdAt).toLocaleString('ru-RU')}
                    </p>
                  </div>

                  <span className={`text-sm font-medium px-3 py-1.5 rounded-lg shrink-0 ${statusStyle[app.status]}`}>
                    {statusLabel[app.status]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}