package esiag.back.controllers.map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/map")
@CrossOrigin
public class MapController {

    @GetMapping("/ping")
    public String ping() {
        return "Map API is working";
    }
}