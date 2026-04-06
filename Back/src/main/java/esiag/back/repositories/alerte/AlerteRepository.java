package esiag.back.repositories.alerte;

import esiag.back.models.alerte.Alerte;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlerteRepository extends JpaRepository<Alerte, Long> {
    List<Alerte> findByIdCapteurAndActiveTrue(Long idCapteur);

    List<Alerte> findByIdCapteurAndTypeAndActiveTrue(Long idCapteur, String type);
}
