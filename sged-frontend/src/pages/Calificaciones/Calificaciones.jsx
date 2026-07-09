import { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { calificacionService, cursoService, usuarioService } from '../../services'

function Calificaciones() {
  const [grades, setGrades] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gradesResponse, coursesResponse, studentsResponse] = await Promise.all([
          calificacionService.obtenerTodas(),
          cursoService.obtenerTodos(),
          usuarioService.obtenerPorRol('ESTUDIANTE')
        ])

        const students = studentsResponse.data || []
        const studentById = Object.fromEntries(students.map((student) => [student.id, `${student.nombre} ${student.apellido}`.trim()]))

        const gradeRows = (gradesResponse.data || []).map((grade) => ({
          ...grade,
          studentName: studentById[grade.estudianteId] || 'Estudiante',
          courseName: coursesResponse.data?.find((course) => course.id === grade.cursoId)?.nombre || 'Curso'
        }))

        setGrades(gradeRows)
        setCourses(coursesResponse.data || [])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const updateGrade = async (grade, value) => {
    try {
      await calificacionService.actualizar(grade.id, {
        ...grade,
        nota: Number(value)
      })
      setGrades((prev) => prev.map((item) => item.id === grade.id ? { ...item, nota: Number(value) } : item))
    } catch {
      setLoading(false)
    }
  }

  return (
    <Layout title="Calificaciones" subtitle="Docentes y coordinadores pueden asignar y revisar notas por curso y evaluación.">
      <div className="hero-card">
        <div>
          <h3>Resumen académico</h3>
          <p>Asigna notas por estudiante, curso y evaluación desde un panel claro y organizado.</p>
        </div>
        <span className="badge badge-info">{courses.length} cursos</span>
      </div>

      <div className="page-grid">
        <div className="panel-card">
          <h3>Cursos disponibles</h3>
          <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
            {courses.map((course) => (
              <div key={course.id} className="list-card" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                <strong>{course.nombre}</strong>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{course.nivel} {course.letra}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <h3>Registrar notas</h3>
          <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
            {loading ? <p>Cargando calificaciones...</p> : grades.map((grade) => (
              <div key={grade.id} className="list-card" style={{ alignItems: 'center' }}>
                <div>
                  <strong>{grade.studentName}</strong>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{grade.courseName} · {grade.tipoEvaluacion}</div>
                </div>
                <input
                  type="number"
                  min="1"
                  max="7"
                  step="0.1"
                  value={grade.nota}
                  onChange={(event) => updateGrade(grade, event.target.value)}
                  style={{ width: '90px', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Calificaciones
