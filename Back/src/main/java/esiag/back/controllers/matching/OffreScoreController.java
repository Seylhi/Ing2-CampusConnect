package esiag.back.controllers.matching;

import esiag.back.services.matching.OffreScoreResultat;
import esiag.back.services.matching.OffreScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/offres") // URL mise à jour
public class OffreScoreController {

    @Autowired
    private OffreScoreService offreScoreService;

    @GetMapping("/student/{id}")
    public List<OffreScoreResultat> getOffres(@PathVariable Integer id) {
        return offreScoreService.getRankedOffres(id);
    }
}