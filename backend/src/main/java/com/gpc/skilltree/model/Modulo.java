package com.gpc.skilltree.model;

import jakarta.persistence.*;

@Entity
@Table(name = "modulos")
public class Modulo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trilha_id", nullable = false)
    private Trilha trilha;
    @Column(nullable = false, length = 150)
    private String titulo;
    @Column(nullable = false)
    private int ordem;
    @Column(columnDefinition = "text")
    private String descricao;
    protected Modulo() {}
    public Long getId() { return id; }
    public Trilha getTrilha() { return trilha; }
    public String getTitulo() { return titulo; }
    public int getOrdem() { return ordem; }
    public String getDescricao() { return descricao; }
}
