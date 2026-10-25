import { Link } from 'react-router-dom'
import { useInternships } from '../../context/InternshipContext'
import { Button } from '../../components/ui/Button'
import { PlusCircle } from 'lucide-react'

export default function MyInternships() {
  const { getMyInternships } = useInternships()
  const myInternships = getMyInternships()

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Мои стажировки</h1>
          <p className="mt-1 text-slate-500">Стажировки, которые ты опубликовал</p>
        </div>
        <Link to="/create-internship">
          <Button>
            <PlusCircle size={18} className="mr-2" />
            Создать
          </Button>
        </Link>
      </div>

      {myInternships.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Пока нет стажировок</p>
          <Link to="/create-internship" className="inline-block mt-4">
            <Button>Создать первую стажировку</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {myInternships.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.location} · {item.duration}
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
                  Активна
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600 line-clamp-2">{item.description}</p>
              {item.requiredSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.requiredSkills.map((skill) => (
                    <span key={skill} className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}