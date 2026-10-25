import { useInternships } from '../../context/InternshipContext'
import { Button } from '../../components/ui/Button'

export default function Applications() {
  const { getApplicationsForCompany, internships, updateApplicationStatus } = useInternships()
  const applications = getApplicationsForCompany()

  const getInternshipTitle = (internshipId: string) => {
    return internships.find(i => i.id === internshipId)?.title || 'Стажировка'
  }

  if (applications.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Заявки</h1>
        <p className="mt-1 text-slate-500">Заявки студентов на твои стажировки</p>
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Пока нет заявок</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Заявки</h1>
      <p className="mt-1 text-slate-500">Заявки студентов на твои стажировки</p>

      <div className="mt-8 space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">{app.studentName}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  На стажировку: <span className="font-medium text-slate-700">{getInternshipTitle(app.internshipId)}</span>
                </p>
                {app.message && (
                  <p className="mt-2 text-sm text-slate-600">{app.message}</p>
                )}
                <p className="mt-2 text-xs text-slate-400">
                  {new Date(app.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {app.status === 'pending' ? (
                  <>
                    <Button size="sm" onClick={() => updateApplicationStatus(app.id, 'accepted')}>
                      Принять
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(app.id, 'rejected')}>
                      Отклонить
                    </Button>
                  </>
                ) : (
                  <span className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
                    app.status === 'accepted' 
                      ? 'bg-teal-50 text-teal-700' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {app.status === 'accepted' ? 'Принята' : 'Отклонена'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}