package esiag.back.controllers.map;

import esiag.back.services.map.MapStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/map/stats")
@CrossOrigin
public class StatsController {

    @Autowired
    private MapStatsService mapStatsService;

    @GetMapping
    public Map<String, Object> getGlobalStats() {
        return mapStatsService.getGlobalStatistics();
    }

    @PostMapping("/consultation")
    public void incrementConsultation() {
        mapStatsService.incrementConsultationCounter();
    }
}