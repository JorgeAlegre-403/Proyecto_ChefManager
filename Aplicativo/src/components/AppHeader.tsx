import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { LuChefHat } from 'react-icons/lu'

export default function AppHeader() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '100%',
        padding: '0.75rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* LADO IZQUIERDO: LOGO (Ocupa espacio flexible para empujar al centro) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-2xl font-bold text-gray-900 group cursor-pointer"
          >
            <div className="bg-orange-600 text-white p-1.5 rounded-lg group-hover:bg-orange-700 transition-colors">
              <LuChefHat className="w-6 h-6" />
            </div>
            <span className="tracking-tight">TraceFood</span>
          </div>
        </div>

        {/* CENTRO: NAVEGACIÓN PRINCIPAL */}
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/formulario')}
            className="nav-btn-header"
            style={{ color: '#3b82f6' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Agregar Alimento
          </button>

          <button
            onClick={() => navigate('/listado')}
            className="nav-btn-header"
            style={{ color: '#10b981' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Ver Listado
          </button>

          <button
            onClick={() => navigate('/generar-platos')}
            className="nav-btn-header"
            style={{ color: '#8b5cf6' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f3ff'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Generar Platos
          </button>

          <button
            onClick={() => navigate('/platos')}
            className="nav-btn-header"
            style={{ color: '#8b5cf6' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f3ff'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Platos Guardados
          </button>

          <button
            onClick={() => navigate('/generar-menus')}
            className="nav-btn-header"
            style={{ color: '#ea580c' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff7ed'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Generar Menús
          </button>
        </nav>

        {/* LADO DERECHO: BOTÓN CERRAR SESIÓN (Ocupa espacio flexible) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <style>{`
        .nav-btn-header {
          background-color: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          transition: all 0.2s;
        }
      `}</style>
    </header>
  )
}
