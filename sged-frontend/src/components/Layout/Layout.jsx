import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getRoleLabel } from '../../utils/roles'
import { FiBookOpen, FiCalendar, FiHome, FiLogOut, FiUsers, FiAward } from 'react-icons/fi'
import './layout.scss'

const navigationByRole = {
  ADMINISTRADOR: [
    { path: '/admin', label: 'Panel', icon: FiUsers },
    { path: '/dashboard', label: 'Inicio', icon: FiHome },
    { path: '/cursos', label: 'Cursos', icon: FiBookOpen },
    { path: '/students', label: 'Estudiantes', icon: FiUsers },
    { path: '/reports', label: 'Reportes', icon: FiAward },
    { path: '/profile', label: 'Mi perfil', icon: FiHome }
  ],
  DOCENTE: [
    { path: '/dashboard', label: 'Inicio', icon: FiHome },
    { path: '/cursos', label: 'Cursos', icon: FiBookOpen },
    { path: '/students', label: 'Estudiantes', icon: FiUsers },
    { path: '/calificaciones', label: 'Calificaciones', icon: FiAward },
    { path: '/asistencias', label: 'Asistencias', icon: FiCalendar },
    { path: '/profile', label: 'Mi perfil', icon: FiHome }
  ],
  ESTUDIANTE: [
    { path: '/dashboard', label: 'Inicio', icon: FiHome },
    { path: '/cursos', label: 'Mis cursos', icon: FiBookOpen },
    { path: '/calificaciones', label: 'Mis notas', icon: FiAward },
    { path: '/asistencias', label: 'Mi asistencia', icon: FiCalendar },
    { path: '/profile', label: 'Mi perfil', icon: FiHome }
  ]
}

function Layout({ title, subtitle, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const role = (user?.rol || 'ESTUDIANTE').toUpperCase()
  const navItems = navigationByRole[role] || navigationByRole.ESTUDIANTE

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-block">
          <div className="brand-icon">S</div>
          <div>
            <h2>SGED</h2>
            <p>Sistema estudiantil</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-card">
            <p className="profile-label">Usuario activo</p>
            <strong>{user?.nombre || 'Usuario'}</strong>
            <span>{getRoleLabel(role)}</span>
          </div>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="app-topbar">
          <div>
            <p className="eyebrow">{getRoleLabel(role)}</p>
            <h1>{title}</h1>
            <p className="topbar-subtitle">{subtitle}</p>
          </div>
          <div className="topbar-badge">
            <span>{location.pathname === '/admin' ? 'Gestión general' : 'Panel operativo'}</span>
          </div>
        </header>

        <section className="page-content">
          {children}
        </section>
      </main>
    </div>
  )
}

export default Layout
