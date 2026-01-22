package esiag.back.models.alerte;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "alerte")
public class Alerte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_capteur", nullable = false)
    private Long idCapteur; // lien vers le capteur

    private String type;    // TEMPERATURE, HUMIDITE, PRESENCE
    private String message; // message dynamique selon la règle
    private Boolean active; // true = alerte active, false = résolue

    @Column(name = "date_alerte")
    private LocalDateTime dateAlerte;
}
