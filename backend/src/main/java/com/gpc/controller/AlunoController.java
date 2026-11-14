package com.gpc.controller;

import com.gpc.dto.AlunoResponse;
import com.gpc.dto.AtualizarPerfilAlunoRequest;
import com.gpc.service.AlunoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public AlunoResponse buscar(
            @PathVariable Long usuarioId) {

        return alunoService.buscarPorUsuario(usuarioId);
    }

    @PutMapping("/usuario/{usuarioId}")
    public AlunoResponse atualizar(
            @PathVariable Long usuarioId,
            @RequestBody AtualizarPerfilAlunoRequest dados) {

        return alunoService.atualizar(usuarioId, dados);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> tratarErro(
            IllegalArgumentException erro) {

        return ResponseEntity
                .badRequest()
                .body(erro.getMessage());
    }
}