package esiag.back.services.jobdating;

import esiag.back.models.salle.Salle;
import esiag.back.models.capteur.Capteur;
import esiag.back.repositories.salle.SalleRepository;
import esiag.back.repositories.capteur.CapteurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

@Service
public class JobDatingRoomService {

    @Autowired
    private SalleRepository salleRepository;

    @Autowired
    private CapteurRepository capteurRepository;

    public List<JobDatingRoomResultat> trouverMeilleureSalle(int nbPersonnesPrevues, int heure) {
        List<Salle> listeSalles = salleRepository.findAll();
        List<Capteur> listeCapteurs = capteurRepository.findAll();

        List<JobDatingRoomResultat> listeResultats = new ArrayList<>();

        // affluence estimée en fonction de l'heure de la journée pour un jobdating
        // les horaires vont de 9h à 18h (horaire de l'episen)
        // j'ai supposé que l'affluence maximale se situe entre 10h et 16h, avec un pic à 11h
        // et que l'affluence est plus faible en début et fin de journée, ainsi que pendant la pause déjeuner (13/14)

        double facteurAffluence = 0.0;
        if (heure < 9) {
            facteurAffluence = 0.0;
        } else if (heure >= 18) {
            facteurAffluence = 0.0;
        } else if (heure == 13) {
            facteurAffluence = 0.1; 
        } else if (heure == 9) {
            facteurAffluence = 0.6; 
        } else if (heure == 10) {
            facteurAffluence = 0.9; 
        } else if (heure == 11) {
            facteurAffluence = 1.0; 
        } else if (heure == 12) {
            facteurAffluence = 0.8; 
        } else if (heure == 14) {
            facteurAffluence = 0.7; 
        } else if (heure == 15) {
            facteurAffluence = 0.9; 
        } else if (heure == 16) {
            facteurAffluence = 0.9; 
        } else if (heure == 17) {
            facteurAffluence = 0.6; 
        }

        Double calculPersonnes = nbPersonnesPrevues * facteurAffluence;
        int nbPersonnesPresentes = calculPersonnes.intValue();

        for (int i = 0; i < listeSalles.size(); i++) {
            Salle salleActuelle = listeSalles.get(i);

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

                // calcul du score de température sur 15 pts
                int scoreTemperature = 0;
                if (temperature >= 20 && temperature <= 23) {
                    scoreTemperature = 15;
                } else if ((temperature >= 18 && temperature < 20) || (temperature > 23 && temperature <= 26)) {
                    scoreTemperature = 7;
                } else {
                    scoreTemperature = 0;
                }

                // calcul du score d'humidité sur 10 pts
                int scoreHumidite = 0;
                if (humidite >= 40 && humidite <= 60) {
                    scoreHumidite = 10;
                } else if ((humidite >= 30 && humidite < 40) || (humidite > 60 && humidite <= 70)) {
                    scoreHumidite = 5;
                } else {
                    scoreHumidite = 0;
                }

                // calcul du taux de remplissage
                double tauxRemplissage = 0.0;
                if (salleActuelle.getCapacite() > 0) {
                    tauxRemplissage = (nbPersonnesPresentes * 1.0) / salleActuelle.getCapacite();
                }

                // calcul du score de densité de la salle sur 15 pts
                int scoreDensite = 0;
                if (tauxRemplissage >= 0.40 && tauxRemplissage <= 0.80) {
                    scoreDensite = 15;
                } else if (tauxRemplissage > 0.80 && tauxRemplissage <= 0.95) {
                    scoreDensite = 7;
                } else if (tauxRemplissage >= 0.20 && tauxRemplissage < 0.40) {
                    scoreDensite = 7;
                } else {
                    scoreDensite = 0;
                }

                // calcul du score de CO2 sur 50 pts

                // j'ai supposé une norme de 3m de hauteur, mes camarades ont déjà la surface
                // des salles
                // calcul du volume de la salle
                double volume = salleActuelle.getSurfaceM2() * 3.0;

                // ACH pour Air changes per hour
                // ça correspond au nombre de fois où l'air est renouvelé dans une pièce pendant
                // une période d'une heure
                // je prends une moyenne de 3 qui correspond à ce qu'on trouve dans une salle
                // double ACH = 3.0;

                // L'ACH ne peut pas être la même à chaque fois et pour toutes les salles
                // car elle varie toutes les heures
                // et une salle peut avoir une bonne ou mauvaise ventilation par rapport à une autre
                // alors Monsieur Brener m'a demandé de faire varier la valeur de l'ACH
                // ici je décide de la faire varier aléatoirement entre 2 et 4 pour simuler ces variations
                double achUtilise = 2.0 + (Math.random() * 2.0);

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

                double co2Estime = 400 + (nbPersonnesPresentes * 0.018 * 1000000) / (achUtilise * volume);

                int scoreCo2 = 0;
                if (co2Estime < 800) {
                    scoreCo2 = 50;
                } else if (co2Estime < 1000) {
                    scoreCo2 = 30;
                } else if (co2Estime < 1500) {
                    scoreCo2 = 15;
                } else {
                    scoreCo2 = 0;
                }

                // Un jobdating ce sont beaucoup de gens qui parlent donc ça fait du bruit
                // je calcule alors le bruit en décibel suivant l'approximation logarithmique du niveau sonore
                // avec la formule : niveauSonoreDb = 60 + 10 × log10(nbPersonnesEffectives)
                // 60 dB correspond à une conversation normale
                // et chaque fois que le nombre de personnes double, le niveau sonore augmente d'environ 3 dB
                // et je suppose que le bruit de fond de la salle est de 35 dB

                double niveauSonoreDb = 35.0;
                if (nbPersonnesPresentes > 0) {
                    niveauSonoreDb = 60.0 + 10.0 * Math.log10(nbPersonnesPresentes);
                }

                // calcul du score de bruit sur 10 pts
                int scoreBruit = 0;
                if (niveauSonoreDb < 65) {
                    scoreBruit = 10; 
                } else if (niveauSonoreDb < 75) {
                    scoreBruit = 4; 
                } else {
                    scoreBruit = 0; 
                }


                // calcul du score total sur 100 pts
                int scoreTotal = scoreCo2 + scoreTemperature + scoreHumidite + scoreDensite + scoreBruit;

                if (salleActuelle.getCapacite() < nbPersonnesPresentes) {
                scoreTotal = 0;
            }


        String status = "";
            if (nbPersonnesPresentes == 0) {
                status = "Job dating fermé ou pause";
            } else if (salleActuelle.getCapacite() < nbPersonnesPresentes) {
                status = "Capacité de salle insuffisante";
            } else if (scoreTotal >= 80) {
                status = "Salle idéale";
            } else if (scoreTotal >= 50) {
                status = "Salle moyenne";
            } else {
                status = "Salle à éviter";
            }

        JobDatingRoomResultat resultatSalle = new JobDatingRoomResultat(salleActuelle, scoreTotal, status, co2Estime, scoreTemperature, scoreHumidite, scoreCo2, nbPersonnesPresentes, tauxRemplissage, scoreDensite, niveauSonoreDb, scoreBruit, achUtilise);

            listeResultats.add(resultatSalle);
        }

        for (int i = 0; i < listeResultats.size(); i++) {
            for (int k = i + 1; k < listeResultats.size(); k++) {
                JobDatingRoomResultat a = listeResultats.get(i);
                JobDatingRoomResultat b = listeResultats.get(k);
                if (b.getScore() > a.getScore()) {
                    listeResultats.set(i, b);
                    listeResultats.set(k, a);
                }
            }
        }

        return listeResultats;
    }

    // Duplication de la logique de calcul pour l'adapter aux salles afin de
    // compléter mon calcul de score global
    public int getScoreCO2(Salle salle, int nbPersonnes, int heure) {
        double volume = salle.getSurfaceM2() * 3.0;
        double achUtilise = 2.0 + (Math.random() * 2.0);
        double co2Estime = 400 + (nbPersonnes * 0.018 * 1000000) / (achUtilise * volume);
        if (co2Estime < 800)
            return 50;
        else if (co2Estime < 1000)
            return 30;
        else if (co2Estime < 1500)
            return 15;
        else
            return 0;
    }
}