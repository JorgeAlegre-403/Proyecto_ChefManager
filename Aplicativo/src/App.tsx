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
import ForgotPasswordPage from './pages/ForgotPasswordPage'
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>
  }

  return user ? <>{children}</> : <Navigate to="/" replace />
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
            <ProtectedRoute>
              <GenerarMenusPage />
            </ProtectedRoute>
          }
        />
        <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
