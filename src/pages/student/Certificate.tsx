import { useParams, Link } from 'react-router-dom'
import { useInternships } from '../../context/InternshipContext'
import { useAuth } from '../../context/AuthContext'

export default function Certificate() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const { user } = useAuth()
  const { applications, internships } = useInternships()

  const app = applications.find(a => a.id === applicationId)
  const internship = app ? internships.find(i => i.id === app.internshipId) : null

  if (!app || app.status !== 'completed' || app.studentId !== user?.uid) {
    return (
      <div>
        <p className="text-slate-500">Сертификат не найден</p>
        <Link to="/" className="text-sm text-teal-600 mt-2 inline-block">← На дашборд</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="text-sm text-teal-600 hover:text-teal-700">← Назад</Link>

      <div className="mt-8 max-w-lg mx-auto bg-white border-2 border-teal-100 rounded-2xl p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-widest text-teal-600 font-medium">Stajly · SDU</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Сертификат о прохождении</h1>
        <p className="mt-6 text-slate-600">Настоящим подтверждается, что</p>
        <p className="mt-2 text-xl font-semibold text-slate-900">{user?.fullName}</p>
        <p className="mt-4 text-slate-600">успешно завершил(а) стажировку</p>
        <p className="mt-2 text-lg font-medium text-teal-700">
          {internship?.title || 'Стажировка'}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {internship?.companyName}
          {internship?.duration ? ` · ${internship.duration}` : ''}
        </p>
        {app.completedAt && (
          <p className="mt-6 text-xs text-slate-400">
            Дата завершения: {new Date(app.completedAt).toLocaleDateString('ru-RU')}
          </p>
        )}
        <p className="mt-8 text-xs text-slate-400">SDU Internship Platform</p>
      </div>
    </div>
  )
}