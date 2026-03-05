package esiag.back.controllers.jobdating;

import esiag.back.services.jobdating.JobDatingRoomResultat;
import esiag.back.services.jobdating.JobDatingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobdating")
public class JobDatingController {

    @Autowired
    private JobDatingRoomService jobDatingRoomService;

    @GetMapping("/salle-optimale/{nbPersonnes}")
    public JobDatingRoomResultat getMeilleureSalle(@PathVariable int nbPersonnes) {
        return jobDatingRoomService.trouverMeilleureSalle(nbPersonnes);
    }
}