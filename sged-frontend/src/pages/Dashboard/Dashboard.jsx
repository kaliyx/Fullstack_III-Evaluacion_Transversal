import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getRoleLabel } from '../../utils/roles'
import Layout from '../../components/Layout/Layout'

function Dashboard() {
  const { user } = useAuth()
  const rol = (user?.rol || 'ESTUDIANTE').toUpperCase()
  const rolLabel = getRoleLabel(rol)

  const cards = {
    ADMINISTRADOR: [
      { title: 'Usuarios', description: 'Gestiona cuentas, permisos y activaciones', link: '/admin' },
      { title: 'Reportes', description: 'Visualiza métricas de asistencia y rendimiento', link: '/reports' },
      { title: 'Estudiantes', description: 'Revisa el estado de las matrículas y cursos', link: '/students' }
    ],
    DOCENTE: [
      { title: 'Mis cursos', description: 'Visualiza tus asignaturas y horarios', link: '/cursos' },
      { title: 'Evaluaciones', description: 'Registra y supervisa notas rápidamente', link: '/calificaciones' },
      { title: 'Asistencias', description: 'Controla la asistencia de tu curso', link: '/asistencias' }
    ],
    ESTUDIANTE: [
      { title: 'Mis cursos', description: 'Revisa tus asignaturas y próximos eventos', link: '/cursos' },
      { title: 'Mis notas', description: 'Consulta tus calificaciones y rendimiento', link: '/calificaciones' },
      { title: 'Mi asistencia', description: 'Comprueba tu cumplimiento de clase', link: '/asistencias' }
    ]
  }

  const overviewSections = {
    ADMINISTRADOR: {
      heading: 'Control institucional',
      summary: 'Administración de usuarios, reportes y supervisión de datos para mantener la institución en operación.'
    },
    DOCENTE: {
      heading: 'Gestión académica',
      summary: 'Registra notas, gestiona tu curso y coordina asistencias de manera clara y rápida.'
    },
    ESTUDIANTE: {
      heading: 'Seguimiento personal',
      summary: 'Revisa tu rendimiento, tu asistencia y los cursos en los que estás matriculado.'
    }
  }

  return (
    <Layout title={`Bienvenido, ${user?.nombre || 'usuario'}`} subtitle={`Tu acceso actual es ${rolLabel.toLowerCase()} y esta vista se adapta a tus permisos.`}>
      <div className="hero-card">
        <div>
          <h3>{overviewSections[rol].heading}</h3>
          <p>{overviewSections[rol].summary}</p>
        </div>
        <span className="badge badge-info">{rolLabel}</span>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Rol asignado</div>
          <div className="stat-value">{rolLabel}</div>
          <div className="stat-foot">Acceso personalizado</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Puntos clave</div>
          <div className="stat-value">3</div>
          <div className="stat-foot">Módulos relevantes</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Siguiente acción</div>
          <div className="stat-value">Revisar</div>
          <div className="stat-foot">{cards[rol]?.[0].title}</div>
        </div>
      </div>

      <div className="page-grid">
        {cards[rol]?.map((card) => (
          <div className="panel-card" key={card.title}>
            <h3>{card.title}</h3>
            <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '14px' }}>{card.description}</p>
            <Link to={card.link} className="logout-btn" style={{ width: 'fit-content', textDecoration: 'none' }}>Ver más</Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Dashboard
