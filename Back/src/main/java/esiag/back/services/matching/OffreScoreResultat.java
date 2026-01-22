package esiag.back.services.matching;

import esiag.back.models.offre.Offre;
import lombok.Getter;
import java.util.Map;

@Getter
public class OffreScoreResultat { // Nom mis à jour
    private Offre offre;
    private double score; 
    private String status; 
    private Map<String, Double> details; 
    private double distanceKm;

    public OffreScoreResultat(Offre offre, double score, String status, Map<String, Double> details, double distanceKm) {
        this.offre = offre;
        this.score = score;
        this.status = status;
        this.details = details;
        this.distanceKm = distanceKm;
    }
}