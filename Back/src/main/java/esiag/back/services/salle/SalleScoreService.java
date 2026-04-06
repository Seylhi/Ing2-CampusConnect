// On se base sur le principe de l'ancien ScoreEnergetique, pour des infos précises, 
// n'hésitez pas à consulter la doc dans le Teams de notre projet.

package esiag.back.services.salle;

// on va utiliser des éléments de CapteurRepository & de JobDating donc on 
// ramène les datas nécessaires & CO2, on ramène également celle de 
// SalleMockJournalier car désormais utilisable
import esiag.back.services.jobdating.JobDatingRoomService;
import esiag.back.models.capteur.Capteur;
import esiag.back.repositories.capteur.CapteurRepository;
import esiag.back.repositories.salle.SalleMockJournalierRepository;
import esiag.back.models.salle.Salle;
import esiag.back.models.salle.SalleMockJournalier;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate; // utile pour notre mock journalier
import java.util.ArrayList;

@Service
public class SalleScoreService {

    // initialisation de CapteurRepository et de SalleMockJournalier sur l'exemple
    // de SalleService
    private final SalleService salleService;
    private final CapteurRepository capteurRepository;
    private final SalleMockJournalierRepository mockRepository;
    private final JobDatingRoomService jobDatingRoomService;

    public SalleScoreService(SalleService salleService, CapteurRepository capteurRepository,
            SalleMockJournalierRepository mockRepository, JobDatingRoomService jobDatingRoomService) {
        this.salleService = salleService;
        this.capteurRepository = capteurRepository;
        this.mockRepository = mockRepository;
        this.jobDatingRoomService = jobDatingRoomService;
    }

    public SalleScoreResult calculateScore(Long idSalle) {
        log("");
        log("DONNEES DE LA SALLE");
        log("Salle ID : " + idSalle);
        Salle salle = salleService.findByIdSalle(idSalle);
        LocalDate localDate = LocalDate.now();
        if (salle == null)
            // il faut adopter à 6 éléments désormais
            return new SalleScoreResult(0.0, 0.0, Map.of(), Map.of(), 0.0, 0.0, 0.0, 0.0, 0);
        log("Salle trouvée : " + salle.getNomSalle());
        log("Capacité salle : " + salle.getCapacite());
        log("Surface salle : " + salle.getSurfaceM2());
        log("Nb fenêtres : " + salle.getNbFenetres());
        Capteur capteurTemp = capteurRepository
                .findTopByIdSalleAndTypeOrderByDateMesureDesc(idSalle, "TEMPERATURE");

        Capteur capteurHum = capteurRepository
                .findTopByIdSalleAndTypeOrderByDateMesureDesc(idSalle, "HUMIDITE");

        SalleMockJournalier mockJournalier = mockRepository
                .findByIdSalleAndDateJour(salle.getIdSalle(), localDate);

        // C'est ici que l'on déclare nos variables provenant de capteurs afin de
        // garder la même forme mais avec des données liées à celle de Capteur
        if (capteurTemp != null) {
            salle.setTemperature(capteurTemp.getTemperature());
            log("Température capteur : " + capteurTemp.getTemperature());
        }

        if (capteurHum != null) {
            salle.setHumidite(capteurHum.getHumidite());
            log("Humidité capteur : " + capteurHum.getHumidite());
        }

        // SCORE ENERGIE
        // Récupération de toutes les salles pour min/max (utile pour avoir une vue
        // d'ensemble et surtout pour la suite des calculs)
        List<Salle> all = salleService.findAllSalles();
        double minSurface = all.stream().mapToDouble(Salle::getSurfaceM2).min().orElse(0);
        double maxSurface = all.stream().mapToDouble(Salle::getSurfaceM2).max().orElse(1);
        int minFen = all.stream().mapToInt(Salle::getNbFenetres).min().orElse(0);
        int maxFen = all.stream().mapToInt(Salle::getNbFenetres).max().orElse(1);

        // Données provenant de notre mock pour venir préciser notre calcul de score
        // énergétique, on fait exprès de ne pas gérer le null car table jamais vide,
        // même si il est vrai qu'il serait plus propre de le faire
        double coefMeteo = mockJournalier.getCoefficientMeteo();
        double coefVacances = mockJournalier.getCoefficientVacances();
        double temperatureExt = mockJournalier.getTemperatureExterieure();

        // Normalisation des données
        double surfaceNorm = (maxSurface - minSurface != 0)
                ? (salle.getSurfaceM2() - minSurface) / (maxSurface - minSurface)
                : 0;
        double fenNorm = (maxFen - minFen != 0)
                ? (double) (salle.getNbFenetres() - minFen) / (maxFen - minFen)
                : 0;
        log("");
        log("DONNEES CALCULEES");
        log("Min surface : " + minSurface + " / Max surface : " + maxSurface);
        log("Min fenêtres : " + minFen + " / Max fenêtres : " + maxFen);
        double chauffageVal = salle.isChauffage() ? 1.0 : 0.0;
        double orientCoef = switch (salle.getOrientation()) {
            // En effet l'orientation a un effet sur la réception des rayons du soleil et
            // donc par la même occasion de chaleur donc le chauffage y sera moins important
            case "SUD" -> 1.0;
            case "EST", "OUEST" -> 0.6;
            default -> 0.2;
        };

        log("Surface normalisée : " + surfaceNorm);
        log("Fenêtres normalisées : " + fenNorm);
        log("Orientation coef : " + orientCoef);
        log("Chauffage : " + chauffageVal);

        // Calcul avec les coefficients (ils sont choisis en fonction de l'importance du
        // caractère)
        double contribSurface = (1 - surfaceNorm) * 0.30;
        double contribFen = fenNorm * 0.25;
        double contribOrient = orientCoef * 0.20;
        double contribChauffage = (1 - chauffageVal) * 0.25;

        // Impact de la température sur le chauffage, difficulté à chauffer correctement
        // quand il fait plus froid
        double coefTemp;
        if (temperatureExt < 0) {
            coefTemp = 0.75;
        } else if (temperatureExt < 10) {
            coefTemp = 0.85;
        } else if (temperatureExt < 20) {
            coefTemp = 0.95;
        } else {
            coefTemp = 1.0;
        }

        log("Coef météo : " + coefMeteo);
        log("Coef vacances : " + coefVacances);
        log("Température extérieure : " + temperatureExt);
        log("Coefficient température : " + coefTemp);
        log("Contrib surface : (1 - " + surfaceNorm + ") x 0.30 = " + contribSurface);
        log("Contrib fenêtres : " + fenNorm + " x 0.25 = " + contribFen);
        log("Contrib orientation : " + orientCoef + " x 0.20 = " + contribOrient);
        log("Contrib chauffage : (1 - " + chauffageVal + ") x 0.25 x coefTemp(" + coefTemp + ") = " + contribChauffage);

        // Score brut avec ajout des différents coefficients provenant de la table mock
        // de salle, ils sont tous inférieurs à 1 pour ne pas impacter le score
        // au-dessus de sa valeur max
        double score = (100
                * (contribSurface + (contribFen * coefMeteo) + contribOrient + (contribChauffage * coefTemp)))
                * coefVacances;

        log("Contribution surface : " + contribSurface);
        log("Contribution fenêtres : " + contribFen);
        log("Contribution orientation : " + contribOrient);
        log("Contribution chauffage : " + contribChauffage);
        log("Score brut : 100 x (" + contribSurface + " + " + (contribFen * coefMeteo) + " + " + contribOrient + " + "
                + (contribChauffage * coefTemp) + ") = " + (score / coefVacances));
        log("Score après coefVacances : " + (score / coefVacances) + " x " + coefVacances + " = " + score);

        // Détails de calcul à afficher sur le front
        // On affichera pas les coefficients du mock dans notre tableau mais à venir,
        // j'ajouterai les nouveaux calculs dans l'alerte du site(lorsque l'on clique
        // sur le bouton)

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

        // Calcul du Co2 d'après JobDating
        int nbPersonnes = salle.getCapacite();
        int scoreCo2 = jobDatingRoomService.getScoreCO2(salle, nbPersonnes);
        scoreCo2 = scoreCo2 * 5 / 3; // sert à adapter le score CO2 de Mohamed qui est initialement sur 60 à 100

        log("");
        log("DONNEES & CALCULS LIEES AU CO2");
        log("Nombre de personnes : " + nbPersonnes);
        log("Score CO2 (avant adaptation) : " + jobDatingRoomService.getScoreCO2(salle, nbPersonnes));
        log("Score CO2 final : " + scoreCo2);

        // SCORE CONFORT
        Map<String, Double> detailsConfort = new HashMap<>();
        double scoreConfort = calculateScoreConfort(salle, detailsConfort);
        log("");

        return new SalleScoreResult(
                score,
                scoreConfort,
                details,
                detailsConfort,
                salle.getTemperature(),
                salle.getHumidite(),
                coefMeteo,
                coefVacances,
                scoreCo2);
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

        log("");
        log("SCORES");
        log("Score température : temp=" + temp + "°C → " + scoreTemp + " / 30");
        log("Score humidité : hum=" + hum + "% → " + scoreHum + " / 20");
        log("Score densité : " + densite + " pers/m² → " + scoreDensite + " / 20");
        log("Score luminosité : " + salle.getNbFenetres() + " fen. x 2 + bonus(" + orientBonus + ") = " + scoreLum
                + " / 15");
        log("Score type salle : " + (salle.isEstSalleTp() ? "TP" : "non-TP") + " → " + scoreType + " / 15");

        // Somme de tous les sous-scores
        score = scoreTemp + scoreHum + scoreDensite + scoreLum + scoreType;
        log("Score confort total : " + scoreTemp + " + " + scoreHum + " + " + scoreDensite + " + " + scoreLum + " + "
                + scoreType + " = " + score + " / 100");
        return score;
    }

    // Simple liste des logs afin d'afficher les logs dans un tableau
    private final List<String> logs = new ArrayList<>();

    private void log(String message) {
        logs.add(message);
    }

    public List<String> getLogs() {
        logs.clear(); // on vide ici pour être certain d'avoir une liste vide au début
        log("DESCRIPTION DES DIFFERENTS CALCULS ASSIGNES AUX SALLES");
        log("");
        log("LEGENDE");
        log("");
        log("surfaceNorm : surface ramenée entre 0 et 1 par rapport aux autres salles");
        log("fenNorm : nb fenêtres ramené entre 0 et 1 par rapport aux autres salles");
        log("orientCoef : SUD = 1.0; EST/OUEST = 0.6; NORD = 0.2 (impact solaire)");
        log("coefMeteo : ajuste l'impact des fenêtres selon la météo du jour - Soleil=1.0; Nuage=0.7; Pluie=0.4");
        log("coefVacances : réduit le score si période de vacances - (juillet/août/décembre = coef < 1)");
        log("coefTemp : impact de la température ext. sur le chauffage - < 0°C = 0.75; < 10°C = 0.85; < 20°C = 0.95; >= 20°C = 1.0");
        log("ScoreCO2 : estimé depuis la capacité max de la salle, adapté de /60 à /100");
        log("Densite : nb personnes / surface en m² (pers/m²)");
        log("");

        List<Salle> salles = salleService.findAllSalles();
        for (Salle salle : salles) {
            calculateScore(salle.getIdSalle());
        }
        return new ArrayList<>(logs);
    }

    public void clearLogs() {
        logs.clear();
    }
}