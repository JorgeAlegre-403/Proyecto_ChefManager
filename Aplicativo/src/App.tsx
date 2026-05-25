import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Roles from './components/Roles'
import Footer from './components/Footer'
import Login from './components/Login'
import FormularioPage from './pages/FormularioPage'
import ListadoPage from './pages/ListadoPage'
import { GenerarPlatosPage } from './pages/GenerarPlatosPage'
import PlatosPage from './pages/PlatosPage'
import GenerarMenusPage from './pages/GenerarMenusPage'
import GestionMenusPage from './pages/GestionMenusPage'
import PublicMenuPage from './pages/PublicMenuPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AdminUsersPage from './pages/AdminUsersPage'
import './styles/index.css'

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-orange-200 selection:text-orange-900">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Roles />
      </main>
      <Footer />
    </div>
  )
}

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'admin' | 'cocinero' | 'admin_usuarios' }) {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        // Asignación automática por email para facilitar la gestión al usuario
        if (user.email === 'cocinero@gmail.com') {
          setRole('cocinero')
        } else if (user.email === 'administrador@gmail.com') {
          setRole('admin_usuarios')
        } else {
          setRole(user.user_metadata?.role || 'admin')
        }
      }
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user?.email === 'cocinero@gmail.com') {
        setRole('cocinero')
      } else if (session?.user?.email === 'administrador@gmail.com') {
        setRole('admin_usuarios')
      } else {
        setRole(session?.user?.user_metadata?.role || 'admin')
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>
  }

  if (!user) return <Navigate to="/" replace />

  // admin_usuarios solo puede acceder a /admin/usuarios
  if (role === 'admin_usuarios') {
    if (requiredRole === 'admin_usuarios') {
      return <>{children}</>
    }
    return <Navigate to="/admin/usuarios" replace />
  }

  // cocinero y jefecocina no pueden acceder a rutas admin
  if ((role === 'cocinero' || role === 'jefecocina') && requiredRole === 'admin') {
    return <Navigate to="/menu-diario" replace />
  }

  // jefecocina no puede acceder a rutas que requieren admin_usuarios
  if (role === 'jefecocina' && requiredRole === 'admin_usuarios') {
    return <Navigate to="/menu-diario" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/formulario"
          element={
            <ProtectedRoute>
              <FormularioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listado"
          element={
            <ProtectedRoute>
              <ListadoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generar-platos"
          element={
            <ProtectedRoute>
              <GenerarPlatosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platos"
          element={
            <ProtectedRoute>
              <PlatosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generar-menus"
          element={
            <ProtectedRoute requiredRole="admin">
              <GenerarMenusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion-menus"
          element={
            <ProtectedRoute requiredRole="admin">
              <GestionMenusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute requiredRole="admin_usuarios">
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/menu-diario" element={<PublicMenuPage />} />
        <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
