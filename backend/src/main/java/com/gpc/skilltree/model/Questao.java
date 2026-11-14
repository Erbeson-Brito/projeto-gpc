package com.gpc.skilltree.model;

import jakarta.persistence.*;

@Entity
@Table(name = "questoes")
public class Questao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "no_id", nullable = false)
    private No no;
    @Column(nullable = false, columnDefinition = "text")
    private String enunciado;
    @Column(length = 255)
    private String gabarito;
    @Column(length = 20)
    private String dificuldade;
    protected Questao() {}
    public Long getId() { return id; }
    public String getEnunciado() { return enunciado; }
    public String getGabarito() { return gabarito; }
    public String getDificuldade() { return dificuldade; }
}
