package esiag.back.controllers.capteur;

import esiag.back.models.capteur.Capteur;
import esiag.back.services.capteur.CapteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("capteur")
public class CapteurController {

    @Autowired
    private CapteurService capteurService;

    @GetMapping("/{id}")
    public ResponseEntity<Capteur> findById(@PathVariable Long id){
        Capteur capteur = capteurService.findById(id);
        if(capteur == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(capteur, HttpStatus.OK);
    }

    @GetMapping("all")
    public ResponseEntity<List<Capteur>> findAll(){
        return new ResponseEntity<>(capteurService.findAll(), HttpStatus.OK);
    }

    @GetMapping("salle")
    public ResponseEntity<List<Capteur>> findBySalle(@RequestParam Integer idSalle){
        return new ResponseEntity<>(capteurService.findBySalle(idSalle), HttpStatus.OK);
    }

    @PostMapping("save")
    public ResponseEntity<Capteur> save(@RequestBody Capteur capteur){
        return new ResponseEntity<>(capteurService.save(capteur), HttpStatus.OK);
    }

    @PostMapping("update")
    public ResponseEntity<Capteur> update(@RequestBody Capteur capteur){
        boolean updated = capteurService.update(capteur);
        if(!updated){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(capteur, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id){
        boolean deleted = capteurService.delete(id);
        if(!deleted){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
