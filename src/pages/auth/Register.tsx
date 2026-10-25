import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import type { UserRole } from '../../types'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<UserRole>('student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [course, setCourse] = useState<number>(1)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Пароль должен быть не меньше 6 символов')
      return
    }

    try {
      await register({
        email,
        password,
        role,
        fullName,
        companyName: role === 'company' ? companyName : undefined,
        studentId: role === 'student' ? studentId : undefined,
        course: role === 'student' ? course : undefined,
        university: 'SDU',
      })
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации. Попробуйте ещё раз.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Stajly</h1>
          <p className="text-slate-500 mt-2">Создай аккаунт</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Регистрация</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Я регистрируюсь как</label>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'company', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      role === r
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r === 'student' ? 'Студент' : r === 'company' ? 'Компания' : 'Админ'}
                  </button>
                ))}
              </div>
            </div>

            <Input
              id="fullName"
              label={role === 'company' ? 'Контактное лицо' : 'ФИО'}
              placeholder="Иван Иванов"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            {role === 'student' && (
              <>
                <Input
                  id="studentId"
                  label="Student ID"
                  placeholder="230103001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
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
              </>
            )}

            {role === 'company' && (
              <Input
                id="companyName"
                label="Название компании"
                placeholder="ТОО Example"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            )}

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label="Пароль"
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Создание...' : 'Создать аккаунт'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}