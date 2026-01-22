package esiag.back.services.alerte;

import esiag.back.models.alerte.Alerte;
import esiag.back.models.capteur.Capteur;
import esiag.back.repositories.alerte.AlerteRepository;
import esiag.back.services.capteur.CapteurService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlerteService {

    private final AlerteRepository alerteRepository;

    public AlerteService(AlerteRepository alerteRepository) {
        this.alerteRepository = alerteRepository;
    }

    public List<Alerte> getAlertesActives(Long idCapteur) {
        return alerteRepository.findByIdCapteurAndActiveTrue(idCapteur);
    }

    public void resolveAlerte(Long id) {
        alerteRepository.findById(id).ifPresent(alerte -> {
            alerte.setActive(false);
            alerteRepository.save(alerte);
        });
    }
}
