package esiag.back.controllers.salle;

import esiag.back.models.salle.Salle;
import esiag.back.services.salle.SalleScoreResult;
import esiag.back.services.salle.SalleScoreService;
import esiag.back.services.salle.SalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("salle")

// Dans notre cas, on va se concentrer uniquement sur l'affichage car les
// données des salles ne sont pas vouées à changer
// du moins pas encore !
public class SalleController {

    @Autowired
    private SalleScoreService salleScoreService;

    @GetMapping("/{id}/score")
    public SalleScoreResult getSalleScore(@PathVariable Long id) {
        return salleScoreService.calculateScore(id);
    }

    @Autowired
    private SalleService salleService;

    @GetMapping("all")
    public ResponseEntity<List<Salle>> findAllSalles() {
        return new ResponseEntity<>(salleService.findAllSalles(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salle> findSalleById(@PathVariable Long id) {
        Salle salle = salleService.findByIdSalle(id);
        if (salle == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(salle, HttpStatus.OK);
    }

    // Permets de calculer notre attribution de salle en fonction des éléments
    // remplies par l'user
    @GetMapping("forms")
    public ResponseEntity<List<Salle>> calcSalles(
            @RequestParam int nbPersonnes,
            @RequestParam boolean tp) {

        List<Salle> salles = salleService.findAllSalles();
        List<Salle> calcSalles = new ArrayList<>();

        for (Salle s : salles) {
            // On s'assure que la capacité est bien supérieur à la demande
            if (s.getCapacite() >= nbPersonnes) {
                // On relève si le client a choisi oui ou non une salle TP
                if (!tp || s.isEstSalleTp()) {
                    calcSalles.add(s);
                }
            }
        }

        return new ResponseEntity<>(calcSalles, HttpStatus.OK);
    }

    // Simplement pour afficher les logs des calcul
    @GetMapping("/logs")
    public ResponseEntity<List<String>> getLogs() {
        return ResponseEntity.ok(salleScoreService.getLogs());
    }
}
