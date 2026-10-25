import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [major, setMajor] = useState(user?.major || '')
  const [about, setAbout] = useState(user?.about || '')
  const [skillsText, setSkillsText] = useState((user?.skills || []).join(', '))
  const [course, setCourse] = useState(user?.course || 1)
  const [studentId, setStudentId] = useState(user?.studentId || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const skills = skillsText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      await updateProfile({
        fullName,
        major,
        about,
        skills,
        course,
        studentId,
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
      <p className="mt-1 text-slate-500">Короткое резюме — его видят компании при заявке</p>

      <form onSubmit={handleSave} className="mt-8 bg-white rounded-xl border border-slate-200 p-6 space-y-5 max-w-xl">
        <Input
          id="fullName"
          label="ФИО"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          id="studentId"
          label="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Курс</label>
          <select
            value={course}
            onChange={(e) => setCourse(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value={1}>1 курс</option>
            <option value={2}>2 курс</option>
            <option value={3}>3 курс</option>
            <option value={4}>4 курс</option>
          </select>
        </div>

        <Input
          id="major"
          label="Специальность"
          placeholder="Computer Science"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />

        <Input
          id="skills"
          label="Навыки (через запятую)"
          placeholder="React, TypeScript, Figma"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">О себе</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            placeholder="Кратко: интересы, опыт, чего ищешь..."
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
          />
        </div>

        {msg && (
          <p className={`text-sm ${msg === 'Сохранено' ? 'text-teal-600' : 'text-red-600'}`}>
            {msg}
          </p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </form>
    </div>
  )
}