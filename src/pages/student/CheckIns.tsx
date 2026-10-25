import { useState } from 'react'
import { useInternships } from '../../context/InternshipContext'
import { Button } from '../../components/ui/Button'

export default function CheckIns() {
  const {
    getAcceptedApplicationsForStudent,
    getStudentCheckIns,
    addCheckIn,
    internships,
  } = useInternships()

  const accepted = getAcceptedApplicationsForStudent()
  const myCheckIns = getStudentCheckIns()

  const [selectedAppId, setSelectedAppId] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const getInternshipTitle = (internshipId: string) => {
    return internships.find(i => i.id === internshipId)?.title || 'Стажировка'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!selectedAppId) {
      setError('Выбери стажировку')
      return
    }
    if (!note.trim()) {
      setError('Напиши, что сделал за неделю')
      return
    }
    addCheckIn(selectedAppId, note.trim())
    setNote('')
    setSelectedAppId('')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Чек-ины</h1>
      <p className="mt-1 text-slate-500">Еженедельные отчёты по принятым стажировкам</p>

      {accepted.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Нет принятых стажировок</p>
          <p className="text-sm text-slate-400 mt-1">Сначала откликнись и дождись принятия</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Новый чек-ин</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Стажировка</label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="">Выбери стажировку</option>
                {accepted.map((app) => (
                  <option key={app.id} value={app.id}>
                    {getInternshipTitle(app.internshipId)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Что сделал за неделю?</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Опиши задачи, чему научился, сложности..."
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
            )}

            <Button type="submit">Отправить чек-ин</Button>
          </form>

          <div className="mt-8">
            <h2 className="font-semibold text-slate-900 mb-4">История чек-инов</h2>
            {myCheckIns.length === 0 ? (
              <p className="text-slate-500 text-sm">Пока нет чек-инов</p>
            ) : (
              <div className="space-y-4">
                {myCheckIns.map((ci) => (
                  <div key={ci.id} className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900">
                        Неделя {ci.week} · {getInternshipTitle(ci.internshipId)}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {new Date(ci.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{ci.studentNote}</p>
                    {ci.mentorFeedback ? (
                      <div className="mt-3 p-3 bg-teal-50 rounded-lg">
                        <p className="text-xs font-medium text-teal-700 mb-1">Обратная связь наставника</p>
                        <p className="text-sm text-teal-900">{ci.mentorFeedback}</p>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-slate-400">Ожидает обратной связи</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}