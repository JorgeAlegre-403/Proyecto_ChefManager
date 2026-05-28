import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { LuChefHat, LuMenu, LuX, LuLogOut, LuUtensilsCrossed, LuList, LuChartBar, LuBookOpen, LuCalendarDays, LuLayoutGrid, LuUsers } from 'react-icons/lu'
import { useRole } from '../hooks/useRole'

interface NavLink {
  label: string
  path: string
  color: string
  activeBg: string
  icon: React.ReactNode
}

export default function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { role } = useRole()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Cerrar drawer al cambiar de ruta
  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleLogout = async () => {
    setDrawerOpen(false)
    await supabase.auth.signOut()
    navigate('/')
  }

  const navTo = (path: string) => {
    setDrawerOpen(false)
    navigate(path)
  }

  // Construir los links según el rol
  const navLinks: NavLink[] = []

  if (role === 'cocinero' || role === 'jefecocina') {
    navLinks.push(
      { label: 'Agregar Alimento',  path: '/formulario',     color: '#2563eb', activeBg: '#eff6ff', icon: <LuUtensilsCrossed size={18} /> },
      { label: 'Ver Listado',       path: '/listado',        color: '#059669', activeBg: '#ecfdf5', icon: <LuList size={18} /> },
      { label: 'Generar Platos',    path: '/generar-platos', color: '#7c3aed', activeBg: '#f5f3ff', icon: <LuChartBar size={18} /> },
      { label: 'Platos Guardados',  path: '/platos',         color: '#6d28d9', activeBg: '#f5f3ff', icon: <LuBookOpen size={18} /> },
    )
  }

  if (role === 'jefecocina') {
    navLinks.push(
      { label: 'Generar Menús', path: '/generar-menus', color: '#c2410c', activeBg: '#fff7ed', icon: <LuCalendarDays size={18} /> },
      { label: 'Gestión Menús', path: '/gestion-menus', color: '#ea580c', activeBg: '#fff7ed', icon: <LuLayoutGrid size={18} /> },
    )
  }

  if (role === 'admin' || role === 'admin_usuarios') {
    navLinks.push(
      { label: 'Gestión de Usuarios', path: '/admin/usuarios', color: '#7c3aed', activeBg: '#f5f3ff', icon: <LuUsers size={18} /> },
    )
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* ─── BARRA PRINCIPAL ─────────────────────────────────────── */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div style={{
          maxWidth: '100%',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>

          {/* LOGO */}
          <div
            onClick={() => navTo('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{ background: '#ea580c', color: 'white', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LuChefHat size={20} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>ChefManager</span>
          </div>

          {/* NAV DESKTOP */}
          <nav style={{ display: 'flex', gap: '0.2rem', alignItems: 'center', flexWrap: 'wrap' }} className="desktop-nav">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navTo(link.path)}
                style={{
                  background: isActive(link.path) ? link.activeBg : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  color: link.color,
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                }}
                onMouseOver={(e) => { if (!isActive(link.path)) e.currentTarget.style.background = link.activeBg }}
                onMouseOut={(e) => { if (!isActive(link.path)) e.currentTarget.style.background = 'transparent' }}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          {/* DERECHA: cerrar sesión + hamburguesa */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={handleLogout}
              className="desktop-logout"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              <LuLogOut size={14} />
              Cerrar sesión
            </button>

            {/* Botón hamburguesa — solo móvil */}
            <button
              className="hamburger-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú"
              style={{
                background: 'transparent',
                border: '1.5px solid #e5e7eb',
                borderRadius: '9px',
                padding: '7px',
                cursor: 'pointer',
                color: '#374151',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LuMenu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── OVERLAY ─────────────────────────────────────────────── */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(3px)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'all' : 'none',
          transition: 'opacity 0.28s ease',
        }}
      />

      {/* ─── DRAWER LATERAL ──────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 60,
          width: '285px',
          maxWidth: '85vw',
          backgroundColor: '#fff',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Cabecera drawer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.25rem',
          borderBottom: '1px solid #f3f4f6',
          backgroundColor: '#fff7ed',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: '#ea580c', color: 'white', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <LuChefHat size={18} />
            </div>
            <span style={{ fontWeight: '800', fontSize: '17px', color: '#111827' }}>ChefManager</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar menú"
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Sección: navegación */}
        {navLinks.length > 0 && (
          <div style={{ padding: '1rem 0.75rem 0.5rem' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: '0.5rem', marginBottom: '0.4rem' }}>
              Navegación
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navTo(link.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: isActive(link.path) ? '700' : '600',
                    color: isActive(link.path) ? link.color : '#374151',
                    backgroundColor: isActive(link.path) ? link.activeBg : 'transparent',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background 0.15s, color 0.15s',
                    borderLeft: isActive(link.path) ? `3px solid ${link.color}` : '3px solid transparent',
                  }}
                  onMouseOver={(e) => { if (!isActive(link.path)) e.currentTarget.style.backgroundColor = '#f9fafb' }}
                  onMouseOut={(e) => { if (!isActive(link.path)) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <span style={{ color: link.color, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{link.icon}</span>
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Cerrar sesión al fondo del drawer */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              width: '100%',
              padding: '0.9rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
          >
            <LuLogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ─── RESPONSIVE CSS ──────────────────────────────────────── */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-nav   { display: none !important; }
          .desktop-logout { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
