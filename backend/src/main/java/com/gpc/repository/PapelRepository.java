package com.gpc.repository;

import com.gpc.model.Papel;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PapelRepository
        extends JpaRepository<Papel, Long> {

    Optional<Papel> findByNome(String nome);
}