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

    public CapteurScoreResult calculateScore(Long idSalle) {
        List<Capteur> capteurs = capteurService.findBySalle(idSalle);
        if (capteurs == null || capteurs.isEmpty()) return new CapteurScoreResult(0.0, "Mauvaise", Map.of());

        Double temperature = null;
        Double humidite = null;
        Boolean chauffage = null;

        for (Capteur c : capteurs) {
            if (c.getTemperature() != null) {
                temperature = c.getTemperature();
                chauffage = c.getChauffageOn();
            }
            if (c.getHumidite() != null) humidite = c.getHumidite();
        }

        double scoreTemp = temperature != null ? calculCritere(temperature, 21, 10) : 1.0;
        double scoreHum = humidite != null ? calculCritere(humidite, 45, 50) : 1.0;
        double scoreChauffage = chauffage != null ? (chauffage ? 1.0 : 0.7) : 1.0;

        double scoreFinal = clamp(scoreTemp * 0.5 + scoreHum * 0.3 + scoreChauffage * 0.2, 0, 1);

        Map<String, Double> details = new HashMap<>();
        details.put("temperature", scoreTemp);
        details.put("humidite", scoreHum);
        details.put("chauffage", scoreChauffage);

        return new CapteurScoreResult(scoreFinal, getStatus(scoreFinal), details);
    }

    private double calculCritere(double value, double ideal, double tolerance) {
        return clamp(1 - Math.abs(value - ideal) / tolerance, 0, 1);
    }

    private String getStatus(double score) {
        if (score >= 0.85) return "Très bonne";
        if (score >= 0.7) return "Bonne";
        if (score >= 0.5) return "Moyenne";
        return "Mauvaise";
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(value, max));
    }
}