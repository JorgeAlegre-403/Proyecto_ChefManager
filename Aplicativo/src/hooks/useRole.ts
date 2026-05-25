import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export type AppRole = 'admin' | 'jefecocina' | 'cocinero' | 'admin_usuarios' | null

/**
 * Hook que obtiene el rol real del usuario desde la tabla `usuarios_app`.
 * Esta es la única fuente de verdad: cuando el administrador cambia el rol
 * de un usuario en la tabla, se aplica inmediatamente en la siguiente
 * lectura sin necesidad de que el usuario cierre y vuelva a abrir sesión.
 */
export function useRole(): { role: AppRole; loading: boolean; userId: string | null } {
  const [role, setRole] = useState<AppRole>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchRole = async (uid: string) => {
      const { data, error } = await supabase
        .from('usuarios_app')
        .select('role')
        .eq('id', uid)
        .single()

      if (!mounted) return

      if (error || !data) {
        // Si el usuario no está en usuarios_app (p.ej. el primer admin),
        // se mantiene como 'admin' por defecto.
        setRole('admin')
      } else {
        setRole(data.role as AppRole)
      }
      setLoading(false)
    }

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!mounted) return

      if (user) {
        setUserId(user.id)
        await fetchRole(user.id)
      } else {
        setRole(null)
        setLoading(false)
      }
    }

    init()

    // Escuchar cambios de sesión (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (session?.user) {
        setUserId(session.user.id)
        setLoading(true)
        fetchRole(session.user.id)
      } else {
        setUserId(null)
        setRole(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  return { role, loading, userId }
}
