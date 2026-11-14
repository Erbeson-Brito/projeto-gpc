package com.gpc.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Column(name = "status_conta", nullable = false)
    private String statusConta;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @PrePersist
    public void antesDeSalvar() {

        if (statusConta == null) {
            statusConta = "ATIVA";
        }

        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }
    }
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "usuario_papeis",
        joinColumns =
                @JoinColumn(name = "usuario_id"),
        inverseJoinColumns =
                @JoinColumn(name = "papel_id")
              )
              private Set<Papel> papeis = new HashSet<>();
    
}