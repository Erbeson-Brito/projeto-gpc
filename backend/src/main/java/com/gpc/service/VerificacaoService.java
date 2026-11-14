package com.gpc.service;

import com.gpc.dto.SolicitarPerfilRequest;
import com.gpc.dto.VerificacaoResponse;
import com.gpc.model.*;
import com.gpc.repository.*;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VerificacaoService {

    private final VerificacaoProfissionalRepository verificacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PapelRepository papelRepository;
    private final ProfessorRepository professorRepository;
    private final TutorRepository tutorRepository;
    private final RecrutadorRepository recrutadorRepository;

    public VerificacaoService(
            VerificacaoProfissionalRepository verificacaoRepository,
            UsuarioRepository usuarioRepository,
            PapelRepository papelRepository,
            ProfessorRepository professorRepository,
            TutorRepository tutorRepository,
            RecrutadorRepository recrutadorRepository) {

        this.verificacaoRepository = verificacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.papelRepository = papelRepository;
        this.professorRepository = professorRepository;
        this.tutorRepository = tutorRepository;
        this.recrutadorRepository = recrutadorRepository;
    }

    public VerificacaoResponse solicitar(
            Long usuarioId,
            SolicitarPerfilRequest dados) {

        Usuario usuario = buscarUsuario(usuarioId);

        String tipo = dados.getTipoPerfil();

        if (tipo == null) {
            throw new IllegalArgumentException(
                    "Tipo de perfil obrigatório."
            );
        }

        tipo = tipo.toUpperCase();

        if (!tipo.equals("PROFESSOR")
                && !tipo.equals("TUTOR")
                && !tipo.equals("RECRUTADOR")) {

            throw new IllegalArgumentException(
                    "Perfil profissional inválido."
            );
        }

        VerificacaoProfissional verificacao =
                new VerificacaoProfissional();

        verificacao.setUsuario(usuario);
        verificacao.setTipoPerfil(tipo);
        verificacao.setStatus("PENDENTE");

        return converter(
                verificacaoRepository.save(verificacao)
        );
    }

    public List<VerificacaoResponse> listarPendentes() {

        return verificacaoRepository
                .findByStatus("PENDENTE")
                .stream()
                .map(this::converter)
                .toList();
    }

    public List<VerificacaoResponse> listarDoUsuario(
            Long usuarioId) {

        return verificacaoRepository
                .findByUsuarioId(usuarioId)
                .stream()
                .map(this::converter)
                .toList();
    }

    @Transactional
    public VerificacaoResponse aprovar(
            Long verificacaoId,
            Long adminId) {

        VerificacaoProfissional verificacao =
                buscarVerificacao(verificacaoId);

        Usuario admin = buscarUsuario(adminId);

        validarAdmin(admin);

        verificacao.setStatus("APROVADO");
        verificacao.setDataAnalise(LocalDateTime.now());
        verificacao.setAnalisadoPor(admin);

        adicionarPapelEPerfil(
                verificacao.getUsuario(),
                verificacao.getTipoPerfil()
        );

        return converter(
                verificacaoRepository.save(verificacao)
        );
    }

    public VerificacaoResponse rejeitar(
            Long verificacaoId,
            Long adminId) {

        VerificacaoProfissional verificacao =
                buscarVerificacao(verificacaoId);

        Usuario admin = buscarUsuario(adminId);

        validarAdmin(admin);

        verificacao.setStatus("REJEITADO");
        verificacao.setDataAnalise(LocalDateTime.now());
        verificacao.setAnalisadoPor(admin);

        return converter(
                verificacaoRepository.save(verificacao)
        );
    }

    private void adicionarPapelEPerfil(
            Usuario usuario,
            String tipo) {

        Papel papel = papelRepository
                .findByNome(tipo)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Papel não encontrado."
                        )
                );

        usuario.getPapeis().add(papel);
        usuarioRepository.save(usuario);

        switch (tipo) {

            case "PROFESSOR" -> {

                if (professorRepository
                        .findByUsuarioId(usuario.getId())
                        .isEmpty()) {

                    Professor professor = new Professor();
                    professor.setUsuario(usuario);
                    professorRepository.save(professor);
                }
            }

            case "TUTOR" -> {

                if (tutorRepository
                        .findByUsuarioId(usuario.getId())
                        .isEmpty()) {

                    Tutor tutor = new Tutor();
                    tutor.setUsuario(usuario);
                    tutorRepository.save(tutor);
                }
            }

            case "RECRUTADOR" -> {

                if (recrutadorRepository
                        .findByUsuarioId(usuario.getId())
                        .isEmpty()) {

                    Recrutador recrutador =
                            new Recrutador();

                    recrutador.setUsuario(usuario);
                    recrutadorRepository.save(recrutador);
                }
            }
        }
    }

    private void validarAdmin(Usuario usuario) {

        boolean admin = usuario.getPapeis()
                .stream()
                .anyMatch(p ->
                        p.getNome().equals("ADMIN"));

        if (!admin) {
            throw new IllegalStateException(
                    "Usuário não possui permissão de administrador."
            );
        }
    }

    private Usuario buscarUsuario(Long id) {

        return usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Usuário não encontrado."
                        )
                );
    }

    private VerificacaoProfissional buscarVerificacao(
            Long id) {

        return verificacaoRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Verificação não encontrada."
                        )
                );
    }

    private VerificacaoResponse converter(
            VerificacaoProfissional v) {

        return new VerificacaoResponse(
                v.getId(),
                v.getUsuario().getId(),
                v.getTipoPerfil(),
                v.getStatus(),
                v.getDataSolicitacao(),
                v.getDataAnalise()
        );
    }
}