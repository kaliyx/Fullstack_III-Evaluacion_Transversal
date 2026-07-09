import Layout from '../../components/Layout/Layout'

const asistencias = [
  { curso: 'Matemática I', porcentaje: '95%', estado: 'Excelente' },
  { curso: 'Historia', porcentaje: '88%', estado: 'Bueno' },
  { curso: 'Programación', porcentaje: '91%', estado: 'Excelente' }
]

function Asistencias() {
  return (
    <Layout title="Asistencias" subtitle="Consulta tu participación y el porcentaje de asistencia por asignatura.">
      <div className="hero-card">
        <div>
          <h3>Seguimiento de asistencia</h3>
          <p>Mantén el control del porcentaje de clases asistidas en cada curso.</p>
        </div>
        <span className="badge badge-success">91% general</span>
      </div>

      <div className="panel-card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Porcentaje</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((item) => (
              <tr key={item.curso}>
                <td>{item.curso}</td>
                <td>{item.porcentaje}</td>
                <td><span className="badge badge-success">{item.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Asistencias
