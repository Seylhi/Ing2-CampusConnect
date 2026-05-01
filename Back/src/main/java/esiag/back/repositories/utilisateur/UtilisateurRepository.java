package esiag.back.repositories.utilisateur;

import esiag.back.models.utilisateur.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmailAndMotDePasse(String email, String motDePasse);
}