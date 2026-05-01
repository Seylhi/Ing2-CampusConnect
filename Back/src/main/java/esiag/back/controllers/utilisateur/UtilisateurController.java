package esiag.back.controllers.utilisateur;

import esiag.back.models.utilisateur.Utilisateur;
import esiag.back.services.utilisateur.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/utilisateur")
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String motDePasse = body.get("mot_de_passe");

        Optional<Utilisateur> utilisateurOptional = utilisateurService.login(email, motDePasse);

        if (utilisateurOptional.isEmpty()) {
            Map<String, String> erreur = new HashMap<>();
            erreur.put("message", "Email ou mot de passe incorrect");
            return ResponseEntity.status(401).body(erreur);
        }

        Utilisateur utilisateur = utilisateurOptional.get();

        Map<String, Object> response = new HashMap<>();
        response.put("id", utilisateur.getId());
        response.put("nom", utilisateur.getNom());
        response.put("prenom", utilisateur.getPrenom());
        response.put("email", utilisateur.getEmail());
        response.put("role", utilisateur.getRole());

        return ResponseEntity.ok(response);
    }
}