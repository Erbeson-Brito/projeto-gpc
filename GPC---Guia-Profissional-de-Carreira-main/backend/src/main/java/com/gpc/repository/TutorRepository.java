package com.gpc.repository;

import com.gpc.model.Tutor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TutorRepository
        extends JpaRepository<Tutor, Long> {

    Optional<Tutor> findByUsuarioId(Long usuarioId);
}