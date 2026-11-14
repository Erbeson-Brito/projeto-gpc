package com.gpc.skilltree.repository;
import com.gpc.skilltree.model.ProgressoUsuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProgressoUsuarioRepository extends JpaRepository<ProgressoUsuario, Long> {
    List<ProgressoUsuario> findByUsuarioIdAndNoModuloTrilhaIdAndConcluidoTrue(Long usuarioId, Long trilhaId);
    boolean existsByUsuarioIdAndNoIdAndConcluidoTrue(Long usuarioId, Long noId);
    Optional<ProgressoUsuario> findByUsuarioIdAndNoId(Long usuarioId, Long noId);
}
