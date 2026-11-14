package com.gpc.skilltree.service;

import com.gpc.model.Usuario;
import com.gpc.repository.UsuarioRepository;
import com.gpc.skilltree.dto.RespostasRequest;
import com.gpc.skilltree.dto.ResultadoAtividade;
import com.gpc.skilltree.dto.TrilhaResponse;
import com.gpc.skilltree.model.*;
import com.gpc.skilltree.repository.*;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TrilhaService {
    private final TrilhaRepository trilhas;
    private final ModuloRepository modulos;
    private final NoRepository nos;
    private final QuestaoRepository questoes;
    private final ProgressoUsuarioRepository progressos;
    private final UsuarioRepository usuarios;

    public TrilhaService(TrilhaRepository trilhas, ModuloRepository modulos, NoRepository nos,
                        QuestaoRepository questoes, ProgressoUsuarioRepository progressos,
                        UsuarioRepository usuarios) {
        this.trilhas = trilhas; this.modulos = modulos; this.nos = nos;
        this.questoes = questoes; this.progressos = progressos; this.usuarios = usuarios;
    }

    @Transactional(readOnly = true)
    public TrilhaResponse consultar(Long trilhaId, Long usuarioId) {
        Trilha trilha = buscarTrilha(trilhaId);
        validarUsuario(usuarioId);
        Set<Long> concluidos = buscarConcluidos(usuarioId, trilhaId);
        List<Modulo> listaModulos = modulos.findByTrilhaIdOrderByOrdemAsc(trilhaId);
        List<TrilhaResponse.ModuloResponse> resposta = new ArrayList<>();
        boolean anterioresConcluidos = true;
        for (Modulo modulo : listaModulos) {
            List<No> listaNos = nos.findByModuloIdOrderByOrdemAsc(modulo.getId());
            boolean moduloConcluido = !listaNos.isEmpty()
                && listaNos.stream().allMatch(no -> concluidos.contains(no.getId()));
            String estadoModulo = moduloConcluido ? "CONCLUIDO"
                : anterioresConcluidos ? "DISPONIVEL" : "BLOQUEADO";
            List<TrilhaResponse.NoResponse> respostaNos = new ArrayList<>();
            for (No no : listaNos) {
                String estadoNo = estado(no, concluidos, anterioresConcluidos);
                List<Long> requisitos = no.getPreRequisitos().stream().map(No::getId).sorted().toList();
                List<TrilhaResponse.QuestaoResponse> perguntas = questoes.findByNoIdOrderByIdAsc(no.getId())
                    .stream().map(q -> new TrilhaResponse.QuestaoResponse(
                        q.getId(), q.getEnunciado(), q.getDificuldade())).toList();
                respostaNos.add(new TrilhaResponse.NoResponse(no.getId(), no.getTitulo(),
                    no.getConteudo(), estadoNo, requisitos, perguntas));
            }
            resposta.add(new TrilhaResponse.ModuloResponse(modulo.getId(), modulo.getTitulo(),
                modulo.getDescricao(), estadoModulo, respostaNos));
            anterioresConcluidos = anterioresConcluidos && moduloConcluido;
        }
        return new TrilhaResponse(trilha.getId(), trilha.getNome(), trilha.getDescricao(), resposta);
    }

    @Transactional
    public ResultadoAtividade responder(Long trilhaId, Long noId, Long usuarioId, RespostasRequest request) {
        buscarTrilha(trilhaId);
        Usuario usuario = validarUsuario(usuarioId);
        No no = nos.findById(noId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nó não encontrado"));
        if (!no.getModulo().getTrilha().getId().equals(trilhaId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nó não pertence à trilha");
        Set<Long> concluidos = buscarConcluidos(usuarioId, trilhaId);
        if (concluidos.contains(noId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nó já concluído");
        if (!moduloAnteriorConcluido(no.getModulo(), concluidos)
            || no.getPreRequisitos().stream().anyMatch(pre -> !concluidos.contains(pre.getId())))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Pré-requisitos pendentes");

        List<Questao> perguntas = questoes.findByNoIdOrderByIdAsc(noId);
        if (perguntas.isEmpty())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nó sem questões cadastradas");
        if (request == null || request.respostas() == null || request.respostas().size() != perguntas.size())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Responda todas as questões do nó");
        Map<Long, String> respostas = new HashMap<>();
        for (RespostasRequest.Resposta resposta : request.respostas()) {
            if (resposta == null || resposta.questaoId() == null || resposta.texto() == null
                || respostas.putIfAbsent(resposta.questaoId(), resposta.texto()) != null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Respostas inválidas ou repetidas");
        }
        Set<Long> idsEsperados = perguntas.stream().map(Questao::getId).collect(Collectors.toSet());
        if (!respostas.keySet().equals(idsEsperados))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Questões não pertencem ao nó");
        long acertos = perguntas.stream().filter(q -> q.getGabarito() != null
            && q.getGabarito().trim().equalsIgnoreCase(respostas.get(q.getId()).trim())).count();
        int nota = (int) (acertos * 100 / perguntas.size());
        if (nota >= 60) {
            ProgressoUsuario progresso = progressos.findByUsuarioIdAndNoId(usuarioId, noId)
                .orElseGet(() -> new ProgressoUsuario(usuario, no));
            progresso.concluir();
            progressos.saveAndFlush(progresso);
            return new ResultadoAtividade(nota, true, "CONCLUIDO");
        }
        return new ResultadoAtividade(nota, false, "DISPONIVEL");
    }

    private String estado(No no, Set<Long> concluidos, boolean anterioresConcluidos) {
        if (concluidos.contains(no.getId())) return "CONCLUIDO";
        if (!anterioresConcluidos || no.getPreRequisitos().stream()
            .anyMatch(pre -> !concluidos.contains(pre.getId()))) return "BLOQUEADO";
        return "DISPONIVEL";
    }

    private boolean moduloAnteriorConcluido(Modulo modulo, Set<Long> concluidos) {
        for (Modulo anterior : modulos.findByTrilhaIdOrderByOrdemAsc(modulo.getTrilha().getId())) {
            if (anterior.getId().equals(modulo.getId())) return true;
            List<No> lista = nos.findByModuloIdOrderByOrdemAsc(anterior.getId());
            if (lista.isEmpty() || lista.stream().anyMatch(no -> !concluidos.contains(no.getId()))) return false;
        }
        return false;
    }

    private Trilha buscarTrilha(Long id) {
        return trilhas.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trilha não encontrada"));
    }

    private Usuario validarUsuario(Long id) {
        if (id == null || id <= 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "usuarioId inválido");
        return usuarios.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    private Set<Long> buscarConcluidos(Long usuarioId, Long trilhaId) {
        return progressos.findByUsuarioIdAndNoModuloTrilhaIdAndConcluidoTrue(usuarioId, trilhaId)
            .stream().map(p -> p.getNo().getId()).collect(Collectors.toSet());
    }
}
