package com.gpc.controller;

import com.gpc.dto.AtualizarUsuarioRequest;
import com.gpc.dto.CadastroUsuarioRequest;
import com.gpc.dto.UsuarioResponse;
import com.gpc.service.UsuarioService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(
            UsuarioService usuarioService) {

        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> cadastrar(
            @RequestBody CadastroUsuarioRequest dados) {

        UsuarioResponse usuario =
                usuarioService.cadastrar(dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(usuario);
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscarPorId(
            @PathVariable Long id) {

        return usuarioService.buscarPorId(id);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> tratarErroValidacao(
            IllegalArgumentException erro) {

        return ResponseEntity
                .badRequest()
                .body(erro.getMessage());
    }
    
    @PutMapping("/{id}")
    public UsuarioResponse atualizar(
        @PathVariable Long id,
        @RequestBody AtualizarUsuarioRequest dados) {

    return usuarioService.atualizar(id, dados);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
        @PathVariable Long id) {

    usuarioService.excluir(id);

    return ResponseEntity.noContent().build();
    }
    
}
