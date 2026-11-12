package com.gpc.skilltree.dto;

import java.util.List;

public record TrilhaResponse(Long id, String nome, String descricao, List<ModuloResponse> modulos) {
    public record ModuloResponse(Long id, String titulo, String descricao, String estado, List<NoResponse> nos) {}
    public record NoResponse(Long id, String titulo, String conteudo, String estado,
                             List<Long> preRequisitos, List<QuestaoResponse> questoes) {}
    public record QuestaoResponse(Long id, String enunciado, String dificuldade) {}
}
