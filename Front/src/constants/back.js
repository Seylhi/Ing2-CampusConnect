<<<<<<< HEAD
export const LOCAL_HOST = "http://172.31.253.207:8080";
//export const LOCAL_HOST = "http://localhost:8080";
=======
export const LOCAL_HOST = "http://localhost:8080";
>>>>>>> 4fd889d (Ajout statistiques map + backend stats)

export const LOCAL_HOST_SALLE = LOCAL_HOST + "/salle/";
export const GET_SALLES = LOCAL_HOST_SALLE + "all";
// export const UPDATE_SALLES = LOCAL_HOST_SALLE + "update";
// En fait, inutile dans mon cas, basé sur l'ancien modèle
// On ajoute notre nouveau chemin pour le forms
export const CALCUL_SALLES = LOCAL_HOST_SALLE + "forms";

export const LOCAL_HOST_CAPTEUR = LOCAL_HOST + "/capteur/";
export const GET_CAPTEURS = LOCAL_HOST_CAPTEUR + "all";
export const UPDATE_CAPTEURS = LOCAL_HOST_CAPTEUR + "update";

export const GET_OFFRES = LOCAL_HOST + "/api/offres/student/";
export const GET_SALLE_BY_ID = LOCAL_HOST_SALLE;

<<<<<<< HEAD
export const GET_SALLE_OPTIMALE_JOBDATING = LOCAL_HOST + "/api/jobdating/salle-optimale/";
=======
export const LOCAL_HOST_MAP = LOCAL_HOST + "/api/map/";
export const GET_MAP_STATS = LOCAL_HOST_MAP + "stats";
export const INCREMENT_MAP_CONSULTATION = LOCAL_HOST_MAP + "stats/consultation";
>>>>>>> 4fd889d (Ajout statistiques map + backend stats)
