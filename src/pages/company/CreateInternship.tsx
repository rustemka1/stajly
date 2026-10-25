import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInternships } from '../../context/InternshipContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function CreateInternship() {
  const { addInternship } = useInternships()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('Алматы')
  const [duration, setDuration] = useState('4 недели')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim()) {
      setError('Заполни название и описание')
      return
    }

    addInternship({
      title: title.trim(),
      description: description.trim(),
      requiredSkills: skills.split(',').map(s => s.trim()).filter(Boolean),
      location,
      duration,
    })

    navigate('/my-internships')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Создать стажировку</h1>
      <p className="mt-1 text-slate-500">Заполни информацию о вакансии</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5">
        <Input
          id="title"
          label="Название стажировки"
          placeholder="Frontend Developer Intern"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Чем будет заниматься стажёр, какие задачи..."
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
            required
          />
        </div>

        <Input
          id="skills"
          label="Требуемые навыки (через запятую)"
          placeholder="React, TypeScript, Tailwind"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="location"
            label="Локация"
            placeholder="Алматы / Online"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            id="duration"
            label="Длительность"
            placeholder="4 недели"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" size="lg">Опубликовать</Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}