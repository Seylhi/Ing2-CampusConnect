package esiag.back.models.capteur;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "capteur")
public class Capteur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_salle", nullable = false)
    private Long idSalle;

    private Double temperature;
    private Double humidite;
    private Boolean presence;

    @Column(name = "date_mesure")
    private LocalDateTime dateMesure;

    @Column(name = "fenetre_ouverte")
    private Boolean fenetreOuverte;

    @Column(name = "porte_ouverte")
    private Boolean porteOuverte;

    @Column(name = "chauffage_on")
    private Boolean chauffageOn;
}
