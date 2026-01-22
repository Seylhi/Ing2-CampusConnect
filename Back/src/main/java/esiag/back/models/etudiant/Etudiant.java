package esiag.back.models.etudiant;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "etudiant")
public class Etudiant {

    @Id
    private Integer id;

    private String nom;
    private String filiere;
    private String niveau;

    @Column(name = "offre_recherchée")
    private String offreRecherchee;

    @Column(name = "durée")
    private String duree;

    private String sexe;
    private String competences;

    @Column(name = "département")
    private String departement;

    private String ville;

    private BigDecimal latitude;
    private BigDecimal longitude;
}
