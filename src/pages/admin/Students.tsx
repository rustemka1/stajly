import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useInternships } from '../../context/InternshipContext'
import type { UserProfile } from '../../types'

interface StudentRow {
  uid: string
  name: string
  totalApps: number
  accepted: number
  pending: number
  rejected: number
  profile: UserProfile | null
}

export default function Students() {
  const { applications } = useInternships()
  const [rows, setRows] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const map = new Map<string, { name: string; total: number; accepted: number; pending: number; rejected: number }>()

    applications.forEach((app) => {
      const prev = map.get(app.studentId) || {
        name: app.studentName,
        total: 0,
        accepted: 0,
        pending: 0,
        rejected: 0,
      }
      prev.total += 1
      if (app.status === 'accepted') prev.accepted += 1
      if (app.status === 'pending') prev.pending += 1
      if (app.status === 'rejected') prev.rejected += 1
      prev.name = app.studentName
      map.set(app.studentId, prev)
    })

    const load = async () => {
      const result: StudentRow[] = []
      for (const [uid, stats] of map.entries()) {
        let profile: UserProfile | null = null
        try {
          const snap = await getDoc(doc(db, 'users', uid))
          if (snap.exists()) profile = snap.data() as UserProfile
        } catch {
          // ignore
        }
        result.push({
          uid,
          name: profile?.fullName || stats.name,
          totalApps: stats.total,
          accepted: stats.accepted,
          pending: stats.pending,
          rejected: stats.rejected,
          profile,
        })
      }
      result.sort((a, b) => b.totalApps - a.totalApps)
      setRows(result)
      setLoading(false)
    }

    load()
  }, [applications])

  if (loading) {
    return <p className="text-slate-500">Загрузка...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Студенты</h1>
      <p className="mt-1 text-slate-500">
        Студенты, которые подавали заявки на стажировки
      </p>

      {rows.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Пока нет студентов с заявками</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {rows.map((row) => {
            const initials = (row.name || 'S')
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()

            return (
              <div
                key={row.uid}
                className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
              >
                {row.profile?.photoURL ? (
                  <img
                    src={row.profile.photoURL}
                    alt={row.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-sm font-bold shrink-0">
                    {initials}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/student/${row.uid}`}
                    className="font-semibold text-slate-900 hover:text-teal-700"
                  >
                    {row.name}
                  </Link>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {row.profile?.headline || row.profile?.major || 'Профиль'}
                    {row.profile?.course ? ` · ${row.profile.course} курс` : ''}
                    {row.profile?.studentId ? ` · ID: ${row.profile.studentId}` : ''}
                  </p>
                  {row.profile?.skills && row.profile.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {row.profile.skills.slice(0, 4).map((s: string) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <p className="text-sm text-slate-600">
                    Заявок: <span className="font-semibold">{row.totalApps}</span>
                  </p>
                  <p className="text-xs text-teal-600">Принято: {row.accepted}</p>
                  <p className="text-xs text-amber-600">Ожидают: {row.pending}</p>
                  <Link
                    to={`/student/${row.uid}`}
                    className="inline-block mt-1 text-sm text-teal-600 hover:text-teal-700"
                  >
                    Профиль →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}