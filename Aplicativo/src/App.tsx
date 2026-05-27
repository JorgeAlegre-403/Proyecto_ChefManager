import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { useRole } from './hooks/useRole'
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

/**
 * ProtectedRoute lee el rol desde la tabla usuarios_app a través del hook useRole.
 * Así el rol asignado por el administrador se aplica de verdad sin depender
 * de user_metadata ni de emails hardcodeados.
 *
 * Permisos por rol:
 *   - admin        → solo /admin/usuarios (gestión de usuarios)
 *   - jefecocina   → acceso a alimentos, platos y menús (sin /admin/usuarios)
 *   - cocinero     → acceso a alimentos y platos (sin gestión de menús)
 *   - admin_usuarios → solo /admin/usuarios
 */
function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: 'admin' | 'cocinero' | 'admin_usuarios'
}) {
  const [user, setUser] = useState<any>(null)
  const [userLoading, setUserLoading] = useState(true)
  const { role, loading: roleLoading } = useRole()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setUserLoading(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (userLoading || roleLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Cargando...
      </div>
    )
  }

  // Sin sesión → al inicio
  if (!user) return <Navigate to="/" replace />

  // --- Restricciones por rol ---

  // admin y admin_usuarios: solo pueden acceder a /admin/usuarios
  if (role === 'admin' || role === 'admin_usuarios') {
    return requiredRole === 'admin_usuarios' ? <>{children}</> : <Navigate to="/admin/usuarios" replace />
  }

  // cocinero: no puede acceder a rutas que requieren 'admin' (menús)
  if (role === 'cocinero' && requiredRole === 'admin') {
    return <Navigate to="/listado" replace />
  }

  // jefecocina: puede acceder a todo excepto /admin/usuarios
  if (role === 'jefecocina' && requiredRole === 'admin_usuarios') {
    return <Navigate to="/listado" replace />
  }

  // jefecocina y cocinero tienen acceso a sus rutas correspondientes
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
