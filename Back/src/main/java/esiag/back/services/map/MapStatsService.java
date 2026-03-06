package esiag.back.services.map;

import esiag.back.models.salle.Salle;
import esiag.back.repositories.salle.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MapStatsService {

        @Autowired
        private SalleRepository salleRepository;

        private int consultationCounter = 0;

        public Map<String, Object> getGlobalStatistics() {

                List<Salle> salles = salleRepository.findAll();

                int totalSalles = salles.size();

                long sallesOccupees = salles.stream()
                                .filter(Salle::isOccupee)
                                .count();

                double tauxOccupation = totalSalles == 0 ? 0 : (double) sallesOccupees / totalSalles * 100;

                double temperatureMoyenne = salles.stream()
                                .filter(s -> s.getTemperature() != null)
                                .mapToDouble(Salle::getTemperature)
                                .average()
                                .orElse(0);

                double humiditeMoyenne = salles.stream()
                                .filter(s -> s.getHumidite() != null)
                                .mapToDouble(Salle::getHumidite)
                                .average()
                                .orElse(0);

                Map<String, Object> stats = new HashMap<>();

                stats.put("totalSalles", totalSalles);
                stats.put("sallesOccupees", sallesOccupees);
                stats.put("tauxOccupation", tauxOccupation);
                stats.put("temperatureMoyenne", temperatureMoyenne);
                stats.put("humiditeMoyenne", humiditeMoyenne);
                stats.put("consultationsMap", consultationCounter);

                return stats;
        }

        public void incrementConsultationCounter() {
                consultationCounter++;
        }
}