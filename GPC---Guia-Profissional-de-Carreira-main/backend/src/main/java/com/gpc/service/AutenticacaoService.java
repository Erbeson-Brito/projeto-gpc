package com.gpc.service;

import com.gpc.dto.LoginRequest;
import com.gpc.dto.LoginResponse;
import com.gpc.model.Papel;
import com.gpc.model.Usuario;
import com.gpc.repository.UsuarioRepository;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AutenticacaoService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest dados) {

        if (dados.getEmail() == null
                || dados.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "O email é obrigatório."
            );
        }

        if (dados.getSenha() == null
                || dados.getSenha().isBlank()) {

            throw new IllegalArgumentException(
                    "A senha é obrigatória."
            );
        }

        Usuario usuario = usuarioRepository
                .findByEmailIgnoreCase(dados.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Email ou senha inválidos."
                        )
                );

        if (!passwordEncoder.matches(
                dados.getSenha(),
                usuario.getSenhaHash())) {

            throw new IllegalArgumentException(
                    "Email ou senha inválidos."
            );
        }

        if (!"ATIVA".equalsIgnoreCase(
                usuario.getStatusConta())) {

            throw new IllegalStateException(
                    "Conta não está ativa."
            );
        }

        Set<String> papeis = usuario.getPapeis()
                .stream()
                .map(Papel::getNome)
                .collect(Collectors.toSet());

        return new LoginResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getStatusConta(),
                papeis
        );
    }
}