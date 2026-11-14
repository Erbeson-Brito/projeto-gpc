package com.gpc.skilltree.dto;

import java.util.List;

public record RespostasRequest(List<Resposta> respostas) {
    public record Resposta(Long questaoId, String texto) {}
}
