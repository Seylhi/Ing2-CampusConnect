package esiag.back.services.capteur;

import esiag.back.models.capteur.Capteur;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CapteurScoreService {

    private final CapteurService capteurService;

    public CapteurScoreService(CapteurService capteurService) {
        this.capteurService = capteurService;
    }

    // Calcul le score pour une salle donnée 

    public CapteurScoreResult calculateScore(Long idSalle) {
        List<Capteur> capteurs = capteurService.findBySalle(idSalle);

        if (capteurs.isEmpty()) {
            return new CapteurScoreResult(0.0, "Mauvaise", Map.of());
        }

        double totalScore = 0.0;
        Map<String, Double> totalDetails = new HashMap<>();
        totalDetails.put("temperature", 0.0);
        totalDetails.put("humidite", 0.0);
        totalDetails.put("chauffage", 0.0);

        for (Capteur c : capteurs) {
            // Score simplifié avec fonction réutilisable
            double scoreTemp = calculateScore(c.getTemperature(), 21, 10);
            double scoreHum  = calculateScore(c.getHumidite(), 45, 50);
            double scoreChauffage = c.getChauffageOn() ? 1.0 : 0.7;

            double capteurScore = scoreTemp * 0.5 + scoreHum * 0.3 + scoreChauffage * 0.2;
            capteurScore = clamp(capteurScore, 0, 1);

            totalScore += capteurScore;

            totalDetails.put("temperature", totalDetails.get("temperature") + scoreTemp);
            totalDetails.put("humidite", totalDetails.get("humidite") + scoreHum);
            totalDetails.put("chauffage", totalDetails.get("chauffage") + scoreChauffage);
        }

        int n = capteurs.size();
        totalDetails.put("temperature", totalDetails.get("temperature") / n);
        totalDetails.put("humidite", totalDetails.get("humidite") / n);
        totalDetails.put("chauffage", totalDetails.get("chauffage") / n);

        double averageScore = totalScore / n;

        String status = getStatusFromScore(averageScore);

        return new CapteurScoreResult(averageScore, status, totalDetails);
    }

    // Calcule le score entre 0 et 1 pour une valeur donnée 
    private double calculateScore(double value, double ideal, double tolerance) {
        double score = 1 - Math.abs(value - ideal) / tolerance;
        return clamp(score, 0, 1);
    }

    // Renvoie le status à partir d’un score
    private String getStatusFromScore(double score) {
        if (score >= 0.85) return "Très bonne";
        else if (score >= 0.7) return "Bonne";
        else if (score >= 0.5) return "Moyenne";
        else return "Mauvaise";
    }

    // Clamp une valeur entre min et max pour garder notre intervall de valeur et eviter les données incoherente 
    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(value, max));
    }
}
