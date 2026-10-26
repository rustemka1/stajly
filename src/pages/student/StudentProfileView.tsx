import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { UserProfile } from '../../types'

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

  if (loading) return <p className="text-slate-500">Загрузка...</p>
  if (!profile) return <p className="text-slate-500">Профиль не найден</p>

  const initials = (profile.fullName || 'S')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div>
      <Link to="/applications" className="text-sm text-teal-600 hover:text-teal-700">
        ← Назад к заявкам
      </Link>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6 max-w-xl">
        <div className="flex items-start gap-4">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-teal-100 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-lg font-bold shrink-0">
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">{profile.fullName}</h1>
            {profile.headline && (
              <p className="text-teal-600 text-sm mt-0.5">{profile.headline}</p>
            )}
            <p className="text-sm text-slate-500 mt-1">
              {profile.major || 'Специальность не указана'}
              {profile.course ? ` · ${profile.course} курс` : ''}
              {profile.studentId ? ` · ID: ${profile.studentId}` : ''}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{profile.university || 'SDU'}</p>
          </div>
        </div>

        {(profile.phone || profile.telegram || profile.email) && (
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Контакты</p>
            {profile.email && <p className="text-sm text-slate-600">{profile.email}</p>}
            {profile.phone && <p className="text-sm text-slate-600">{profile.phone}</p>}
            {profile.telegram && <p className="text-sm text-slate-600">{profile.telegram}</p>}
          </div>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-5">
            <h2 className="text-sm font-medium text-slate-700 mb-2">Навыки</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string) => (
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

        {profile.experience && (
          <div className="mt-5">
            <h2 className="text-sm font-medium text-slate-700 mb-2">Опыт / проекты</h2>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{profile.experience}</p>
          </div>
        )}

        {!profile.about && !profile.experience && (!profile.skills || profile.skills.length === 0) && (
          <p className="mt-5 text-sm text-slate-400">Студент ещё не заполнил резюме</p>
        )}
      </div>
    </div>
  )
}