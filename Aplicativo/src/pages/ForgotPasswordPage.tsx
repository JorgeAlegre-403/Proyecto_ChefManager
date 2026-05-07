import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { LuMail, LuArrowLeft, LuCheck, LuLoader } from 'react-icons/lu';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center overflow-hidden font-sans">
      <Link
        to="/login"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-orange-600 bg-white/60 backdrop-blur-md border border-gray-200/50 hover:border-orange-200 font-medium text-sm transition-all hover:shadow-md"
      >
        <LuArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>

      <motion.div
        className="relative z-10 w-full max-w-[420px] mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-orange-900/5 text-center">
          <div className="inline-flex items-center justify-center bg-orange-100 text-orange-600 p-4 rounded-full mb-6">
            <LuMail className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h1>
          <p className="text-gray-500 text-sm mb-8">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
              <div className="inline-flex items-center justify-center bg-green-100 text-green-600 p-2 rounded-full mb-4">
                <LuCheck className="w-6 h-6" />
              </div>
              <p className="text-green-800 font-medium mb-2">¡Correo enviado!</p>
              <p className="text-green-700 text-xs mb-6">
                Revisa tu bandeja de entrada para continuar con el proceso.
              </p>
              <Link
                to="/login"
                className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all"
              >
                Volver al Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-left">
                <label htmlFor="email" className="block mb-1.5 font-medium text-sm text-gray-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs text-left">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LuLoader className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar instrucciones'
                )}
              </button>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
                >
                  Recordé mi contraseña
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
