package com.gpc.skilltree.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "nos")
public class No {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "modulo_id", nullable = false)
    private Modulo modulo;
    @Column(nullable = false, length = 150)
    private String titulo;
    @Column(columnDefinition = "text")
    private String conteudo;
    @Column(nullable = false)
    private int ordem;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "pre_requisitos", joinColumns = @JoinColumn(name = "no_id"),
        inverseJoinColumns = @JoinColumn(name = "no_requisito_id"))
    private Set<No> preRequisitos = new HashSet<>();
    protected No() {}
    public Long getId() { return id; }
    public Modulo getModulo() { return modulo; }
    public String getTitulo() { return titulo; }
    public String getConteudo() { return conteudo; }
    public int getOrdem() { return ordem; }
    public Set<No> getPreRequisitos() { return preRequisitos; }
}
