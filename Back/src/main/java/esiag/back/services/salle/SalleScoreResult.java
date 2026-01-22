// Cette classe permet de stocker le score, également les détails ainsi 
// que la date de calcul pour les ressortir dans l'alert

package esiag.back.services.salle;

import java.time.LocalDateTime;
import java.util.Map;

public class SalleScoreResult {

    private double score;
    private Map<String, Double> details;
    private LocalDateTime calculationTime;

    public SalleScoreResult(double score, Map<String, Double> details) {
        this.score = score;
        this.details = details;
        this.calculationTime = LocalDateTime.now();
    }

    public double getScore() {
        return score;
    }

    public Map<String, Double> getDetails() {
        return details;
    }

    public LocalDateTime getCalculationTime() {
        return calculationTime;
    }
}

// Pas besoin de setters car on ne veut pas réutiliser les scores, simplement
// les afficher et les renvoyer