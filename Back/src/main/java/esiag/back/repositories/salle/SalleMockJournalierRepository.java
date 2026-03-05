package esiag.back.repositories.salle;

import esiag.back.models.salle.SalleMockJournalier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

// même schéma que pour les repository précédents, simplement ici, on récupère la data par date et par id
@Repository
public interface SalleMockJournalierRepository extends JpaRepository<SalleMockJournalier, Long> {
    SalleMockJournalier findByIdSalleAndDateJour(Long idSalle, LocalDate dateJour);
}