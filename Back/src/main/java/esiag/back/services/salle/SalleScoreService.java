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
            return new SalleScoreResult(0.0, Map.of());

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

        // Calcul avec les coefficients (ils sont choisi en fonction de l'importance du
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

        return new SalleScoreResult(score, details); // On retourne le score final
    }
}