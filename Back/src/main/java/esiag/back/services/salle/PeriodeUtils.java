package esiag.back.services.salle;

import java.time.LocalTime;

// permet tout simplement d'encadrer les heures dans des périodes pour la suite de notre appli
public class PeriodeUtils {
    public static String getPeriode(LocalTime time) {
        int h = time.getHour();
        if (h < 12) return "MATIN";
        if (h < 18) return "APRES_MIDI";
        return "SOIR";
    }
}