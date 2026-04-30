package esiag.back.services.jobdating;

import esiag.back.models.salle.Salle;
import lombok.Getter;

@Getter
public class JobDatingRoomResultat {
    private Salle salle;
    private double score; 
    private String status; 
    private double co2Estime;
    private int scoreTemperature;
    private int scoreHumidite;
    private int scoreCo2;

    private int nbPersonnesPresentes;
    private double tauxRemplissage;
    private int scoreDensite;
    private double niveauSonoreDb;
    private int scoreBruit;
    private double achUtilise;

    public JobDatingRoomResultat(Salle salle, double score, String status, double co2Estime, int scoreTemperature, int scoreHumidite, int scoreCo2, int nbPersonnesPresentes, double tauxRemplissage, int scoreDensite, double niveauSonoreDb, int scoreBruit, double achUtilise) {

        this.salle = salle;
        this.score = score;
        this.status = status;
        this.co2Estime = co2Estime;
        this.scoreTemperature = scoreTemperature;
        this.scoreHumidite = scoreHumidite;
        this.scoreCo2 = scoreCo2;
        this.nbPersonnesPresentes = nbPersonnesPresentes;
        this.tauxRemplissage = tauxRemplissage;
        this.scoreDensite = scoreDensite;
        this.niveauSonoreDb = niveauSonoreDb;
        this.scoreBruit = scoreBruit;
        this.achUtilise = achUtilise;
    }
}
