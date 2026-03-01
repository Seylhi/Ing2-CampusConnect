// Cette classe permet de stocker le score, également les détails ainsi 
// que la date de calcul pour les ressortir dans l'alert

package esiag.back.services.salle;

import java.time.LocalDateTime;
import java.util.Map;

public class SalleScoreResult {

    private double scoreEnergie; // renomage de la valeur pour ne pas être perdu par la suite
    private double scoreConfort; // ajout d'un nouveau score de confort

    // on adapte donc le code avec notre nouvelle valeur !
    private Map<String, Double> detailsEnergie;
    private Map<String, Double> detailsConfort;
    private LocalDateTime calculationTime;

    public SalleScoreResult(double scoreEnergie, double scoreConfort,
            Map<String, Double> detailsEnergie,
            Map<String, Double> detailsConfort) {

        this.scoreEnergie = scoreEnergie;
        this.scoreConfort = scoreConfort;
        this.detailsEnergie = detailsEnergie;
        this.detailsConfort = detailsConfort;
        this.calculationTime = LocalDateTime.now();
    }

    public double getScoreEnergie() {
        return scoreEnergie;
    }

    public double getScoreConfort() {
        return scoreConfort;
    }

    public Map<String, Double> getDetailsEnergie() {
        return detailsEnergie;
    }

    public Map<String, Double> getDetailsConfort() {
        return detailsConfort;
    }

    public LocalDateTime getCalculationTime() {
        return calculationTime;
    }
}

// Pas besoin de setters car on ne veut pas réutiliser les scores, simplement
// les afficher et les renvoyer