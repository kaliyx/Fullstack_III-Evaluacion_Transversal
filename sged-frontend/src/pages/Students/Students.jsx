import { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { asistenciaService, usuarioService } from '../../services'

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await usuarioService.obtenerPorRol('ESTUDIANTE')
        const studentsData = response.data || []
        const studentsWithAttendance = await Promise.all(studentsData.map(async (student) => {
          const attendanceResponse = await asistenciaService.obtenerPorEstudiante(student.id)
          const records = attendanceResponse.data || []
          const present = records.filter((record) => record.presente).length
          const porcentaje = records.length ? `${Math.round((present / records.length) * 100)}%` : 'Sin registros'
          return {
            ...student,
            curso: 'Curso cargado desde base de datos',
            asistencia: porcentaje,
            estado: student.activo ? 'Activo' : 'Inactivo'
          }
        }))
        setStudents(studentsWithAttendance)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <Layout title="Estudiantes" subtitle="Accede a la información activa de alumnos y su rendimiento en cursos.">
      <div className="hero-card">
        <div>
          <h3>Gestión de matrículas</h3>
          <p>Revisa el estado académico y la asistencia de los estudiantes de la institución.</p>
        </div>
        <span className="badge badge-info">{students.length} alumnos activos</span>
      </div>

      <div className="panel-card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Correo</th>
              <th>Curso</th>
              <th>Asistencia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5">Cargando estudiantes...</td></tr> : students.map((student) => (
              <tr key={student.id}>
                <td>{`${student.nombre} ${student.apellido}`.trim()}</td>
                <td>{student.email}</td>
                <td>{student.curso}</td>
                <td>{student.asistencia}</td>
                <td><span className="badge badge-success">{student.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Students
