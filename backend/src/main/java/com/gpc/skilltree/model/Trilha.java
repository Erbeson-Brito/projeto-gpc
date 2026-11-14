package com.gpc.skilltree.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trilhas")
public class Trilha {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String nome;
    @Column(columnDefinition = "text")
    private String descricao;
    private Boolean ativo;
    @Column(name = "criado_em")
    private LocalDateTime criadoEm;
    protected Trilha() {}
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public Boolean getAtivo() { return ativo; }
}
