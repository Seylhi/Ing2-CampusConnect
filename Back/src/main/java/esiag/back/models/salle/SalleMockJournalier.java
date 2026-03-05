package esiag.back.models.salle;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDate;

// Nouvelle table fixe, qui permet de mettre en place un mock spécifique au salle 
// avec différents éléments afin de préciser divers calculs et gérer des cas particuliers
// (demandés pour répondre à un besoin plus réfléchi pour M. Brenner)

@Entity
@Data
@Table(name = "salle_mock_journalier")

public class SalleMockJournalier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_salle")
    private Long idSalle;

    // Date à partir du 1 mars 2026 pour avoir une table plus légère
    @Column(name = "date_jour")
    private LocalDate dateJour;

    // Uniquement basée sur Soleil, Nuage et Pluie
    @Column(name = "meteo")
    private String meteo;

    // Pour faire simple, plus il fait beau et plus le coef est élevé, et vice-versa
    @Column(name = "coefficient_meteo")
    private double coefficientMeteo;

    @Column(name = "temperature_exterieure")
    private double temperatureExterieure;

    // Si vacances, on calcule, sinon on ne calcule pas. Vacances = décembre &
    // juillet, août
    @Column(name = "est_vacances")
    private boolean estVacances;

    @Column(name = "coefficient_vacances")
    private double coefficientVacances;
}
