import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { UserProfile } from '../types'

export default function StudentProfileView() {
  const { uid } = useParams<{ uid: string }>()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    getDoc(doc(db, 'users', uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data() as UserProfile)
      setLoading(false)
    })
  }, [uid])

  if (loading) {
    return <p className="text-slate-500">Загрузка...</p>
  }

  if (!profile) {
    return <p className="text-slate-500">Профиль не найден</p>
  }

  return (
    <div>
      <Link to="/applications" className="text-sm text-teal-600 hover:text-teal-700">
        ← Назад к заявкам
      </Link>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6 max-w-xl">
        <h1 className="text-2xl font-bold text-slate-900">{profile.fullName}</h1>
        <p className="text-slate-500 mt-1">
          {profile.major || 'Специальность не указана'}
          {profile.course ? ` · ${profile.course} курс` : ''}
          {profile.studentId ? ` · ID: ${profile.studentId}` : ''}
        </p>
        <p className="text-sm text-slate-400 mt-1">{profile.university || 'SDU'}</p>

        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-5">
            <h2 className="text-sm font-medium text-slate-700 mb-2">Навыки</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-teal-50 text-teal-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.about && (
          <div className="mt-5">
            <h2 className="text-sm font-medium text-slate-700 mb-2">О себе</h2>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{profile.about}</p>
          </div>
        )}

        {!profile.about && (!profile.skills || profile.skills.length === 0) && (
          <p className="mt-5 text-sm text-slate-400">Студент ещё не заполнил резюме</p>
        )}
      </div>
    </div>
  )
}