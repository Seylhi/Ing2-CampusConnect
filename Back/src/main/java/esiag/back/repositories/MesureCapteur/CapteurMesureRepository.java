package esiag.back.repositories.MesureCapteur;

import esiag.back.models.MesureCapteur.CapteurMesure;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import esiag.back.models.MesureCapteur.CapteurMesure.TypeMesure;
import java.time.LocalDateTime;

public interface CapteurMesureRepository extends JpaRepository<CapteurMesure, Long> {
    List<CapteurMesure> findByCapteurIdAndTypeOrderByDateMesureDesc(Long capteurId, TypeMesure type);

    List<CapteurMesure> findByCapteurIdAndTypeAndDateMesureAfter(Long capteurId, TypeMesure type,
            LocalDateTime dateMesure);
}