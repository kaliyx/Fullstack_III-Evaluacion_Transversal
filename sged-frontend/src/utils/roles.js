export const ROLE_LABELS = {
  ADMINISTRADOR: 'Administrador',
  DOCENTE: 'Docente',
  ESTUDIANTE: 'Estudiante'
}

export const getRoleLabel = (rol = 'ESTUDIANTE') => {
  const normalizedRole = rol?.toUpperCase?.() || 'ESTUDIANTE'
  return ROLE_LABELS[normalizedRole] || ROLE_LABELS.ESTUDIANTE
}

export const getRoleFromEmail = (email = '') => {
  const normalizedEmail = email.toLowerCase()

  if (normalizedEmail.includes('admin')) {
    return 'ADMINISTRADOR'
  }

  if (normalizedEmail.includes('docente') || normalizedEmail.includes('teacher')) {
    return 'DOCENTE'
  }

  return 'ESTUDIANTE'
}

export const getHomeRouteForRole = (rol = 'ESTUDIANTE') => {
  switch (rol?.toUpperCase?.()) {
    case 'ADMINISTRADOR':
      return '/admin'
    case 'DOCENTE':
      return '/docente'
    default:
      return '/estudiante'
  }
}
