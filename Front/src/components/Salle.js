import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Salle.css";
import { GET_SALLES, LOCAL_HOST_SALLE } from "../constants/back";

export default function Salle() {
  const [salles, setSalles] = useState([]);
  const [scoreResults, setScoreResults] = useState({});
  // Implémentation de nos nouvelles constantes afin de gérer l'attribution des salles
  const [nbPersonnes, setNbPersonnes] = useState();
  const [tp, setTp] = useState(false);
  const [calculResults, setCalculResults] = useState([]);
  // Constantes pour la fenetre de log au lieu de faire des alertes
  const [logWindow, setLogWindow] = useState(null);

  // Constantes pour notre simulation
  const [simDate] = useState(new Date().toISOString().slice(0, 10));
  const [simSequence, setSimSequence] = useState("jour");
  const [simResults, setSimResults] = useState([]);
  const [simColonnes, setSimColonnes] = useState([]);
  const [simScoreType, setSimScoreType] = useState("energie");


  // Charger les salles
  const loadSalles = async () => {
    axios
      .get(GET_SALLES)    // c'est via le GET qu'on va pouvoir récuperer les salles
      .then((response) => {
        setSalles(response.data);
        loadScores(response.data);
      })
      .catch((error) => {
        alert("Erreur lors du chargement des salles : " + error);
      });
  };

  // Charger les scores énergétiques
  const loadScores = (sallesData) => {
    sallesData.forEach((salle) => {
      axios
        .get(`${LOCAL_HOST_SALLE}score/${salle.idSalle}`)
        .then((res) => {
          setScoreResults((prev) => ({
            ...prev,
            [salle.idSalle]: res.data,
          }));
        })
        .catch((err) => {
          console.error("Erreur chargement du score énergétique :", err);
          setScoreResults((prev) => ({
            ...prev,
            [salle.idSalle]: null,
          }));
        });
    });
  };

  useEffect(() => {
    loadSalles();
  }, []);

  // On cree notre fenetre qui acceuillera nos logs
  useEffect(() => {
    if (!logWindow) return;
    const interval = setInterval(() => {
      axios.get(`${LOCAL_HOST_SALLE}logs`).then((res) => {
        if (!logWindow.closed) {
          logWindow.document.body.innerHTML = res.data.join("<br/>");
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [logWindow]);

  const ouvrirLogs = () => {
    const win = window.open("", "logsWindow", "width=700,height=500");
    setLogWindow(win);
  };

  if (salles.length === 0)    // au début, j'ai essayé avec isEmpty() mais non gérer dans JS
    return <div className="container text-center">No salles</div>;

  // Fonction pour retourner la lettre selon le score énergétique
  const getEnergyLetter = (score) => {
    if (score >= 85) return "A";
    if (score >= 70) return "B";
    if (score >= 50) return "C";
    if (score >= 30) return "D";
    return "E";
  };

  // Fonction pour retourner la lettre selon le score de confort
  const getComfortLetter = (score) => {
    if (score >= 85) return "A";
    if (score >= 70) return "B";
    if (score >= 50) return "C";
    if (score >= 30) return "D";
    return "E";
  };

  // Fonction pour retourner la lettre selon le score global, même principe 
  // que pour les autres scores
  const getGlobalLetter = (score) => {
    if (score >= 85) return "A";
    if (score >= 70) return "B";
    if (score >= 50) return "C";
    if (score >= 30) return "D";
    return "E";
  };

  // Permets de mettre en place notre attribution de salle à venir
  const calcSalles = async () => {
    axios
      .get(`${LOCAL_HOST_SALLE}forms?nbPersonnes=${nbPersonnes}&tp=${tp}`)
      .then((res) => {
        setCalculResults(res.data);
        loadScores(res.data);
        // on se base sur la méthode précédente, 
        // pour avoir les mêmes datas
      })
      .catch((err) => {
        alert("Erreur lors du calcul d'attribution : " + err);
      });
  };

  // Juste pour appeler directement nos coleurs par la suite dans nos exemples
  const getColor = (score) => {
    if (score >= 70) return "green";
    if (score >= 50) return "orange";
    return "red";
  };

  // Ajout de la méthode de la simulation
  const lancerSimulation = async () => {
    setSimResults([]);
    const jours = [];
    const nbJours =
      simSequence === "jour" ? 1 :
        simSequence === "semaine" ? 7 :
          14;

    for (let i = 0; i < nbJours; i++) {
      const dt = new Date(simDate + "T12:00"); // cela permet de compenser le décallage horaire, en effet, j'étais toujours en retard
      // de 1j
      dt.setDate(dt.getDate() + i);
      jours.push({
        // initialisation de la date, on recupere les 10 premiers elements de l'iso puis on choisit le format d'affichage
        label: dt.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }),
        date: dt.toISOString().slice(0, 10)
      });
    }
    setSimColonnes(jours);

    // initialisation des différentes sequences de la journée, on les affilie a des heures
    const periodes = [
      { key: "MATIN", label: "Matin", heure: "T08:00" },
      { key: "APRES_MIDI", label: "Après-M.", heure: "T14:00" },
      { key: "SOIR", label: "Soir", heure: "T20:00" },
    ];

    const promises = salles.map(async (salle) => {
      const scoresParPeriode = await Promise.all(
        periodes.map(async (periode) => {
          const scoresParJour = await Promise.all(
            jours.map(({ date }) =>
              axios.get(`${LOCAL_HOST_SALLE}${salle.idSalle}/score/simulation?dateTime=${date + periode.heure}`)
                .then(r => r.data)
                .catch(() => null)
            )
          );
          return { ...periode, scoresParJour };
        })
      );
      return { salle, scoresParPeriode };
    });

    
    const res = await Promise.all(promises);
    setSimResults(res);
  };

  const ouvrirDetailsTempHum = () => {
    const win = window.open("", "_blank", "width=1100,height=700");

    const nbJours =
      simSequence === "jour" ? 1 :
        simSequence === "semaine" ? 7 :
          14;

    const jours = [];
    for (let i = 0; i < nbJours; i++) {
      const dt = new Date(simDate + "T12:00");
      dt.setDate(dt.getDate() + i);
      jours.push({
        label: dt.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }), // il s'agit simplement des paramètres 
        // pour nos en-têtes de colonnes
        date: dt.toISOString().slice(0, 10) // cette méthode permet de récupérer une date sous un certain format, dans notre cas ISO, d'en garder 
        // seulement les 10 premiers caractères car c'est la forme que l'on souhiate
      });
    }

    // on utilisera uniquement ces trois sequences
    const periodesAffichees = ["MATIN", "APRES_MIDI", "SOIR"];

    let html = `
    <html>
    <head>
    <title>Températures & Humidités</title>
    <style>    
      h2 { text-align: center; }
      p { text-align: center; }
      table { border-collapse: collapse; width: 100%; font-size: 13px; }
      th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: center; }
      thead { background: #2c3e50; color: white; }
      .matin { background: #fff9e6; }
      .apres { background: #e6f0ff; }
      .soir  { background: #f0ffe6; }
      .salle { font-weight: bold; background: #f5f5f5; }
      .separateur td { background: #ddd; height: 4px; }
    </style>
    </head>
    <body>
    <h2>Températures & Humidités par salle</h2>
    <p>Séquence : <strong>${simSequence}</strong> — Du ${new Date(simDate + "T00:00").toLocaleDateString("fr-FR")} ${nbJours > 1 ? `sur ${nbJours} jour(s)` : ""}</p>
    <table>
      <thead>
        <tr>
          <th>Salle</th>
          <th>Période</th>
          ${jours.map(function (jour) {
      return `<th>${jour.label}</th>`;
    }).join("")}
        </tr>
      </thead>
      <tbody>
  `;

    const fetchAll = async () => {
      for (const salle of salles) {
        for (const periode of periodesAffichees) {

          let heure;
          if (periode === "MATIN") {
            heure = "T08:00";       // heure du matin où l'on va relever les infos
          } else if (periode === "APRES_MIDI") {
            heure = "T14:00";       // heure de l'après-midi où l'on va relever les infos
          } else {
            heure = "T20:00";       // heure du soir où l'on va relever les infos
          }

          let classPeriode;
          if (periode === "MATIN") {  // on mets juste en forme nos colonnes et autre
            classPeriode = "matin";
          } else if (periode === "APRES_MIDI") {
            classPeriode = "apres-midi";
          } else {
            classPeriode = "soir";
          }

          let labelPeriode;
          if (periode === "MATIN") {
            labelPeriode = "Matin";
          } else if (periode === "APRES_MIDI") {
            labelPeriode = "Après-midi";
          } else {
            labelPeriode = "Soir";
          }

          // ici on va tester toutes les cellules en même temps puis on attend qu'elles soient toutes finies
          const cellules = await Promise.all(
            jours.map(async ({ date }) => {
              const dateTime = date + heure;
              try {
                const res = await axios.get(`${LOCAL_HOST_SALLE}${salle.idSalle}/score/simulation?dateTime=${dateTime}`);
                const temp = res.data.temperature != null ? `${res.data.temperature.toFixed(1)}°C` : "N/A";
                const hum = res.data.humidite != null ? `${res.data.humidite.toFixed(1)}%` : "N/A";
                return `<td class="${classPeriode}">${temp}<br/><small>${hum}</small></td>`;
              } catch {
                return `<td>N/A</td>`;
              }
            })
          );

          html += `
          <tr>
            <td class="salle">${periode !== "MATIN" ? "" : salle.nomSalle}</td>
            <td class="${classPeriode}">${labelPeriode}</td>
            ${cellules.join("")}
          </tr>
        `;
        }
        // mise en place d'un séparateur pour rendre plus lisible notre tableau
        html += `<tr class="separateur"><td colspan="${jours.length + 2}"></td></tr>`;
      }

      html += `</tbody></table></body></html>`;
      win.document.write(html);
      win.document.close();
    };

    fetchAll();
  };

  // Tableau avec les salles et leurs scores
  return (
    <div className="container text-center">
      <h4 className="mx-2">Liste des salles de l'école</h4>
      <div className="row">
        <table className="table table-sm table-bordered table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Capacité</th>
              <th>TP</th>
              <th>Surface</th>
              <th>Fenêtres</th>
              <th>Orientation</th>
              <th>Chauffage</th>
              <th>Température</th>
              <th>Humidité</th>
              <th>Score énergétique</th>
              <th>Score confort</th>
              <th>Score CO²</th>
            </tr>
          </thead>

          <tbody>
            {salles.map((salle, index) => {
              const result = scoreResults[salle.idSalle];
              const dE = result?.detailsEnergie || {};  // on renomme notre varaible "d"
              // pour acceuillir confort également
              const dC = result?.detailsConfort || {};

              const energyLetter =
                result?.scoreEnergie != null ? getEnergyLetter(result.scoreEnergie) : "";

              const confortLetter =
                result?.scoreConfort != null ? getComfortLetter(result.scoreConfort) : "";

              return (
                <tr key={index}>
                  <td>{salle.idSalle}</td>
                  <td>{salle.nomSalle}</td>
                  <td>{salle.capacite} personnes</td>
                  <td>{salle.estSalleTp ? "Oui" : "Non"}</td>
                  <td>{salle.surfaceM2} m²</td>
                  <td>{salle.nbFenetres}</td>
                  <td>{salle.orientation}</td>
                  <td>{salle.chauffage ? "Oui" : "Non"}</td>
                  <td>{result?.temperature} °C</td>
                  <td>{result?.humidite} %</td>

                  <td>
                    {result?.scoreEnergie != null
                      ? `${result.scoreEnergie.toFixed(0)} (${energyLetter})`
                      : "Chargement..."}

                    {/* Retrait des alerts et des boutons afin de, clarifier notre tableau qui était tout plein de boutons, et également mettre tous les logs dans une nouvelle fenetre 
                    --> demandé par M. Brenner*/}

                  </td>

                  <td>
                    {result?.scoreConfort != null
                      ? `${result.scoreConfort.toFixed(0)} (${confortLetter})`
                      : "Chargement..."}
                  </td>

                  <td>
                    {result?.scoreCO2 != null ? `${result.scoreCO2} / 100` : "N/A"}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mb-5">
          <button className="btn btn-warning" onClick={ouvrirLogs}>
            Voir les détails de calcul
          </button>
        </div>

        <div className="mb-3">
          <h5>Calcul de salle - en fonction de l'occupation prévue</h5>

          <input
            type="number"
            placeholder="Nombre de personnes" // Valeur dans notre case pour renseigner la valeur à enregistrer 
            value={nbPersonnes}
            onChange={(e) => setNbPersonnes(e.target.value)}
          />

          <label className="ms-2">
            Salle de TP
            <input
              className="ms-2" // permet de mettre une marge et rendre la box plus visible
              type="checkbox"
              checked={tp}
              onChange={(e) => setTp(e.target.checked)}
            />
          </label>

          <button className="btn btn-secondary ms-2" onClick={calcSalles}>
            Calculer
          </button>
        </div>

        <button
          // Ce bouton remet tous les paramètres dans leur format initial
          className="btn btn-outline-secondary"
          onClick={() => {
            setCalculResults([]);
            setNbPersonnes("");
            setTp(false);
          }}
        >
          Réinitialiser
        </button>
        {calculResults.length > 0 && (
          // on affiche le tableau si on a des éléments sont présents dans notre result
          <div className="mt-4">
            <h5>Résultat du calcul global en fonction de l'occupation </h5>

            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Salle</th>
                  <th>Capacité</th>
                  <th>TD</th>
                  <th>Score énergétique</th>
                  <th>Score confort</th>
                  <th>Score CO²</th>
                  <th>Score global</th>
                </tr>
              </thead>

              <tbody>
                {calculResults
                  .sort((a, b) => {
                    // basée sur une méthode Array que j'ai trouvé sur un forum qui permet d'étudier deux éléments qui 
                    // se suivent dans une liste. Si la soustraction de A et B est positive alors, décroissant !
                    const A = (scoreResults[a.idSalle]?.scoreEnergie) + (scoreResults[a.idSalle]?.scoreConfort) + (scoreResults[a.idSalle]?.scoreCO2);
                    const B = (scoreResults[b.idSalle]?.scoreEnergie) + (scoreResults[b.idSalle]?.scoreConfort) + (scoreResults[b.idSalle]?.scoreCO2);
                    return B - A;
                  })

                  .map((salle) => {
                    const result = scoreResults[salle.idSalle];
                    const energyScore = result?.scoreEnergie;
                    const confortScore = result?.scoreConfort;
                    const CO2Score = result?.scoreCO2;
                    const globalScore = (result.scoreEnergie + result.scoreConfort + result.scoreCO2) / 3;
                    const energyLetter = getEnergyLetter(energyScore);
                    const confortLetter = getComfortLetter(confortScore);
                    const globalLetter = getGlobalLetter(globalScore);

                    return (
                      <tr key={salle.idSalle}>
                        <td>{salle.nomSalle}</td>
                        <td>{salle.capacite} personnes</td>
                        <td>{salle.estSalleTp ? "Oui" : "Non"}</td>
                        {/* Le != permet de dire que cette valeur ne peut etre nulle ou non defini et force 
                        donc l'affichage, même du 0*/}
                        <td>{energyScore != null ? `${energyScore.toFixed(0)} (${energyLetter})` : "N/A"}</td>
                        <td>{confortScore != null ? `${confortScore.toFixed(0)} (${confortLetter})` : "N/A"}</td>
                        <td>{CO2Score != null ? `${CO2Score.toFixed(0)} / 100` : "N/A"}</td>
                        <td>{globalScore != null ? `${globalScore.toFixed(0)} (${globalLetter})` : "N/A"}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 mb-5">
          <h5>Simulation temporelle</h5>

          <div className="mb-3 d-flex justify-content-center align-items-center gap-3">
            <div>
              <label className="me-2">Date du jour :</label>
              <input
                type="date"
                value={new Date().toISOString().slice(0, 10)}
                readOnly
                style={{ background: "#f5f5f5", cursor: "not-allowed" }}
              />
            </div>
            <div>
              <label className="me-2">Séquence :</label>
              <select
                value={simSequence}
                onChange={e => setSimSequence(e.target.value)}
              >
                <option value="jour">Par jour (1 jour – matin/après-midi/soir)</option>
                <option value="semaine">Par semaine (7 jours – matin/après-midi/soir)</option>
                <option value="2semaines">Par 2 semaines (14 jours – matin/après-midi/soir)</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={lancerSimulation}>
              Lancer la simulation
            </button>
          </div>

          {simResults.length > 0 && (
            <>
              <div className="mb-2">
                <label className="me-2">Afficher :</label>
                <select value={simScoreType} onChange={e => setSimScoreType(e.target.value)}>
                  <option value="energie">Score Énergie</option>
                  <option value="confort">Score Confort</option>
                  <option value="co2">Score CO²</option>
                </select>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="table table-sm table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Salle</th>
                      <th>Période</th>
                      {simColonnes.map((j, i) => <th key={i}>{j.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {simResults.map(({ salle, scoresParPeriode }) => (
                      <React.Fragment key={salle.idSalle}>
                        {scoresParPeriode.map((periode, daytab) => {
                          const bgColor =
                            periode.key === "MATIN" ? "#fff9e6" :
                              periode.key === "APRES_MIDI" ? "#e6f0ff" :
                                "#f0ffe6";
                          return (
                            <tr key={daytab}>
                              <td style={{ fontWeight: "bold", background: "#f5f5f5" }}>
                                {daytab === 0 ? salle.nomSalle : ""}
                              </td>
                              <td style={{ background: bgColor }}>{periode.label}</td>
                              {periode.scoresParJour.map((data, ji) => {
                                if (!data) return <td key={ji} style={{ color: "gray" }}>N/A</td>;
                                const score =
                                  simScoreType === "confort" ? data.scoreConfort :
                                    simScoreType === "co2" ? data.scoreCO2 :
                                      data.scoreEnergie;
                                const s = score ?? 0;
                                return (
                                  <td key={ji} style={{ background: bgColor, color: getColor(s), fontWeight: "bold" }}>
                                    {s.toFixed(0)}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                        {/* On ajoute un colonne horizontale afin de séparer nos colonnes sinon ça perd en lisibilité */}
                        <tr>
                          <td colSpan={2 + simColonnes.length} style={{ background: "#ddd", height: "4px", padding: 0 }} />
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-2 d-flex justify-content-center gap-4">
                <span style={{ color: "green" }}>Bon (≥ 70)</span>
                <span style={{ color: "orange" }}>Moyen (50-69)</span>
                <span style={{ color: "red" }}>Faible (&lt; 50)</span>
              </div>

              <div className="mt-3">
                <button className="btn btn-outline-dark" onClick={ouvrirDetailsTempHum}>
                  Voir températures & humidités détaillées
                </button>
              </div>
            </>
          )}

        </div>
        <button
          className="btn btn-secondary mt-4 mb-4"
          // on a rajouté une marge en bas pour rendre le bouton 
          // plus visible, avant il était collé au bas de la page ...
          onClick={() => window.open("/docs/norms.pdf")}
        >
          Documentation - normalisation et du calcul de score
        </button>
      </div>
    </div>
  );
}
