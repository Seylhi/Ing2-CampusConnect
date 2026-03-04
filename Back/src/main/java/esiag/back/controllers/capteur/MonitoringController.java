package esiag.back.controllers.capteur;

import esiag.back.services.capteur.CapteurMonitoringService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/monitoring")
public class MonitoringController {
    private final CapteurMonitoringService serviceMonitoring;

    public MonitoringController(CapteurMonitoringService serviceMonitoring) {
        this.serviceMonitoring = serviceMonitoring;
    }

    @GetMapping("/salle/{idSalle}/temperature")
    public Double moyenneTemperatureSalle(@PathVariable Long idSalle) {
        return serviceMonitoring.moyenneTemperatureSalle(idSalle);
    }
}