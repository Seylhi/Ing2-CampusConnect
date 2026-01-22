package esiag.back.models.offre;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "offres")
public class Offre {

    @Id
    private Integer id;

    @Column(name = "type_offre")
    private String typeOffre;

    @Column(name = "filiere_cible")
    private String filiereCible;

    @Column(name = "niveau_requis")
    private String niveauRequis;

    @Column(name = "département")
    private String departement;

    private String ville;
    private String entreprise;
    private String titre;

    @Column(name = "durée")
    private String duree;

    @Column(name = "competences_requises")
    private String competencesRequises;

    private BigDecimal latitude;
    private BigDecimal longitude;

    private String description;
}
