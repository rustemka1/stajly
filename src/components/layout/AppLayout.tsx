import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  LogOut,
  PlusCircle,
  ClipboardList
} from 'lucide-react'
import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const studentNav: NavItem[] = [
    { label: 'Дашборд', href: '/', icon: <LayoutDashboard size={18} /> },
    { label: 'Стажировки', href: '/internships', icon: <Briefcase size={18} /> },
    { label: 'Мои заявки', href: '/my-applications', icon: <FileText size={18} /> },
    { label: 'Чек-ины', href: '/checkins', icon: <ClipboardList size={18} /> },
    { label: 'Мой профиль', href: '/profile', icon: <Users size={18} /> },
  ]

  const companyNav: NavItem[] = [
    { label: 'Дашборд', href: '/', icon: <LayoutDashboard size={18} /> },
    { label: 'Мои стажировки', href: '/my-internships', icon: <Briefcase size={18} /> },
    { label: 'Создать стажировку', href: '/create-internship', icon: <PlusCircle size={18} /> },
    { label: 'Заявки', href: '/applications', icon: <Users size={18} /> },
    { label: 'Чек-ины', href: '/company-checkins', icon: <ClipboardList size={18} /> },
  ]

  const adminNav: NavItem[] = [
    { label: 'Дашборд', href: '/', icon: <LayoutDashboard size={18} /> },
    { label: 'Все стажировки', href: '/all-internships', icon: <Briefcase size={18} /> },
    { label: 'Студенты', href: '/students', icon: <Users size={18} /> },
  ]

  const navItems = 
    user?.role === 'student' ? studentNav :
    user?.role === 'company' ? companyNav :
    adminNav

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Stajly</h1>
          <p className="text-xs text-slate-500 mt-1">SDU Internship Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="px-3 mb-3">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            {user?.studentId && (
              <p className="text-xs text-slate-400 mt-0.5">ID: {user.studentId}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}