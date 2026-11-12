package com.gpc.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VerificacaoResponse {

    private Long id;
    private Long usuarioId;
    private String tipoPerfil;
    private String status;
    private LocalDateTime dataSolicitacao;
    private LocalDateTime dataAnalise;
}