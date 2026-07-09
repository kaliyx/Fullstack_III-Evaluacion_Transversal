package cl.duocuc.sged.config;

import cl.duocuc.sged.asistencia.entity.Asistencia;
import cl.duocuc.sged.asistencia.repository.AsistenciaRepository;
import cl.duocuc.sged.calificacion.entity.Calificacion;
import cl.duocuc.sged.calificacion.repository.CalificacionRepository;
import cl.duocuc.sged.curso.entity.Curso;
import cl.duocuc.sged.curso.repository.CursoRepository;
import cl.duocuc.sged.usuario.entity.Usuario;
import cl.duocuc.sged.usuario.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
@AllArgsConstructor
public class DataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final CalificacionRepository calificacionRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            if (usuarioRepository.count() == 0) {
                Usuario admin = Usuario.builder()
                        .nombre("Administrador")
                        .apellido("Sistema")
                        .email("admin@sged.cl")
                        .password(passwordEncoder.encode("admin123"))
                        .rol(Usuario.Rol.ADMINISTRADOR)
                        .activo(true)
                        .build();
                usuarioRepository.save(admin);

                Usuario docente = Usuario.builder()
                        .nombre("Carlos")
                        .apellido("Mendoza")
                        .email("carlos.mendoza@sged.cl")
                        .password(passwordEncoder.encode("docente123"))
                        .rol(Usuario.Rol.DOCENTE)
                        .activo(true)
                        .build();
                usuarioRepository.save(docente);

                Usuario estudiante = Usuario.builder()
                        .nombre("Juan")
                        .apellido("González")
                        .email("juan.gonzalez@sged.cl")
                        .password(passwordEncoder.encode("estudiante123"))
                        .rol(Usuario.Rol.ESTUDIANTE)
                        .activo(true)
                        .build();
                usuarioRepository.save(estudiante);
            }

            if (cursoRepository.count() == 0) {
                Usuario docente = usuarioRepository.findByEmail("carlos.mendoza@sged.cl").orElseThrow();
                Curso matematica = Curso.builder()
                        .nombre("Matemática I")
                        .nivel("1°")
                        .letra("A")
                        .docenteJefeId(docente.getId())
                        .anio(2026)
                        .activo(true)
                        .build();
                cursoRepository.save(matematica);

                Curso historia = Curso.builder()
                        .nombre("Historia")
                        .nivel("2°")
                        .letra("B")
                        .docenteJefeId(docente.getId())
                        .anio(2026)
                        .activo(true)
                        .build();
                cursoRepository.save(historia);
            }

            if (calificacionRepository.count() == 0) {
                Usuario docente = usuarioRepository.findByEmail("carlos.mendoza@sged.cl").orElseThrow();
                Usuario estudiante = usuarioRepository.findByEmail("juan.gonzalez@sged.cl").orElseThrow();
                Curso curso = cursoRepository.findAll().get(0);

                Calificacion calificacion = Calificacion.builder()
                        .estudianteId(estudiante.getId())
                        .docenteId(docente.getId())
                        .cursoId(curso.getId())
                        .asignatura(curso.getNombre())
                        .tipoEvaluacion("Prueba")
                        .nota(6.2)
                        .fecha(LocalDate.now())
                        .observaciones("Registro inicial")
                        .build();
                calificacionRepository.save(calificacion);
            }

            if (asistenciaRepository.count() == 0) {
                Usuario estudiante = usuarioRepository.findByEmail("juan.gonzalez@sged.cl").orElseThrow();
                Curso curso = cursoRepository.findAll().get(0);

                Asistencia asistencia = Asistencia.builder()
                        .estudianteId(estudiante.getId())
                        .cursoId(curso.getId())
                        .fecha(LocalDate.now())
                        .presente(true)
                        .razon("Asistencia registrada")
                        .build();
                asistenciaRepository.save(asistencia);
            }
        };
    }
}
