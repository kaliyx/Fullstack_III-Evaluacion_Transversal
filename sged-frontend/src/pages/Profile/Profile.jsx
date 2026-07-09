import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../hooks/useAuth'
import { getRoleLabel } from '../../utils/roles'

function Profile() {
  const { user } = useAuth()
  const roleLabel = getRoleLabel(user?.rol)

  return (
    <Layout title="Mi perfil" subtitle="Revisa y gestiona tu información personal y tu rol en el sistema.">
      <div className="hero-card">
        <div>
          <h3>Perfil de usuario</h3>
          <p>Consulta tus datos de acceso, tu rol y el estado de tu cuenta.</p>
        </div>
        <span className="badge badge-info">{roleLabel}</span>
      </div>

      <div className="page-grid">
        <div className="panel-card">
          <h3>Datos personales</h3>
          <p><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Rol:</strong> {roleLabel}</p>
          <p><strong>Estado de cuenta:</strong> Activa</p>
        </div>

        <div className="panel-card">
          <h3>Información de acceso</h3>
          <p>Tu sesión permanece segura con JWT y controles de rol para cada vista.</p>
          <p>Las funciones asignadas se ajustan a tu rol en el sistema.</p>
          <p>Si necesitas actualizar tu perfil, solicita soporte al administrador.</p>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
