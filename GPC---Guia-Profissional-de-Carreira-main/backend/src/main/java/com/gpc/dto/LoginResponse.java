package com.gpc.dto;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private Long id;
    private String nome;
    private String email;
    private String statusConta;
    private Set<String> papeis;
}