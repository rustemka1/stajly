import { useAuth } from '../context/AuthContext'
import { useInternships } from '../context/InternshipContext'

export default function Dashboard() {
  const { user } = useAuth()
  const {
    internships,
    applications,
    checkIns,
    getMyInternships,
    getApplicationsForCompany,
    getAcceptedApplicationsForStudent,
    getStudentCheckIns,
    getCompanyCheckIns,
  } = useInternships()

  if (user?.role === 'student') {
    const myApps = applications.filter(a => a.studentId === user.uid)
    const pending = myApps.filter(a => a.status === 'pending').length
    const accepted = getAcceptedApplicationsForStudent().length
    const myCheckIns = getStudentCheckIns().length

    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Дашборд студента</h1>
        <p className="mt-1 text-slate-500">
          {user.fullName}
          {user.course ? ` · ${user.course} курс` : ''}
          {user.studentId ? ` · ID: ${user.studentId}` : ''}
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Активные заявки</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Принятые стажировки</p>
            <p className="text-3xl font-bold text-teal-600 mt-1">{accepted}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Чек-ины</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{myCheckIns}</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900">Что дальше?</h2>
          <p className="text-slate-500 mt-1 text-sm">
            {accepted > 0
              ? 'У тебя есть принятая стажировка — не забудь отправлять чек-ины.'
              : 'Перейди в «Стажировки», чтобы найти практику и подать заявку.'}
          </p>
        </div>
      </div>
    )
  }

  if (user?.role === 'company') {
    const myInternships = getMyInternships()
    const myApps = getApplicationsForCompany()
    const pendingApps = myApps.filter(a => a.status === 'pending').length
    const acceptedApps = myApps.filter(a => a.status === 'accepted').length
    const companyCheckIns = getCompanyCheckIns().length

    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Дашборд компании</h1>
        <p className="mt-1 text-slate-500">{user.companyName || user.fullName}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Активные стажировки</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{myInternships.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Новые заявки</p>
            <p className="text-3xl font-bold text-teal-600 mt-1">{pendingApps}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Текущие стажёры</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{acceptedApps}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Чек-ины от стажёров</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{companyCheckIns}</p>
          </div>
        </div>
      </div>
    )
  }

  // Admin
  const activeInternships = internships.filter(i => i.isActive).length
  const pendingAll = applications.filter(a => a.status === 'pending').length
  const acceptedAll = applications.filter(a => a.status === 'accepted').length

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">University Dashboard</h1>
      <p className="mt-1 text-slate-500">Обзор стажировок SDU</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Активные стажировки</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{activeInternships}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Заявки (ожидают)</p>
          <p className="text-3xl font-bold text-teal-600 mt-1">{pendingAll}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Принятые стажировки</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{acceptedAll}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Всего заявок</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{applications.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Чек-ины</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{checkIns.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Всего стажировок</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{internships.length}</p>
        </div>
      </div>
    </div>
  )
}