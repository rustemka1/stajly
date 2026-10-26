import { Link } from 'react-router-dom'
import { useInternships } from '../../context/InternshipContext'
import { Button } from '../../components/ui/Button'

export default function Applications() {
  const {
    getApplicationsForCompany,
    updateApplicationStatus,
    completeApplication,
    internships,
  } = useInternships()
  const apps = getApplicationsForCompany()

  const getTitle = (internshipId: string) => {
    return internships.find(i => i.id === internshipId)?.title || 'Стажировка'
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
      <h1 className="text-2xl font-bold text-slate-900">Заявки</h1>
      <p className="mt-1 text-slate-500">Заявки студентов на твои стажировки</p>

      {apps.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Пока нет заявок</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {apps.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    to={`/student/${app.studentId}`}
                    className="font-semibold text-slate-900 text-lg hover:text-teal-700"
                  >
                    {app.studentName}
                  </Link>
                  <p className="text-sm text-slate-500 mt-1">
                    На стажировку: {getTitle(app.internshipId)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(app.createdAt).toLocaleString('ru-RU')}
                  </p>
                  <Link
                    to={`/student/${app.studentId}`}
                    className="inline-block mt-2 text-sm text-teal-600 hover:text-teal-700"
                  >
                    Смотреть профиль →
                  </Link>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-sm font-medium px-3 py-1.5 rounded-lg ${statusStyle[app.status]}`}>
                    {statusLabel[app.status]}
                  </span>

                  {app.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateApplicationStatus(app.id, 'accepted')}>
                        Принять
                      </Button>
                      <button
                        type="button"
                        onClick={() => updateApplicationStatus(app.id, 'rejected')}
                        className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        Отклонить
                      </button>
                    </div>
                  )}

                  {app.status === 'accepted' && (
                    <Button size="sm" onClick={() => completeApplication(app.id)}>
                      Отметить завершённой
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