package com.gpc.repository;

import com.gpc.model.Recrutador;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecrutadorRepository
        extends JpaRepository<Recrutador, Long> {

    Optional<Recrutador> findByUsuarioId(Long usuarioId);
}