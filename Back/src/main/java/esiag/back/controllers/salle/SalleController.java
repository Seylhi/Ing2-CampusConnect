package esiag.back.controllers.salle;

import esiag.back.models.salle.Salle;
import esiag.back.services.salle.SalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("salle")

// Dans notre cas, on va se concentrer uniquement sur l'affichage car les données des salle sne sont pas vouées à changer
// du moins pas encore !
public class SalleController {

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
}
