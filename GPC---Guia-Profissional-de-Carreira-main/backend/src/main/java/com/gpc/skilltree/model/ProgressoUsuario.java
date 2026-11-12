package com.gpc.skilltree.model;

import com.gpc.model.Usuario;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progresso_usuario", uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "no_id"}))
public class ProgressoUsuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "no_id", nullable = false)
    private No no;
    @Column(nullable = false)
    private boolean concluido;
    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;
    protected ProgressoUsuario() {}
    public ProgressoUsuario(Usuario usuario, No no) {
        this.usuario = usuario;
        this.no = no;
        this.concluido = true;
        this.dataConclusao = LocalDateTime.now();
    }
    public No getNo() { return no; }
    public boolean isConcluido() { return concluido; }
    public void concluir() {
        this.concluido = true;
        this.dataConclusao = LocalDateTime.now();
    }
}
