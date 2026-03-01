// On se base sur le principe de l'ancien ScoreEnergetique, pour des infos précises, 
// n'hésitez pas à consulter la doc dans le Teams de notre projet.

package esiag.back.services.salle;

import esiag.back.models.salle.Salle;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SalleScoreService {

    private final SalleService salleService;

    public SalleScoreService(SalleService salleService) {
        this.salleService = salleService;
    }

    public SalleScoreResult calculateScore(Long idSalle) {
        Salle salle = salleService.findByIdSalle(idSalle);
        if (salle == null)
            // il faut adopter à deux éléments désormais
            return new SalleScoreResult(0.0, 0.0, Map.of(), Map.of());

        // SCORE ENERGIE
        // Récupération de toutes les salles pour min/max (utile pour avoir une vue
        // d'ensemble et surtout pour la suite des calculs)
        List<Salle> all = salleService.findAllSalles();
        double minSurface = all.stream().mapToDouble(Salle::getSurfaceM2).min().orElse(0);
        double maxSurface = all.stream().mapToDouble(Salle::getSurfaceM2).max().orElse(1);
        int minFen = all.stream().mapToInt(Salle::getNbFenetres).min().orElse(0);
        int maxFen = all.stream().mapToInt(Salle::getNbFenetres).max().orElse(1);

        // Normalisation des données
        double surfaceNorm = (maxSurface - minSurface != 0)
                ? (salle.getSurfaceM2() - minSurface) / (maxSurface - minSurface)
                : 0;
        double fenNorm = (maxFen - minFen != 0)
                ? (double) (salle.getNbFenetres() - minFen) / (maxFen - minFen)
                : 0;
        double chauffageVal = salle.isChauffage() ? 1.0 : 0.0;
        double orientCoef = switch (salle.getOrientation()) { // En effet l'orientation a un effet sur
            // la réception des rayons du soleil et donc par la même occasion de chaleur
            // donc le chauffage
            // y sera moins important
            case "SUD" -> 1.0;
            case "EST", "OUEST" -> 0.6;
            default -> 0.2;
        };

        // Calcul avec les coefficients (ils sont choisis en fonction de l'importance du
        // caractère)
        double contribSurface = (1 - surfaceNorm) * 0.40;
        double contribFen = fenNorm * 0.30;
        double contribOrient = orientCoef * 0.20;
        double contribChauffage = (1 - chauffageVal) * 0.10;

        double score = 100 * (contribSurface + contribFen + contribOrient + contribChauffage);

        // Détails de calcul à afficher sur le front

        // Valeurs bruts
        Map<String, Double> details = new HashMap<>();
        details.put("surface", salle.getSurfaceM2());
        details.put("fenetres", (double) salle.getNbFenetres());
        details.put("orientationCoef", orientCoef);
        details.put("chauffage", chauffageVal);

        // Valeurs min/max
        details.put("minSurface", minSurface);
        details.put("maxSurface", maxSurface);
        details.put("minFenetres", (double) minFen);
        details.put("maxFenetres", (double) maxFen);

        // Valeurs normalisées
        details.put("surfaceNorm", surfaceNorm);
        details.put("fenetresNorm", fenNorm);

        // Valeurs finales après coefficients (prêtes à être sommées)
        details.put("contribSurface", contribSurface);
        details.put("contribFen", contribFen);
        details.put("contribOrient", contribOrient);
        details.put("contribChauffage", contribChauffage);

        // SCORE CONFORT
        Map<String, Double> detailsConfort = new HashMap<>();
        double scoreConfort = calculateScoreConfort(salle, detailsConfort);

        return new SalleScoreResult(
                score,
                scoreConfort,
                details,
                detailsConfort);
    }

    // On calcule le score de confort avec une méthode de calcul primaire car moins
    // impactant sur la suite de notre Work Item et surtout pour un problème de
    // temps
    private double calculateScoreConfort(Salle salle, Map<String, Double> details) {

        double score;

        // Calcul du score de température (30/100)
        double temp = salle.getTemperature() != null ? salle.getTemperature() : 20;
        double scoreTemp;

        // on retrouve ici les différents critères d'attributions des points
        if (temp >= 20 && temp <= 23)
            scoreTemp = 30;
        else if ((temp >= 18 && temp < 20) || (temp > 23 && temp <= 25))
            scoreTemp = 20;
        else if ((temp >= 16 && temp < 18) || (temp > 25 && temp <= 27))
            scoreTemp = 10;
        else
            scoreTemp = 0;

        details.put("scoreTemperature", scoreTemp);

        // Calcul du score d'humidité (20/100)
        double hum = salle.getHumidite() != null ? salle.getHumidite() : 45;
        double scoreHum;

        // on retrouve ici les différents critères d'attributions des points
        // l'humidité est exprimé en pourcentage
        if (hum >= 40 && hum <= 60)
            scoreHum = 20;
        else if ((hum >= 30 && hum < 40) || (hum > 60 && hum <= 70))
            scoreHum = 12;
        else if ((hum >= 20 && hum < 30) || (hum > 70 && hum <= 80))
            scoreHum = 5;
        else
            scoreHum = 0;

        details.put("scoreHumidite", scoreHum);

        // Calcul du score de densité (20/100)
        double densite = salle.getCapacite() / salle.getSurfaceM2();
        double scoreDensite;

        if (densite <= 0.5)
            scoreDensite = 20;
        else if (densite <= 0.8)
            scoreDensite = 15;
        else if (densite <= 1.2)
            scoreDensite = 8;
        else
            scoreDensite = 0;

        details.put("scoreDensite", scoreDensite);

        // Calcul du score de luminosité (15/100)
        double scoreLum = salle.getNbFenetres() * 2;

        double orientBonus = switch (salle.getOrientation()) {
            case "SUD" -> 5;
            case "EST", "OUEST" -> 3;
            default -> 1;
        };

        scoreLum = scoreLum + orientBonus;
        if (scoreLum > 15) {
            scoreLum = 15;
        }

        details.put("scoreLuminosite", scoreLum);

        // Calcul du score de type de salle (15/100)
        double scoreType = salle.isEstSalleTp() ? 15 : 10;
        details.put("scoreTypeSalle", scoreType);

        // Somme de tous les sous-scores
        score = scoreTemp + scoreHum + scoreDensite + scoreLum + scoreType;
        return score;
    }
}