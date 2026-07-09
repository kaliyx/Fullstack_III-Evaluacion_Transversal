import { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { cursoService, usuarioService } from '../../services'

function Cursos() {
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teachersResponse, coursesResponse] = await Promise.all([
          usuarioService.obtenerPorRol('DOCENTE'),
          cursoService.obtenerTodos()
        ])

        setTeachers(teachersResponse.data || [])
        setCourses(coursesResponse.data || [])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <Layout title="Cursos" subtitle="Explora tus asignaturas, los docentes asociados y los cursos que se imparten.">
      <div className="hero-card">
        <div>
          <h3>Gestión de cursos</h3>
          <p>Visualiza asignaturas, horarios, docentes y grupos asociados a cada curso.</p>
        </div>
        <span className="badge badge-info">{courses.length} cursos activos</span>
      </div>

      <div className="page-grid">
        <div className="panel-card">
          <h3>Asignaturas por docente</h3>
          <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
            {loading ? <p>Cargando información...</p> : teachers.map((teacher) => (
              <div key={teacher.id} className="list-card" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                <strong>{`${teacher.nombre} ${teacher.apellido}`.trim()}</strong>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{teacher.email}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <h3>Detalle de cursos</h3>
          <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
            {courses.map((curso) => (
              <div key={curso.id} className="list-card" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <strong>{curso.nombre}</strong>
                  <span className="badge badge-success">{curso.activo ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{curso.nivel} {curso.letra} · {curso.anio}</div>
                <div style={{ color: '#334155', fontSize: '0.92rem' }}>Docente: {curso.docenteJefeId}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Cursos
