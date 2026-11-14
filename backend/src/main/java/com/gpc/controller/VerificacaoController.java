package com.gpc.controller;

import com.gpc.dto.SolicitarPerfilRequest;
import com.gpc.dto.VerificacaoResponse;
import com.gpc.service.VerificacaoService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verificacoes")
public class VerificacaoController {

    private final VerificacaoService verificacaoService;

    public VerificacaoController(
            VerificacaoService verificacaoService) {

        this.verificacaoService = verificacaoService;
    }

    @PostMapping("/usuario/{usuarioId}")
    public VerificacaoResponse solicitar(
            @PathVariable Long usuarioId,
            @RequestBody SolicitarPerfilRequest dados) {

        return verificacaoService
                .solicitar(usuarioId, dados);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<VerificacaoResponse> listarUsuario(
            @PathVariable Long usuarioId) {

        return verificacaoService
                .listarDoUsuario(usuarioId);
    }

    @GetMapping("/pendentes")
    public List<VerificacaoResponse> pendentes() {

        return verificacaoService.listarPendentes();
    }

    @PutMapping("/{id}/aprovar")
    public VerificacaoResponse aprovar(
            @PathVariable Long id,
            @RequestParam Long adminId) {

        return verificacaoService
                .aprovar(id, adminId);
    }

    @PutMapping("/{id}/rejeitar")
    public VerificacaoResponse rejeitar(
            @PathVariable Long id,
            @RequestParam Long adminId) {

        return verificacaoService
                .rejeitar(id, adminId);
    }
}