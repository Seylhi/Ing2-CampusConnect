package esiag.back.repositories.offre;

import esiag.back.models.offre.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OffreRepository extends JpaRepository<Offre, Integer> {
    List<Offre> findByTypeOffreAndFiliereCible(String typeOffre, String filiereCible); // récupérer les offres par type (stage/alternance) et filière
}