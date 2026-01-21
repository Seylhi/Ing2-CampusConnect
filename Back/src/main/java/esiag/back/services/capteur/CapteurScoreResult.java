package esiag.back.services.capteur;

import java.time.LocalDateTime;
import java.util.Map;

public class CapteurScoreResult {
    private double score; // score numérique
    private String status; // status pour le front
    private Map<String, Double> details; // détails du calcul
    private LocalDateTime calculationTime;

    public CapteurScoreResult(double score, String status, Map<String, Double> details) {
        this.score = score;
        this.status = status;
        this.details = details;
        this.calculationTime = LocalDateTime.now();
    }

    public double getScore() { return score; }
    public String getStatus() { return status; }
    public Map<String, Double> getDetails() { return details; }
    public LocalDateTime getCalculationTime() { return calculationTime; }
}