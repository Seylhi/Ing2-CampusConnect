package esiag.back.controllers.salle;

import esiag.back.services.salle.SalleScoreResult;
import esiag.back.services.salle.SalleScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/salle")
public class SalleScoreController {

    @Autowired      // afin d'injecter automatiquement une dépendence (ici SalleScoreService)
    private SalleScoreService salleScoreService;

    @GetMapping("score/{idSalle}")
    public ResponseEntity<SalleScoreResult> getSalleScore(@PathVariable Long idSalle) {
        SalleScoreResult result = salleScoreService.calculateScore(idSalle);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}