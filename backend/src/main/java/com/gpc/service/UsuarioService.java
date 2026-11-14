package com.gpc.service;

import com.gpc.dto.AtualizarUsuarioRequest;
import com.gpc.dto.CadastroUsuarioRequest;
import com.gpc.dto.UsuarioResponse;
import com.gpc.model.Usuario;
import com.gpc.repository.UsuarioRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.gpc.model.Papel;
import com.gpc.repository.PapelRepository;
import java.util.Set;
import com.gpc.model.Aluno;
import com.gpc.repository.AlunoRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PapelRepository papelRepository;
    private final PasswordEncoder passwordEncoder;
    private final AlunoRepository alunoRepository;

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        PapelRepository papelRepository,
        AlunoRepository alunoRepository,
        PasswordEncoder passwordEncoder) {

    this.usuarioRepository = usuarioRepository;
    this.papelRepository = papelRepository;
    this.alunoRepository = alunoRepository;
    this.passwordEncoder = passwordEncoder;
}
    
    public UsuarioResponse cadastrar(
            CadastroUsuarioRequest dados) {

        if (dados.getNome() == null
                || dados.getNome().isBlank()) {

            throw new IllegalArgumentException(
                    "O nome é obrigatório."
            );
        }

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

        if (usuarioRepository
                .existsByEmailIgnoreCase(dados.getEmail())) {

            throw new IllegalArgumentException(
                    "O email já está cadastrado."
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNome(dados.getNome());
        usuario.setEmail(dados.getEmail());

        usuario.setSenhaHash(
                passwordEncoder.encode(dados.getSenha())
        );

        usuario.setStatusConta("ATIVA");
        
        Papel papelAluno = papelRepository
        .findByNome("ALUNO")
        .orElseThrow(() ->
                new IllegalStateException(
                        "Papel ALUNO não encontrado."
                )
        );

        usuario.getPapeis().add(papelAluno);
        

        Usuario salvo =
                usuarioRepository.save(usuario);
        
        Aluno aluno = new Aluno();
        aluno.setUsuario(salvo);

        alunoRepository.save(aluno);

        return converterParaResponse(salvo);
    }

    public List<UsuarioResponse> listar() {

        return usuarioRepository
                .findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public UsuarioResponse buscarPorId(Long id) {

        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Usuário não encontrado."
                        )
                );

        return converterParaResponse(usuario);
    }

    private UsuarioResponse converterParaResponse(
        Usuario usuario) 
    {

    Set<String> papeis = usuario
            .getPapeis()
            .stream()
            .map(Papel::getNome)
            .collect(java.util.stream.Collectors.toSet());

    return new UsuarioResponse(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getStatusConta(),
            usuario.getDataCriacao(),
            papeis
        );
    }
    
    public UsuarioResponse atualizar(Long id, AtualizarUsuarioRequest dados) 
    {
            
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        if (dados.getNome() != null && !dados.getNome().isBlank()) 
        {
      usuario.setNome(dados.getNome());
        }

    if (dados.getEmail() != null
            && !dados.getEmail().isBlank()) {

        if (!usuario.getEmail()
                .equalsIgnoreCase(dados.getEmail())
                && usuarioRepository
                        .existsByEmailIgnoreCase(
                                dados.getEmail())) {

            throw new IllegalArgumentException(
                    "O email já está cadastrado."
            );
        }

        usuario.setEmail(dados.getEmail());
    }

    return converterParaResponse(
            usuarioRepository.save(usuario)
    );
}

    public void excluir(Long id) {

    Usuario usuario = usuarioRepository
            .findById(id)
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "Usuário não encontrado."
                    )
            );

    usuarioRepository.delete(usuario);
}
    
}