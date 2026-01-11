public class Score_energie {

    public static void main(String[] args) {

        // On crée des salles en durs, ici afin de tester ce score
        Salle[] salles = {
                new Salle("Salle A", 60, 4, true, "SUD"),
                new Salle("Salle B", 45, 2, true, "NORD"),
                new Salle("Salle C", 80, 6, false, "EST"),
                new Salle("Salle D", 50, 3, true, "OUEST")
        };

        // Initialisation min/max avec la première salle
        double minSurface = salles[0].surface;
        double maxSurface = salles[0].surface;
        int minFen = salles[0].fenetres;
        int maxFen = salles[0].fenetres;

        // Trouver les min et max afin de faire la normalisation ensuite
        for (int i = 1; i < salles.length; i++) {
            if (salles[i].surface < minSurface) minSurface = salles[i].surface;
            if (salles[i].surface > maxSurface) maxSurface = salles[i].surface;
            if (salles[i].fenetres < minFen) minFen = salles[i].fenetres;
            if (salles[i].fenetres > maxFen) maxFen = salles[i].fenetres;
        }

        System.out.println("Min surface: " + minSurface + ", Max surface: " + maxSurface);
        System.out.println("Min fenêtres: " + minFen + ", Max fenêtres: " + maxFen);

        // Calcul des scores
        for (int i = 0; i < salles.length; i++) {

            Salle s = salles[i];

            // Normalisation (voir documentation) avec une exception pour la division par 0
            double surfaceNorm = (maxSurface - minSurface != 0) ? (s.surface - minSurface) / (maxSurface - minSurface) : 0;
            double fenNorm = (maxFen - minFen != 0) ? (double)(s.fenetres - minFen) / (maxFen - minFen) : 0;
            double chauffageVal = s.chauffage ? 1 : 0;

            // Gestion de l'orientation (voir dans la documentation pour plus d'infos)
            double orient;
            if (s.orientation.equals("SUD")) orient = 1.0;
            else if (s.orientation.equals("EST") || s.orientation.equals("OUEST")) orient = 0.6;
            else orient = 0.2;

            // Calcul score énergétique
            double score = 100 * (
                    0.4 * (1 - surfaceNorm) +
                    0.3 * fenNorm +
                    0.2 * orient +
                    0.1 * (1 - chauffageVal)
            );

            s.score = score;

            // Logs détaillés pour chaque salle
            System.out.println("Salle: " + s.nom);
            System.out.println("  Surface: " + s.surface + " Norm: " + String.format("%.2f", surfaceNorm));
            System.out.println("  Fenêtres: " + s.fenetres + " Norm: " + String.format("%.2f", fenNorm));
            System.out.println("  Chauffage: " + s.chauffage + " Valeur: " + chauffageVal);
            System.out.println("  Orientation: " + s.orientation + " Coeff: " + orient);
            System.out.println("  Score calculé: " + String.format("%.2f", score));
        }

        // Affichage final des scores des salles
        System.out.println("Résultat final des scores :");
        for (int i = 0; i < salles.length; i++) {
            System.out.println(salles[i].nom + " - Score énergétique : " + String.format("%.0f", salles[i].score) + "/100");
        }
    }
}

// à venir, un score fait sur mesure pour l'user