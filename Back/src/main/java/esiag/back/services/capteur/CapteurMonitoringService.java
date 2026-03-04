package esiag.back.services.capteur;

import esiag.back.models.capteur.Capteur;
import esiag.back.models.MesureCapteur.CapteurMesure;
import esiag.back.models.MesureCapteur.CapteurMesure.TypeMesure;
import esiag.back.repositories.MesureCapteur.CapteurMesureRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CapteurMonitoringService {
    private final CapteurService serviceCapteur;
    private final CapteurMesureRepository repositoryMesures;

    public CapteurMonitoringService(CapteurService serviceCapteur, CapteurMesureRepository repositoryMesures) {
        this.serviceCapteur = serviceCapteur;
        this.repositoryMesures = repositoryMesures;
    }

    public double moyenneTemperatureSalle(Long idSalle) {
        List<Capteur> listeCapteurs = serviceCapteur.findBySalle(idSalle);
        double total = 0;
        int compteur = 0;
        for (Capteur capteur : listeCapteurs) {
            List<CapteurMesure> mesures = repositoryMesures.findByCapteurIdAndTypeAndDateMesureAfter(capteur.getId(),
                    TypeMesure.TEMPERATURE, LocalDateTime.now().minusHours(24));
            for (CapteurMesure mesure : mesures) {
                total += mesure.getValeur();
                compteur++;
            }
        }
        if (compteur == 0)
            return 0;
        return total / compteur;
    }
}