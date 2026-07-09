import { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { cursoService, usuarioService } from '../../services'

function AdminPanel() {
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '' })
  const [selectedCoursesByStudent, setSelectedCoursesByStudent] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersResponse, coursesResponse] = await Promise.all([
          usuarioService.obtenerTodos(),
          cursoService.obtenerTodos()
        ])

        const users = usersResponse.data || []
        const allCourses = coursesResponse.data || []

        setTeachers(users.filter((user) => user.rol === 'DOCENTE').map((user) => ({
          id: user.id,
          name: `${user.nombre} ${user.apellido}`.trim(),
          email: user.email,
          subject: 'Asignatura general',
          cursos: [],
          estado: user.activo ? 'Activo' : 'Inactivo'
        })))

        setStudents(users.filter((user) => user.rol === 'ESTUDIANTE').map((user) => ({
          id: user.id,
          name: `${user.nombre} ${user.apellido}`.trim(),
          email: user.email,
          curso: 'Sin curso asignado',
          estado: user.activo ? 'Activo' : 'Inactivo'
        })))

        setCourses(allCourses.map((course) => ({
          id: course.id,
          nombre: course.nombre,
          estado: course.activo ? 'Activo' : 'Inactivo',
          asignatura: course.nombre,
          horario: `${course.nivel} ${course.letra}`,
          docente: course.docenteJefeId ? `Docente #${course.docenteJefeId}` : 'Sin asignar'
        })))
      } catch {
        setError('No se pudo cargar la información desde la base de datos.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const totalUsers = useMemo(() => teachers.length + students.length, [teachers.length, students.length])

  const handleAddTeacher = async (event) => {
    event.preventDefault()
    if (!newTeacher.name || !newTeacher.email) return

    const parts = newTeacher.name.trim().split(/\s+/)
    const nombre = parts[0] || 'Docente'
    const apellido = parts.slice(1).join(' ') || 'Sistema'

    try {
      const response = await usuarioService.crear({
        nombre,
        apellido,
        email: newTeacher.email,
        rol: 'DOCENTE',
        activo: true
      })

      const teacher = response.data
      setTeachers((prev) => [{
        id: teacher.id,
        name: `${teacher.nombre} ${teacher.apellido}`.trim(),
        email: teacher.email,
        subject: 'Asignatura general',
        cursos: [],
        estado: teacher.activo ? 'Activo' : 'Inactivo'
      }, ...prev])
      setNewTeacher({ name: '', email: '' })
    } catch {
      setError('No se pudo crear el docente.')
    }
  }

  const toggleStudentCourse = (studentId, courseName) => {
    setSelectedCoursesByStudent((prev) => {
      const current = prev[studentId] || []
      const exists = current.includes(courseName)
      return {
        ...prev,
        [studentId]: exists ? current.filter((course) => course !== courseName) : [...current, courseName]
      }
    })
  }

  const assignTeacherToCourse = async (courseId, teacherId) => {
    const course = courses.find((item) => item.id === courseId)
    const teacher = teachers.find((item) => item.id === teacherId)
    if (!course || !teacher) return

    try {
      await cursoService.actualizar(courseId, {
        id: course.id,
        nombre: course.nombre,
        nivel: 'Medio',
        letra: 'A',
        docenteJefeId: teacher.id,
        anio: 2026,
        activo: true
      })

      setCourses((prev) => prev.map((item) => item.id === courseId ? {
        ...item,
        docente: teacher.name
      } : item))
    } catch {
      setError('No se pudo asignar el docente al curso.')
    }
  }

  return (
    <Layout title="Panel Administrativo" subtitle="Gestiona docentes, estudiantes, cursos y asignaciones desde un único centro de control.">
      <div className="hero-card">
        <div>
          <h3>Vista administrativa</h3>
          <p>Control general del sistema con indicadores de usuarios, cursos y estado del entorno académico.</p>
        </div>
        <span className="badge badge-success">Operativo</span>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Usuarios</div>
          <div className="stat-value">{totalUsers}</div>
          <div className="stat-foot">Profesores + estudiantes</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cursos activos</div>
          <div className="stat-value">{courses.length}</div>
          <div className="stat-foot">Vinculados a docentes</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Asistencia</div>
          <div className="stat-value">92%</div>
          <div className="stat-foot">Promedio general</div>
        </div>
      </div>

      {error ? <div className="panel-card"><p>{error}</p></div> : null}

      <div className="page-grid">
        <div className="panel-card">
          <h3>Agregar docente</h3>
          <form onSubmit={handleAddTeacher} style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
            <input value={newTeacher.name} onChange={(event) => setNewTeacher({ ...newTeacher, name: event.target.value })} placeholder="Nombre completo" />
            <input value={newTeacher.email} onChange={(event) => setNewTeacher({ ...newTeacher, email: event.target.value })} placeholder="Correo institucional" />
            <button type="submit" className="logout-btn" style={{ width: '100%' }}>Guardar docente</button>
          </form>
        </div>

        <div className="panel-card">
          <h3>Resumen ejecutivo</h3>
          <div className="list-card"><span>Profesores activados</span><span className="badge badge-info">{teachers.length}</span></div>
          <div className="list-card"><span>Alumnos registrados</span><span className="badge badge-success">{students.length}</span></div>
          <div className="list-card"><span>Alertas de asistencia</span><span className="badge badge-warn">3 cursos</span></div>
        </div>
      </div>

      <div className="page-grid">
        <div className="panel-card">
          <h3>Gestión de docentes</h3>
          <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
            {loading ? <p>Cargando docentes...</p> : teachers.map((teacher) => (
              <div key={teacher.id} className="list-card" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <strong>{teacher.name}</strong>
                  <span className="badge badge-info">{teacher.subject}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{teacher.email}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <h3>Gestión de cursos</h3>
          <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
            {courses.map((course) => (
              <div key={course.id} className="list-card" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <strong>{course.nombre}</strong>
                  <span className="badge badge-success">{course.estado}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{course.asignatura} · {course.horario}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {teachers.map((teacher) => (
                    <button key={`${course.id}-${teacher.id}`} type="button" className="badge badge-info" onClick={() => assignTeacherToCourse(course.id, teacher.id)}>{teacher.name}</button>
                  ))}
                </div>
                <div style={{ color: '#334155', fontSize: '0.92rem' }}>Docente: {course.docente}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel-card">
        <h3>Vincular estudiantes a cursos</h3>
        <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
          {students.map((student) => (
            <div key={student.id} className="list-card" style={{ alignItems: 'center' }}>
              <div>
                <strong>{student.name}</strong>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{student.email}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {courses.map((course) => (
                  <button key={`${student.id}-${course.id}`} type="button" className={`badge ${selectedCoursesByStudent[student.id]?.includes(course.nombre) ? 'badge-success' : 'badge-info'}`} onClick={() => toggleStudentCourse(student.id, course.nombre)}>{course.nombre}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default AdminPanel
