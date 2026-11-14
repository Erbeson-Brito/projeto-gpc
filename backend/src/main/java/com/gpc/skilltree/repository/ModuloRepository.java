package com.gpc.skilltree.repository;
import com.gpc.skilltree.model.Modulo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ModuloRepository extends JpaRepository<Modulo, Long> {
    List<Modulo> findByTrilhaIdOrderByOrdemAsc(Long trilhaId);
}
