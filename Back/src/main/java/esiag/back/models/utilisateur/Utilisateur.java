package esiag.back.models.utilisateur;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String prenom;

    private String email;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    private String role;

    public Utilisateur() {
    }

    public Utilisateur(Long id, String nom, String prenom, String email, String motDePasse, String role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getEmail() {
        return email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public String getRole() {
        return role;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public void setRole(String role) {
        this.role = role;
    }
}