package com.gpc.skilltree.repository;
import com.gpc.skilltree.model.Questao;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface QuestaoRepository extends JpaRepository<Questao, Long> {
    List<Questao> findByNoIdOrderByIdAsc(Long noId);
}
