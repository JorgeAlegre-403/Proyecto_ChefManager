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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 group cursor-pointer">
          <div className="bg-orange-600 text-white p-1.5 rounded-lg group-hover:bg-orange-700 transition-colors">
            <LuChefHat className="w-6 h-6" />
          </div>
          <span className="tracking-tight">TraceFood</span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/formulario')}
            style={{
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Agregar Alimento
          </button>

          <button
            onClick={() => navigate('/listado')}
            style={{
              backgroundColor: 'transparent',
              color: '#10b981',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Ver Listado
          </button>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  )
}
