package esiag.back.controllers.alerte;

import esiag.back.models.alerte.Alerte;
import esiag.back.services.alerte.AlerteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerte")
public class AlerteController {

    private final AlerteService alerteService;

    public AlerteController(AlerteService alerteService) {
        this.alerteService = alerteService;
    }

    // Alertes actives d’un capteur
    @GetMapping("/capteur/{idCapteur}")
    public List<Alerte> getAlertes(@PathVariable Long idCapteur) {
        return alerteService.getAlertesActives(idCapteur);
    }

    // Résoudre une alerte
    @PostMapping("/resolve/{id}")
    public void resolveAlerte(@PathVariable Long id) {
        alerteService.resolveAlerte(id);
    }
}
