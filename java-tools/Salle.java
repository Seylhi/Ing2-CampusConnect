public class Salle {

    String nom;
    double surface;
    int fenetres;
    boolean chauffage;
    String orientation;
    double score;

    public Salle(String nom, double surface, int fenetres, boolean chauffage, String orientation) {
        this.nom = nom;
        this.surface = surface;
        this.fenetres = fenetres;
        this.chauffage = chauffage;
        this.orientation = orientation;
    }
}
