package esiag.back.models.salle;

import lombok.Data;
import javax.persistence.*;

@Entity
@Data
@Table(name = "salle")
public class Salle {

    @Id
    @Column(name = "id_salle")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSalle;

    @Column(name = "nom_salle")
    private String nomSalle;

    @Column(name = "capacite")
    private int capacite;

    @Column(name = "est_salle_tp")
    private boolean estSalleTp;

    @Column(name = "surface_m2")
    private double surfaceM2;

    @Column(name = "nb_fenetres")
    private int nbFenetres;

    @Column(name = "orientation")
    private String orientation;

    @Column(name = "chauffage")
    private boolean chauffage;

    // On ajoute ces deux éléments car on en aura besoin pour calculer le score de
    // confort
    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "humidite")
    private Double humidite;

    // j'ai ajouté ça juste pour l'affichage d'occupation dans la map
    @Column(name = "is_occupee")
    private boolean occupee;

    // Et j'ai ajouté ça pour afficher les scores mais ne pas les stocker en base
    // juste pour la map
    @Transient
    private Double scoreConfort;

    @Transient
    private Double scoreEnergetique;

}
