package esiag.back.repositories.salle;

import esiag.back.models.salle.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalleRepository extends JpaRepository<Salle, Long> {
     List<Salle> findAllByOrderByIdSalleAsc(); // afin de trier par ordre croissant d'id et donc d'avoir info1, info2,...
}
