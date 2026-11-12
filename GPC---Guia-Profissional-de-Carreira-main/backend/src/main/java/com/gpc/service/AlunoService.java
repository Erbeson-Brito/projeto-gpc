package com.gpc.service;

import com.gpc.dto.AlunoResponse;
import com.gpc.dto.AtualizarPerfilAlunoRequest;
import com.gpc.model.Aluno;
import com.gpc.repository.AlunoRepository;
import org.springframework.stereotype.Service;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;

    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    public AlunoResponse buscarPorUsuario(Long usuarioId) {

        Aluno aluno = alunoRepository
                .findByUsuarioId(usuarioId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Perfil de aluno não encontrado."
                        )
                );

        return converter(aluno);
    }

    public AlunoResponse atualizar(
            Long usuarioId,
            AtualizarPerfilAlunoRequest dados) {

        Aluno aluno = alunoRepository
                .findByUsuarioId(usuarioId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Perfil de aluno não encontrado."
                        )
                );

        aluno.setObjetivoProfissional(
                dados.getObjetivoProfissional()
        );

        aluno.setNivelExperiencia(
                dados.getNivelExperiencia()
        );

        return converter(
                alunoRepository.save(aluno)
        );
    }

    private AlunoResponse converter(Aluno aluno) {

        return new AlunoResponse(
                aluno.getId(),
                aluno.getUsuario().getId(),
                aluno.getUsuario().getNome(),
                aluno.getUsuario().getEmail(),
                aluno.getObjetivoProfissional(),
                aluno.getNivelExperiencia()
        );
    }
}