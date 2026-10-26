import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipContext'

export default function MyApplications() {
  const { user } = useAuth()
  const { applications, internships } = useInternships()

  const myApps = applications.filter(a => a.studentId === user?.uid)

  const getTitle = (internshipId: string) => {
    return internships.find(i => i.id === internshipId)?.title || 'Стажировка'
  }

  const getCompany = (internshipId: string) => {
    return internships.find(i => i.id === internshipId)?.companyName || ''
  }

  const statusLabel: Record<string, string> = {
    pending: 'На рассмотрении',
    accepted: 'Принята',
    rejected: 'Отклонена',
    completed: 'Завершена',
  }

  const statusStyle: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    accepted: 'bg-teal-50 text-teal-700',
    rejected: 'bg-red-50 text-red-600',
    completed: 'bg-slate-100 text-slate-700',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Мои заявки</h1>
      <p className="mt-1 text-slate-500">Статус твоих откликов на стажировки</p>

      {myApps.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Ты ещё не подавал заявки</p>
          <p className="text-sm text-slate-400 mt-1">
            Зайди в раздел «Стажировки» и откликнись
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {myApps.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {getTitle(app.internshipId)}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {getCompany(app.internshipId)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(app.createdAt).toLocaleString('ru-RU')}
                  </p>
                  {app.status === 'completed' && (
                    <Link
                      to={`/certificate/${app.id}`}
                      className="inline-block mt-2 text-sm text-teal-600 hover:text-teal-700"
                    >
                      Открыть сертификат →
                    </Link>
                  )}
                </div>
                <span className={`text-sm font-medium px-3 py-1.5 rounded-lg shrink-0 ${statusStyle[app.status]}`}>
                  {statusLabel[app.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}