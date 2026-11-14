package com.gpc.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarUsuarioRequest {

    private String nome;
    private String email;
}