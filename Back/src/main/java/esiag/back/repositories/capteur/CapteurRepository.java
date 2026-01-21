package esiag.back.repositories.capteur;

import esiag.back.models.capteur.Capteur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CapteurRepository extends JpaRepository<Capteur, Long> {
    List<Capteur> findByIdSalleOrderByIdSalleAsc(Long idSalle);

}
