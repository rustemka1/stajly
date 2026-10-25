import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { UserProfile, UserRole } from '../types'

interface AuthContextType {
  user: UserProfile | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (data: Partial<UserProfile> & { email: string; password: string; role: UserRole }) => Promise<void>
  logout: () => void
  loading: boolean
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (snap.exists()) {
          setUser(snap.data() as UserProfile)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const snap = await getDoc(doc(db, 'users', cred.user.uid))
      if (!snap.exists()) {
        await signOut(auth)
        throw new Error('Профиль не найден')
      }
      const profile = snap.data() as UserProfile
      if (profile.role !== role) {
        await signOut(auth)
        throw new Error(`Этот аккаунт зарегистрирован как «${profile.role}»`)
      }
      setUser(profile)
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: any) => {
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const profile: Record<string, any> = {
        uid: cred.user.uid,
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        createdAt: Date.now(),
        university: data.university || 'SDU',
      }

      if (data.companyName) profile.companyName = data.companyName
      if (data.studentId) profile.studentId = data.studentId
      if (data.course) profile.course = data.course

      await setDoc(doc(db, 'users', cred.user.uid), profile)
      setUser(profile as UserProfile)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    const clean: Record<string, any> = {}
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) clean[k] = v
    })
    await setDoc(ref, clean, { merge: true })
    setUser({ ...user, ...clean } as UserProfile)
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}