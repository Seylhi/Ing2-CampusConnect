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

}
