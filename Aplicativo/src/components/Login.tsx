import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { LuChefHat, LuMail, LuLock, LuArrowLeft } from 'react-icons/lu'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Redireccionar según el rol del usuario
        if (data.user.email === 'administrador@gmail.com') {
          navigate('/admin/usuarios')
        } else if (data.user.email === 'cocinero@gmail.com') {
          navigate('/listado')
        } else {
          navigate('/listado')
        }
      }
    } catch (err) {
      setError('Error al iniciar sesion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center overflow-hidden font-sans selection:bg-orange-200 selection:text-orange-900">
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-orange-600 bg-white/60 backdrop-blur-md border border-gray-200/50 hover:border-orange-200 font-medium text-sm transition-all hover:shadow-md"
      >
        <LuArrowLeft className="w-4 h-4" />
        Volver
      </Link>

      <motion.div
        className="relative z-10 w-full max-w-[420px] mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-orange-900/5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-orange-600 text-white p-3 rounded-xl mb-5 shadow-lg shadow-orange-600/20">
              <LuChefHat className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              Bienvenido a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                ChefManager
              </span>
            </h1>
            <p className="text-gray-500 text-sm">
              Accede al sistema de trazabilidad
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block mb-1.5 font-medium text-sm text-gray-700">
                Correo electronico
              </label>
              <div className="relative">
                <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block mb-1.5 font-medium text-sm text-gray-700">
                Contrasena
              </label>
              <div className="relative">
                <LuLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Tu contrasena"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-orange-600 transition-colors rounded-md"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link
                  to="/recuperar-contrasena"
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-medium text-sm text-white transition-all active:scale-[0.98] ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Sistema de trazabilidad alimentaria
        </p>
      </motion.div>
    </div>
  )
}
