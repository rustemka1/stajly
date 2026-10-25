import { useInternships } from '../../context/InternshipContext'

export default function AllInternships() {
  const { internships, applications } = useInternships()

  const getAppsCount = (internshipId: string) => {
    return applications.filter(a => a.internshipId === internshipId).length
  }

  const getAcceptedCount = (internshipId: string) => {
    return applications.filter(a => a.internshipId === internshipId && a.status === 'accepted').length
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Все стажировки</h1>
      <p className="mt-1 text-slate-500">Обзор стажировок на платформе SDU</p>

      {internships.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Пока нет стажировок</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {internships.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.companyName} · {item.location} · {item.duration}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{item.description}</p>
                  {item.requiredSkills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.requiredSkills.map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    item.isActive ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.isActive ? 'Активна' : 'Закрыта'}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">
                    Заявок: {getAppsCount(item.id)}
                  </p>
                  <p className="text-xs text-slate-400">
                    Принято: {getAcceptedCount(item.id)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}