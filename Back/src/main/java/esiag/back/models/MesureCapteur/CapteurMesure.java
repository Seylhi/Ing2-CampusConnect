package esiag.back.models.MesureCapteur;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mesure_capteur")
public class CapteurMesure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "capteur_id")
    private Long capteurId;
    @Enumerated(EnumType.STRING)
    private TypeMesure type;
    private Double valeur;
    @Column(name = "date_mesure")
    private LocalDateTime dateMesure;

    public enum TypeMesure {
        TEMPERATURE, HUMIDITE, PRESENCE
    }
}