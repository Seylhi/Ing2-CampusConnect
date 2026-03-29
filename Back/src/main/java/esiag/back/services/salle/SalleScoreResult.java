// Cette classe permet de stocker le score, également les détails ainsi 
// que la date de calcul pour les ressortir dans l'alert

package esiag.back.services.salle;

import java.time.LocalDateTime;
import java.util.Map;

public class SalleScoreResult {

    private double scoreEnergie; // renomage de la valeur pour ne pas être perdu par la suite
    private double scoreConfort; // ajout d'un nouveau score de confort

    // on adapte donc le code avec notre nouvelle valeur ! (score confort)
    private Map<String, Double> detailsEnergie;
    private Map<String, Double> detailsConfort;
    private LocalDateTime calculationTime;
    // ces deux paramètres vont nous permettre d'appeler directement les données
    // provenant du stream de la table capteur via result dans Service
    private double temperature;
    private double humidite;
    // ces deux paramètres vont nous permettre d'appeler directement les données
    // provenant du mock de la table salle_mock_journalier via result dans Service
    private double coefMeteo;
    private double coefVacances;
    // afin d'utiliser le score de CO2 dans mon score global
    private int scoreCo2;

    public SalleScoreResult(double scoreEnergie, double scoreConfort,
            Map<String, Double> detailsEnergie, Map<String, Double> detailsConfort, double temperature,
            double humidite, double coefMeteo, double coefVacances, int scoreCo2) {

        this.scoreEnergie = scoreEnergie;
        this.scoreConfort = scoreConfort;
        this.detailsEnergie = detailsEnergie;
        this.detailsConfort = detailsConfort;
        this.calculationTime = LocalDateTime.now();
        this.temperature = temperature;
        this.humidite = humidite;
        this.coefMeteo = coefMeteo;
        this.coefVacances = coefVacances;
        this.scoreCo2 = scoreCo2;
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

    public double getTemperature() {
        return temperature;
    }

    public double getHumidite() {
        return humidite;
    }

     public double getCoefMeteo() {
        return coefMeteo;
    }

    public double getCoefVacances() {
        return coefVacances;
    }

    public int getScoreCO2() {
        return scoreCo2;
    }

}

// Pas besoin de setters car on ne veut pas réutiliser les scores, simplement
// les afficher et les renvoyer