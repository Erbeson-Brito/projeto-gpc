package com.gpc.skilltree.repository;
import com.gpc.skilltree.model.No;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface NoRepository extends JpaRepository<No, Long> {
    List<No> findByModuloIdOrderByOrdemAsc(Long moduloId);
}
