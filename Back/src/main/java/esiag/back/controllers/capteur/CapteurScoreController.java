package esiag.back.controllers.capteur;

import esiag.back.services.capteur.CapteurScoreService;
import esiag.back.services.capteur.CapteurScoreResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("salle")
public class CapteurScoreController {

    @Autowired
    private CapteurScoreService capteurScoreService;

    /**
     * Endpoint pour récupérer le score complet d'une salle
     * GET /salle/scoreCapteur/{idSalle}
     */
    @GetMapping("scoreCapteur/{idSalle}")
    public ResponseEntity<CapteurScoreResult> getSalleScore(@PathVariable Long idSalle) {
        CapteurScoreResult result = capteurScoreService.calculateScore(idSalle);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
