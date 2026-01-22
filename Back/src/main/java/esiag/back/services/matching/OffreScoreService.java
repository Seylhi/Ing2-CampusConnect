package esiag.back.services.matching;

import esiag.back.models.etudiant.Etudiant;
import esiag.back.models.offre.Offre;
import esiag.back.repositories.etudiant.EtudiantRepository;
import esiag.back.repositories.offre.OffreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OffreScoreService {

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private OffreRepository offreRepository;

    public List<OffreScoreResultat> getRankedOffres(Integer etudiantId) {
        Etudiant etu = etudiantRepository.findById(etudiantId).orElse(null);
        if (etu == null) return new ArrayList<>();

        // Offre correspondant au contrat recherché et à la filière de l'étudiant
        List<Offre> candidats = offreRepository.findByTypeOffreAndFiliereCible(etu.getOffreRecherchee(), etu.getFiliere());

        List<OffreScoreResultat> results = new ArrayList<>();
        for (Offre o : candidats) {
            OffreScoreResultat score = calculateOffreScore(etu, o);
        results.add(score);
        }

        // Tri par score décroissant
for (int i = 0; i < results.size(); i++) {
    for (int j = i + 1; j < results.size(); j++) {
        if (results.get(j).getScore() > results.get(i).getScore()) {
            // échange des deux éléments
            OffreScoreResultat temp = results.get(i);
            results.set(i, results.get(j));
            results.set(j, temp);
        }
    }
}

return results;
    }

    // Logique de calcul du score sur 100 pour une offre
    private OffreScoreResultat calculateOffreScore(Etudiant etu, Offre o) {
        Map<String, Double> details = new HashMap<>();
        
        // Attribution de 10 points selon la bonne filière
        details.put("Filière", 10.0);

        // Niveau d'étude sur 10 pts ("1" pour ING1 qui équivaut à "3" de bac + 3 dans l'offre)
        double scoreNiveau = 0;
        if (etu.getNiveau().contains("1") && o.getNiveauRequis().contains("3")) {
        scoreNiveau = 10;
        } else if (etu.getNiveau().contains("2") && o.getNiveauRequis().contains("4")) {
        scoreNiveau = 10;
        } else if (etu.getNiveau().contains("3") && o.getNiveauRequis().contains("5")) {
        scoreNiveau = 10;
        } else {
        scoreNiveau = 0;
    }
        details.put("Niveau", scoreNiveau);

        // Durée du stage calculée sur 20 pts
        double scoreDuree;
        if (etu.getDuree().equals(o.getDuree())) {
            scoreDuree = 20; 
        } else {
            scoreDuree = 0;
        
        }
        details.put("Durée", scoreDuree);


        // Calcul de la distance ville de résidence / travail
        double dist = calculateDistance(etu.getLatitude().doubleValue(), etu.getLongitude().doubleValue(), o.getLatitude().doubleValue(), o.getLongitude().doubleValue());
        double scoreDist;
        if (dist < 15) scoreDist = 20.0;  // Meilleure distance calculée sur 20 pts
        else if (dist < 30) scoreDist = 10.0;
        else scoreDist = 5.0; 
        details.put("Distance", scoreDist);

        // Les compétences sont calculées sur 40 points
        double scoreComp = calculateSkills(etu.getCompetences(), o.getCompetencesRequises());
        details.put("Compétences", scoreComp);

        double total = 10.0 + scoreNiveau + scoreDuree + scoreDist + scoreComp;
        
        return new OffreScoreResultat(o, total, getStatus(total), details, dist);
    }

    private double calculateSkills(String etuComp, String offComp) {
    if (etuComp == null || offComp == null) {
        return 0;
    }
    String[] etuList = etuComp.toLowerCase().split(", ");
    String[] offList = offComp.toLowerCase().split(", ");

    int matches = 0;
    for (int i = 0; i < offList.length; i++) {
        for (int j = 0; j < etuList.length; j++) {
            if (offList[i].equals(etuList[j])) {
                matches++;
                break;
            }
        }
    }

    return (double) matches / offList.length * 40;
}
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) { // Formule de Haversine qui permet de calculer la distance entre deux points GPS (latitude et longitude)
        double R = 6371; // Rayon de la Terre en km

        // diffrérence des latitudes et longitudes entre les deux points
        double dLat = Math.toRadians(lat2 - lat1); // conversion en radians
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *Math.sin(dLon / 2) * Math.sin(dLon / 2);  // sin²(delta latitude / 2), cos(latitude du point 1), cos(latitude du point 2), sin²(delta longitude / 2)
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private String getStatus(double s) {
        if (s >= 85) return "Offre idéale";
        if (s >= 70) return "Très bonne offre";
        return "Offre moyenne";
    }
}