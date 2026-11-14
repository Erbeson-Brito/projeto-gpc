package com.gpc.repository;

import com.gpc.model.Professor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository
        extends JpaRepository<Professor, Long> {

    Optional<Professor> findByUsuarioId(Long usuarioId);
}