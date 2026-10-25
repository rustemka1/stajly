import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { InternshipProvider } from './context/InternshipContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import CreateInternship from './pages/company/CreateInternship'
import MyInternships from './pages/company/MyInternships'
import Applications from './pages/company/Applications'
import CompanyCheckIns from './pages/company/CompanyCheckIns'
import Internships from './pages/student/Internships'
import MyApplications from './pages/student/MyApplications'
import CheckIns from './pages/student/CheckIns'
import Profile from './pages/student/Profile'
import StudentProfileView from './pages/StudentProfileView'
import AllInternships from './pages/admin/AllInternships'
import { AppLayout } from './components/layout/AppLayout'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/create-internship" element={
        <ProtectedRoute>
          <AppLayout><CreateInternship /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/my-internships" element={
        <ProtectedRoute>
          <AppLayout><MyInternships /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/applications" element={
        <ProtectedRoute>
          <AppLayout><Applications /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/company-checkins" element={
        <ProtectedRoute>
          <AppLayout><CompanyCheckIns /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/internships" element={
        <ProtectedRoute>
          <AppLayout><Internships /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/my-applications" element={
        <ProtectedRoute>
          <AppLayout><MyApplications /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/checkins" element={
        <ProtectedRoute>
          <AppLayout><CheckIns /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout><Profile /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/student/:uid" element={
        <ProtectedRoute>
          <AppLayout><StudentProfileView /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/all-internships" element={
        <ProtectedRoute>
          <AppLayout><AllInternships /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/students" element={
        <ProtectedRoute>
          <AppLayout>
            <div className="text-xl font-semibold">Студенты (скоро)</div>
          </AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InternshipProvider>
          <AppRoutes />
        </InternshipProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}