import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Internship, Application, CheckIn } from '../types'
import { useAuth } from './AuthContext'

interface InternshipContextType {
  internships: Internship[]
  applications: Application[]
  checkIns: CheckIn[]
  addInternship: (data: Omit<Internship, 'id' | 'createdAt' | 'companyId' | 'companyName' | 'isActive'>) => Promise<void>
  getMyInternships: () => Internship[]
  applyToInternship: (internshipId: string, message?: string) => Promise<void>
  getApplicationsForCompany: () => Application[]
  updateApplicationStatus: (applicationId: string, status: 'accepted' | 'rejected') => Promise<void>
  addCheckIn: (applicationId: string, studentNote: string) => Promise<void>
  addMentorFeedback: (checkInId: string, feedback: string) => Promise<void>
  getStudentCheckIns: () => CheckIn[]
  getCompanyCheckIns: () => CheckIn[]
  getAcceptedApplicationsForStudent: () => Application[]
}

const InternshipContext = createContext<InternshipContextType | null>(null)

export function InternshipProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [internships, setInternships] = useState<Internship[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])

  useEffect(() => {
    const unsubInt = onSnapshot(collection(db, 'internships'), (snap) => {
      setInternships(snap.docs.map(d => ({ id: d.id, ...d.data() } as Internship)))
    })
    const unsubApp = onSnapshot(collection(db, 'applications'), (snap) => {
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Application)))
    })
    const unsubCi = onSnapshot(collection(db, 'checkins'), (snap) => {
      setCheckIns(snap.docs.map(d => ({ id: d.id, ...d.data() } as CheckIn)))
    })
    return () => {
      unsubInt()
      unsubApp()
      unsubCi()
    }
  }, [])

  const addInternship = async (
    data: Omit<Internship, 'id' | 'createdAt' | 'companyId' | 'companyName' | 'isActive'>
  ) => {
    if (!user) return
    await addDoc(collection(db, 'internships'), {
      companyId: user.uid,
      companyName: user.companyName || user.fullName,
      isActive: true,
      createdAt: Date.now(),
      ...data,
    })
  }

  const getMyInternships = () => {
    if (!user) return []
    return internships.filter(i => i.companyId === user.uid)
  }

  const applyToInternship = async (internshipId: string, message?: string) => {
    if (!user || user.role !== 'student') return
    const already = applications.some(
      a => a.internshipId === internshipId && a.studentId === user.uid
    )
    if (already) return

    await addDoc(collection(db, 'applications'), {
      internshipId,
      studentId: user.uid,
      studentName: user.fullName,
      status: 'pending',
      createdAt: Date.now(),
      message: message || '',
    })
  }

  const getApplicationsForCompany = () => {
    if (!user) return []
    const myIds = internships.filter(i => i.companyId === user.uid).map(i => i.id)
    return applications.filter(a => myIds.includes(a.internshipId))
  }

  const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    await updateDoc(doc(db, 'applications', applicationId), { status })
  }

  const getAcceptedApplicationsForStudent = () => {
    if (!user) return []
    return applications.filter(a => a.studentId === user.uid && a.status === 'accepted')
  }

  const addCheckIn = async (applicationId: string, studentNote: string) => {
    if (!user) return
    const app = applications.find(a => a.id === applicationId)
    if (!app) return
    const internship = internships.find(i => i.id === app.internshipId)
    if (!internship) return

    const existing = checkIns.filter(c => c.applicationId === applicationId)
    const week = existing.length + 1

    await addDoc(collection(db, 'checkins'), {
      applicationId,
      internshipId: app.internshipId,
      studentId: user.uid,
      studentName: user.fullName,
      companyId: internship.companyId,
      week,
      studentNote,
      createdAt: Date.now(),
    })
  }

  const addMentorFeedback = async (checkInId: string, feedback: string) => {
    await updateDoc(doc(db, 'checkins', checkInId), { mentorFeedback: feedback })
  }

  const getStudentCheckIns = () => {
    if (!user) return []
    return checkIns.filter(c => c.studentId === user.uid)
  }

  const getCompanyCheckIns = () => {
    if (!user) return []
    return checkIns.filter(c => c.companyId === user.uid)
  }

  return (
    <InternshipContext.Provider value={{
      internships,
      applications,
      checkIns,
      addInternship,
      getMyInternships,
      applyToInternship,
      getApplicationsForCompany,
      updateApplicationStatus,
      addCheckIn,
      addMentorFeedback,
      getStudentCheckIns,
      getCompanyCheckIns,
      getAcceptedApplicationsForStudent,
    }}>
      {children}
    </InternshipContext.Provider>
  )
}

export function useInternships() {
  const context = useContext(InternshipContext)
  if (!context) throw new Error('useInternships must be used within InternshipProvider')
  return context
}