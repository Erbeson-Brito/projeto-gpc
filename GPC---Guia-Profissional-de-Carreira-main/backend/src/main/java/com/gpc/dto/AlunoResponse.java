package com.gpc.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AlunoResponse {

    private Long id;
    private Long usuarioId;
    private String nome;
    private String email;
    private String objetivoProfissional;
    private String nivelExperiencia;
}