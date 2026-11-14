package com.gpc.controller;

import com.gpc.dto.LoginRequest;
import com.gpc.dto.LoginResponse;
import com.gpc.service.AutenticacaoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    public AutenticacaoController(
            AutenticacaoService autenticacaoService) {

        this.autenticacaoService = autenticacaoService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest dados) {

        return autenticacaoService.login(dados);
    }
}