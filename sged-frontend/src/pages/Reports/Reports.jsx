import Layout from '../../components/Layout/Layout'

const reportItems = [
  { title: 'Resumen de asistencia', value: '94%', detail: 'Cohorte activa mensual' },
  { title: 'Promedio general', value: '6.9', detail: 'Calificaciones agregadas' },
  { title: 'Tasa de aprobación', value: '88%', detail: 'Último cuatrimestre' }
]

const reportTables = [
  { name: 'Cursos con mayor demanda', rows: ['Matemática I', 'Programación', 'Historia'] },
  { name: 'Docentes más activos', rows: ['Carlos Mendoza', 'Ana Morales', 'Laura Díaz'] }
]

function Reports() {
  return (
    <Layout title="Reportes" subtitle="Panel de datos e indicadores para la administración institucional.">
      <div className="hero-card">
        <div>
          <h3>Inteligencia administrativa</h3>
          <p>Monitorea el comportamiento académico y observa tendencias críticas del sistema.</p>
        </div>
        <span className="badge badge-info">Acceso exclusivo</span>
      </div>

      <div className="stat-grid">
        {reportItems.map((item) => (
          <div className="stat-card" key={item.title}>
            <div className="stat-label">{item.title}</div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-foot">{item.detail}</div>
          </div>
        ))}
      </div>

      <div className="page-grid">
        {reportTables.map((report) => (
          <div className="panel-card" key={report.name}>
            <h3>{report.name}</h3>
            <ul style={{ marginTop: '12px', gap: '10px', display: 'grid' }}>
              {report.rows.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Reports
