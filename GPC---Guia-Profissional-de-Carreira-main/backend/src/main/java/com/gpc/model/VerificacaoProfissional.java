package com.gpc.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "verificacoes_profissionais")
public class VerificacaoProfissional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "usuario_id",
            nullable = false
    )
    private Usuario usuario;

    @Column(name = "tipo_perfil", nullable = false)
    private String tipoPerfil;

    private String status;

    @Column(name = "data_solicitacao")
    private LocalDateTime dataSolicitacao;

    @Column(name = "data_analise")
    private LocalDateTime dataAnalise;

    @ManyToOne
    @JoinColumn(name = "analisado_por")
    private Usuario analisadoPor;

    @PrePersist
    public void antesDeSalvar() {

        if (status == null) {
            status = "PENDENTE";
        }

        if (dataSolicitacao == null) {
            dataSolicitacao = LocalDateTime.now();
        }
    }
}