import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function Profile() {
  const { user, updateProfile } = useAuth()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [headline, setHeadline] = useState(user?.headline || '')
  const [major, setMajor] = useState(user?.major || '')
  const [about, setAbout] = useState(user?.about || '')
  const [experience, setExperience] = useState(user?.experience || '')
  const [skillsText, setSkillsText] = useState((user?.skills || []).join(', '))
  const [course, setCourse] = useState(user?.course || 1)
  const [studentId, setStudentId] = useState(user?.studentId || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [telegram, setTelegram] = useState(user?.telegram || '')
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean)

  const filled = [
    fullName,
    headline,
    major,
    about,
    skills.length > 0,
    phone || telegram,
    experience,
    studentId,
  ].filter(Boolean).length
  const progress = Math.round((filled / 8) * 100)

  const initials = (fullName || 'S')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      await updateProfile({
        fullName,
        headline,
        major,
        about,
        experience,
        skills,
        course,
        studentId,
        phone,
        telegram,
        photoURL: photoURL || undefined,
      })
      setMsg('Сохранено')
    } catch {
      setMsg('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Мой профиль</h1>
      <p className="mt-1 text-slate-500">Резюме, которое видят компании при заявке</p>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 max-w-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Заполненность профиля</span>
          <span className="text-sm font-semibold text-teal-600">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-2xl lg:max-w-4xl">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-8">
            <div className="flex flex-col items-center text-center">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-teal-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xl font-bold">
                  {initials}
                </div>
              )}
              <h2 className="mt-3 font-semibold text-slate-900">{fullName || 'Имя'}</h2>
              <p className="text-sm text-teal-600 mt-0.5">{headline || 'Headline'}</p>
              <p className="text-xs text-slate-400 mt-1">
                {major || 'Специальность'}
                {course ? ` · ${course} курс` : ''}
              </p>
              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                  {skills.slice(0, 5).map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <Input id="fullName" label="ФИО" value={fullName} onChange={e => setFullName(e.target.value)} required />
          <Input id="headline" label="Headline" placeholder="Frontend Intern · React, TypeScript" value={headline} onChange={e => setHeadline(e.target.value)} />
          <Input id="photoURL" label="Ссылка на фото (необязательно)" placeholder="https://..." value={photoURL} onChange={e => setPhotoURL(e.target.value)} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="studentId" label="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Курс</label>
              <select
                value={course}
                onChange={e => setCourse(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                <option value={1}>1 курс</option>
                <option value={2}>2 курс</option>
                <option value={3}>3 курс</option>
                <option value={4}>4 курс</option>
              </select>
            </div>
          </div>

          <Input id="major" label="Специальность" placeholder="Computer Science" value={major} onChange={e => setMajor(e.target.value)} />
          <Input id="skills" label="Навыки (через запятую)" placeholder="React, TypeScript, Figma" value={skillsText} onChange={e => setSkillsText(e.target.value)} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="phone" label="Телефон" placeholder="+7 700 000 00 00" value={phone} onChange={e => setPhone(e.target.value)} />
            <Input id="telegram" label="Telegram" placeholder="@username" value={telegram} onChange={e => setTelegram(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">О себе</label>
            <textarea
              value={about}
              onChange={e => setAbout(e.target.value)}
              rows={3}
              placeholder="Кратко о себе, интересах, целях..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Опыт / проекты</label>
            <textarea
              value={experience}
              onChange={e => setExperience(e.target.value)}
              rows={3}
              placeholder="Например: pet-проект Todo App на React; стажировка в..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
            />
          </div>

          {msg && (
            <p className={`text-sm ${msg === 'Сохранено' ? 'text-teal-600' : 'text-red-600'}`}>{msg}</p>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить профиль'}
          </Button>
        </form>
      </div>
    </div>
  )
}