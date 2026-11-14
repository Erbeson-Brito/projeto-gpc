package com.gpc.skilltree.controller;

import com.gpc.skilltree.dto.RespostasRequest;
import com.gpc.skilltree.dto.ResultadoAtividade;
import com.gpc.skilltree.dto.TrilhaResponse;
import com.gpc.skilltree.service.TrilhaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trilhas")
public class TrilhaController {
    private final TrilhaService service;
    public TrilhaController(TrilhaService service) { this.service = service; }

    @GetMapping("/{trilhaId}")
    public TrilhaResponse consultar(@PathVariable Long trilhaId, @RequestParam Long usuarioId) {
        return service.consultar(trilhaId, usuarioId);
    }

    @PostMapping("/{trilhaId}/nos/{noId}/respostas")
    public ResultadoAtividade responder(@PathVariable Long trilhaId, @PathVariable Long noId,
                                       @RequestParam Long usuarioId, @RequestBody RespostasRequest respostas) {
        return service.responder(trilhaId, noId, usuarioId, respostas);
    }
}
