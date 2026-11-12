package com.gpc.repository;

import com.gpc.model.VerificacaoProfissional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificacaoProfissionalRepository
        extends JpaRepository<
                VerificacaoProfissional,
                Long> {

    List<VerificacaoProfissional>
            findByUsuarioId(Long usuarioId);

    List<VerificacaoProfissional>
            findByStatus(String status);
}