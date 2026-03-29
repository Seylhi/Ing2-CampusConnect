package esiag.back.services.jobdating;

import esiag.back.models.salle.Salle;
import esiag.back.models.capteur.Capteur;
import esiag.back.repositories.salle.SalleRepository;
import esiag.back.repositories.capteur.CapteurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobDatingRoomService {

    @Autowired
    private SalleRepository salleRepository;

    @Autowired
    private CapteurRepository capteurRepository;

    public JobDatingRoomResultat trouverMeilleureSalle(int nbPersonnesPrevues) {
        List<Salle> listeSalles = salleRepository.findAll();
        List<Capteur> listeCapteurs = capteurRepository.findAll();

        Salle meilleureSalle = null;
        double meilleurScoreFinal = -1;
        double meilleurCo2 = 0.0;
        int meilleurScoreTemp = 0;
        int meilleurScoreHum = 0;
        int meilleurScoreCo2 = 0;

        for (int i = 0; i < listeSalles.size(); i++) {
            Salle salleActuelle = listeSalles.get(i);

            if (salleActuelle.getCapacite() >= nbPersonnesPrevues) {

                Capteur capteurDeLaSalle = null;
                for (int j = 0; j < listeCapteurs.size(); j++) {
                    if (listeCapteurs.get(j).getIdSalle().equals(salleActuelle.getIdSalle())) {
                        capteurDeLaSalle = listeCapteurs.get(j);
                    }
                }

                double temperature = 20.0;
                double humidite = 50.0;

                if (capteurDeLaSalle != null && capteurDeLaSalle.getTemperature() != null) {
                    temperature = capteurDeLaSalle.getTemperature();
                } else if (salleActuelle.getTemperature() != null) {
                    temperature = salleActuelle.getTemperature();
                }

                if (capteurDeLaSalle != null && capteurDeLaSalle.getHumidite() != null) {
                    humidite = capteurDeLaSalle.getHumidite();
                } else if (salleActuelle.getHumidite() != null) {
                    humidite = salleActuelle.getHumidite();
                }

                // calcul du score de température sur 20 pts
                int scoreTemperature = 0;
                if (temperature >= 20 && temperature <= 23) {
                    scoreTemperature = 20;
                } else if ((temperature >= 18 && temperature < 20) || (temperature > 23 && temperature <= 26)) {
                    scoreTemperature = 10;
                } else {
                    scoreTemperature = 0;
                }

                // calcul du score d'humidité sur 20 pts
                int scoreHumidite = 0;
                if (humidite >= 40 && humidite <= 60) {
                    scoreHumidite = 20;
                } else if ((humidite >= 30 && humidite < 40) && (humidite > 60 && humidite <= 70)) {
                    scoreHumidite = 10;
                } else {
                    scoreHumidite = 0;
                }

                // calcul du score de CO2 sur 60 pts

                // j'ai supposé une norme de 3m de hauteur, mes camarades ont déjà la surface
                // des salles
                // calcul du volume de la salle
                double volume = salleActuelle.getSurfaceM2() * 3.0;

                // ACH pour Air changes per hour
                // ça correspond au nombre de fois où l'air est renouvelé dans une pièce pendant
                // une période d'une heure
                // je prends une moyenne de 3 qui correspond à ce qu'on trouve dans une salle
                double ACH = 3.0;

                // Formule de concentration CO2 (C = Cext + (N * G * 1 000 000) / (ACH * V))

                // C : concentration de CO2 dans la salle

                // Cext : Concentration de CO2 dans l'air extérieur (en ppm)
                // la moyenne est d'environ 400 ppm

                // N : Nombre de personnes présentes dans la salle

                // G : moyenne taux d'emission de CO2 par personne au repos : 0,018 m3
                // https://projetco2.fr/sites/default/files/2021-05/EstimationQCO2.pdf

                // 1000000 facteur de conversion pour passer d'une fraction volumique
                // à une concentration en parties par million (ppm).

                // Volume V de la salle en m3

                double co2Estime = 400 + (nbPersonnesPrevues * 0.018 * 1000000) / (ACH * volume);

                int scoreCo2 = 0;
                if (co2Estime < 800) {
                    scoreCo2 = 60;
                } else if (co2Estime < 1000) {
                    scoreCo2 = 40;
                } else if (co2Estime < 1500) {
                    scoreCo2 = 15;
                } else {
                    scoreCo2 = 0;
                }

                // calcul du score total sur 100 pts
                int scoreTotal = scoreCo2 + scoreTemperature + scoreHumidite;

                if (scoreTotal > meilleurScoreFinal) {
                    meilleurScoreFinal = scoreTotal;
                    meilleureSalle = salleActuelle;
                    meilleurCo2 = co2Estime;
                    meilleurScoreTemp = scoreTemperature;
                    meilleurScoreHum = scoreHumidite;
                    meilleurScoreCo2 = scoreCo2;
                }
            }
        }

        String status;
        if (meilleureSalle == null) {
            status = "Capacité de salle insuffisante";
        } else if (meilleurScoreFinal >= 80) {
            status = "Salle idéale";
        } else if (meilleurScoreFinal >= 50) {
            status = "Salle moyenne";
        } else {
            status = "Salle à éviter";
        }

        return new JobDatingRoomResultat(meilleureSalle, meilleurScoreFinal, status, meilleurCo2, meilleurScoreTemp,
                meilleurScoreHum, meilleurScoreCo2);
    }

    // Duplication de la logique de calcul pour l'adapter aux salles afin de
    // compléter mon calcul de score global
    public int getScoreCO2(Salle salle, int nbPersonnes) {
        double volume = salle.getSurfaceM2() * 3.0;
        double ACH = 3.0;
        double co2Estime = 400 + (nbPersonnes * 0.018 * 1000000) / (ACH * volume);
        if (co2Estime < 800)
            return 60;
        else if (co2Estime < 1000)
            return 40;
        else if (co2Estime < 1500)
            return 15;
        else
            return 0;
    }
}