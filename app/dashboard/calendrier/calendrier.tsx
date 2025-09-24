import {
  getEnsWithGrade,
  getEnseignantsWithIndisponibilites,
  getJury,
  getSalles,
} from "@/lib/calendrier";
import { addMinutes, format, isValid, parse } from "date-fns";

import { NothingFound } from "@/components/nothing-found";

import { Generer } from "../_components/generer";
import { getPlanning } from "@/lib/planning";
import { Planning } from "../_components/planning";
import { getConfiguration } from "@/lib/configuration";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Regenerer } from "../_components/regeneration";
import { getVersions } from "@/lib/versions";
import { ComboboxDemo } from "../_components/versions";

type DateStr = string;
export type Soutenance = {
  idBinome: string;
  encadrant: string;
  salle?: string;
  date?: DateStr;
  heure?: string;
  president?: String;
  examinateurs?: String[];
};
export interface Salle {
  nom: string;
  indisponibilite?: DateStr[];
}
export interface IndisponibiliteJury {
  idJury: string;
  datesIndisponibles: string[];
}

export type ResultatPlanification = {
  resultats: Soutenance[];
};

export type Binome = {
  idBinome: string;
  theme?: string[];

  encadrant: string;
};
export type Enseignant = {
  nom: string;
  grade: string;
  specialite: string;
  poids: number;
};
export interface DatesIndisponibles {
  from: string;
  to: string;
}
export type planning = {
  salle: Sallee | null;
  date: string | null;
  heure: string | null;
  examinateurs: Examinateur[];
  Binome: Binomee | null;
  id: number;
  planningId: number;
  president: President | null;
};

export type Examinateur = {
  enseignant: {
    id: string;
    nom: string;
    prenom: string;
  };
};

export type Binomee = {
  Affectation: Affectation | null;
  etudiants: Etudiant[];
};
export interface Configuration {
  id: string;
  dateDebut: Date;
  dateFin: Date;
  heureDebut: string;
  heureFin: string;
  duree: string;
  departementId: string;
}

type Affectation = {
  Theme: {
    nom: string;
  } | null;
  encadrent: Enseignantt | null;
};

export type Etudiant = {
  nom: string;
  prenom: string;
};

export type President = {
  nom: string;
  prenom: string;
  id?: string;
};

export type Enseignantt = {
  nom: string;
  prenom: string;
  id: string;
};
export type Sallee = {
  id: string;
  bloc: number;
  numero: number;
};

export const Calendar = async () => {
  const planning: planning[] = await getPlanning();
  const versions = await getVersions();

  const configuration = await getConfiguration();

  //#######" transformer indispo ens ###############"
  const enseignantsWithIndisponibilites: DatesIndisponibles | any =
    await getEnseignantsWithIndisponibilites();

  const indisponibilitess: IndisponibiliteJury[] =
    enseignantsWithIndisponibilites.map(
      (enseignant: { datesIndisponibles: DatesIndisponibles; id: any }) => {
        const dates = [];
        const indispo = enseignant.datesIndisponibles;
        if (indispo) {
          const fromDate = parse(indispo.from, "dd/MM/yyyy", new Date());
          const toDate = parse(indispo.to, "dd/MM/yyyy", new Date());

          if (isValid(fromDate) && isValid(toDate)) {
            for (
              let currDate = fromDate;
              currDate <= toDate;
              currDate.setDate(currDate.getDate() + 1)
            ) {
              dates.push(format(currDate, "yyyy-MM-dd"));
            }
          }
        }
        return {
          idJury: enseignant.id,
          datesIndisponibles: dates,
        };
      }
    );
  //#######" transformer indispo ens ###############"

  //#######" transformer salle  ###############"
  const salless = await getSalles();
  const formattedSalles: Salle[] = salless.map((salle) => ({
    nom: salle.id,
    indisponibilite: [],
  }));
  //#######" transformer salle  ###############"
  //#######" transformer ens grade specialite list  ###############"
  const ensWithGradeWithSpecialite = await getEnsWithGrade();
  const enseignants: Enseignant[] = ensWithGradeWithSpecialite.map((ens) => ({
    nom: ens.id,
    grade: ens.grade,
    specialite: ens.specialite.nom,
    poids: ens._count.Affectation,
  }));

  //#######" transformer ens grade specialite list  ###############"
  //#######" transformer binome With Theme et Encadrant list  ###############"

  const binomesWithJury = await getJury();
  const binomess: Binome[] = binomesWithJury?.map((binome) => {
    const theme: string[] = [];

    binome.Affectation?.Theme?.themeSpecialites.map((j) => {
      theme.push(j.specialite.nom);
    });
    return {
      idBinome: binome.id,
      theme,
      encadrant: binome.Affectation?.encadrent?.id!,
    };
  });

  //#######" transformer binome With Theme et Encadrant list  ###############"

  if (planning.length > 0 && configuration) {
    return (
      <section className="">
        <ScrollArea className="m-4 mb-0 bg-white rounded-md p-4  h-[82vh]  ">
          <div className="flex justify-end gap-x-5 w-full items-center">
            {!!versions && <ComboboxDemo versions={versions} />}
            <Regenerer
              indisponibilites={indisponibilitess}
              salles={formattedSalles}
              binomes={binomess}
              enseignants={enseignants}
              configuration={configuration}
            />
          </div>
          <Planning resultat={planning} />
        </ScrollArea>
      </section>
    );
  }
  if (
    !binomesWithJury.length ||
    !configuration ||
    !salless.length ||
    !ensWithGradeWithSpecialite.length ||
    !enseignantsWithIndisponibilites.length
  ) {
    return (
      <main className="w-full h-full bg-white fex items-center justify-center">
        <NothingFound
          header={"Manque de données"}
          paragraph={
            "Veuillez entrer les enseignants, les binomes, les salles et la configuration "
          }
          src="/calendar.png"
        />
      </main>
    );
  }

  return (
    <Generer
      indisponibilites={indisponibilitess}
      salles={formattedSalles}
      binomes={binomess}
      enseignants={enseignants}
      configuration={configuration}
    />
  );
};
//################# ALOGORITHME ##########################

export function getDatesEtHorairesDisponibles(
  jurys: IndisponibiliteJury[],
  dateDebut: string,
  dateFin: string,
  heureDebut: string,
  heureFin: string,
  duree: string
): string[] {
  const datesEtHorairesDisponibles: string[] = [];

  const startDate = new Date(dateDebut);
  const endDate = new Date(dateFin);

  let currentDate = startDate;
  while (currentDate <= endDate) {
    const formattedDate = startDate.toLocaleDateString("fr-FR", {
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    if (formattedDate.startsWith("ven")) {
      // si vendredi passer a la date suivante
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      let isAvailablee: boolean = true;
      const currentDateTime = currentDate.toISOString();
      const [date, heure] = currentDateTime.split("T");
      // const horaireS = [
      //   `${date}T08:00:00`,
      //   `${date}T10:00:00`,
      //   `${date}T12:00:00`,
      //   `${date}T14:00:00`,
      // ];
      const horaireS = generateIntervals(date, heureDebut, heureFin, duree);
      // const horaireS = heurePermis(date, heureDebut, heureFin, duree, "00:15");
      datesEtHorairesDisponibles.push(...horaireS);
      for (let i = 0; i < jurys.length; i++) {
        if (jurys[i].datesIndisponibles.includes(date)) {
          currentDate.setDate(currentDate.getDate() + 1);
          for (let j = 0; j < horaireS.length; j++) {
            const index = datesEtHorairesDisponibles.indexOf(horaireS[j]);

            datesEtHorairesDisponibles.splice(index, 1);
          }
          isAvailablee = false;
          break;
        } else {
          for (let hor = 0; hor < horaireS.length; hor++) {
            if (
              jurys[i].datesIndisponibles.some((date) => date === horaireS[hor])
            ) {
              const index = datesEtHorairesDisponibles.indexOf(horaireS[hor]);
              if (index !== -1) {
                datesEtHorairesDisponibles.splice(index, 1);
              }
            }
          }
          isAvailablee = true;
        }
      }

      if (isAvailablee) {
        // Passer à la date suivante

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  return datesEtHorairesDisponibles;
}

//console.log("Dates et horaires disponibles :", datesEtHorairesDisponibles);

export function Plan(
  binomes: Binome[],
  enseignantss: Enseignant[],
  salles: Salle[],
  indisponibilites: IndisponibiliteJury[],
  dateDebut: DateStr,
  dateFin: DateStr,
  heureDebut: string,
  heureFin: string,
  dureeSoutenance: string
): ResultatPlanification {
  const resultats: Soutenance[] = [];
  let salleChoisie: [string, string] | null;

  let indisponibilitesJury: IndisponibiliteJury[] = indisponibilites;
  let indisponibilitesSalles: Salle[] = salles;

  for (const binome of binomes) {
    const enseignants = shuffleTeachers(enseignantss);
    // Affecter le président
    const enseignantWithoutEncadrant = enseignants.filter(
      (ens) => ens.nom !== binome.encadrant
    );
    let president = affecterEnseignantAvecPoidsLePlusFaible(
      filtrerEnseignants("PR", binome.theme!, enseignantWithoutEncadrant),
      binome.theme!
    );
    if (!president) {
      president = affecterEnseignantAvecPoidsLePlusFaible(
        filtrerEnseignants("MCA", binome.theme!, enseignants),
        binome.theme!
      );
    }
    if (!president) {
      president = affecterEnseignantAvecPoidsLePlusFaible(
        filtrerEnseignants("MCB", binome.theme!, enseignants),
        binome.theme!
      );
    }
    ///////////////////////////////////////////////////////////////////////
    //affecter examinateurs
    const examinateurs: string[] = [];
    let enseignantWithoutEncadrantAndPresident = enseignants.filter(
      (ens) => ens.nom !== binome.encadrant && ens.nom !== president?.nom
    );
    for (let i = 0; i < 2; i++) {
      const examinateur = affecterEnseignantAvecPoidsLePlusFaible(
        filtrerExaminateurs(
          binome.theme!,
          enseignantWithoutEncadrantAndPresident
        ),
        binome.theme!
      );

      if (examinateur) {
        if (examinateur.nom !== binome.encadrant) {
          examinateurs.push(examinateur.nom);
          enseignantWithoutEncadrantAndPresident =
            enseignantWithoutEncadrantAndPresident.filter(
              (ens) => ens.nom !== examinateur.nom
            );
          examinateur.poids++;
        }
      }
    }
    const tousLesJurys = [binome.encadrant, president?.nom, ...examinateurs];

    const juryBinome = indisponibilitesJury.filter((element) =>
      tousLesJurys.includes(element.idJury)
    );
    let plagesHorairesDisponibles = getDatesEtHorairesDisponibles(
      juryBinome,
      dateDebut,

      dateFin,
      heureDebut,
      heureFin,
      dureeSoutenance
    );

    // console.log(`iteration${binome} avec ${plagesHorairesDisponibles}`);
    if (plagesHorairesDisponibles.length > 0) {
      plagesHorairesDisponibles = [...plagesHorairesDisponibles].sort(
        () => Math.random() - 0.5
      );

      salleChoisie = trouverSalleDisponible(
        indisponibilitesSalles,
        plagesHorairesDisponibles
      );
      //  console.log(salleChoisie);
      if (salleChoisie?.length) {
        const dateObj = new Date(salleChoisie[1]);
        const date = dateObj.toISOString().split("T")[0];
        const heures = dateObj.getHours().toString().padStart(2, "0");
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        const heurePart = `${heures}:${minutes}`;
        resultats.push({
          idBinome: binome.idBinome,
          encadrant: binome.encadrant,
          president: president?.nom,
          examinateurs: examinateurs,
          salle: salleChoisie[0],
          date: date,
          heure: heurePart,
        });
        //update
        indisponibilitesJury = mettreAjourDispoJury(
          indisponibilitesJury,
          //@ts-ignore
          tousLesJurys,
          salleChoisie[1]
        );
        indisponibilitesSalles = metterAJourSalle(
          indisponibilitesSalles,
          salleChoisie[0],
          salleChoisie[1]
        );
        //console.log(indisponibilitesJury);
      } else {
        const dateObj = new Date(plagesHorairesDisponibles[0]);
        const date = dateObj.toISOString().split("T")[0];
        const heures = dateObj.getHours().toString().padStart(2, "0");
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        const heurePart = `${heures}:${minutes}`;
        // resultats.push(`${binome.idBinome} : aucune salle disponible`);
        resultats.push({
          idBinome: binome.idBinome,
          encadrant: binome.encadrant,
          president: president?.nom,
          examinateurs: examinateurs,

          date: date,
        });
        //update
        indisponibilitesJury = mettreAjourDispoJury(
          indisponibilitesJury,
          //@ts-ignore
          tousLesJurys,
          plagesHorairesDisponibles[0]
        );
      }
    } else {
      // resultats.push(
      //   `${binome.idBinome} : aucune date commune disponible pour les encadrant`
      // );
      resultats.push({
        idBinome: binome.idBinome,
        encadrant: binome.encadrant,
        president: president?.nom,
        examinateurs: examinateurs,
      });
    }

    //console.log(plagesHorairesDisponibles);
  }

  return { resultats };
}

function trouverPlageDisponible(
  salle: Salle,
  plagesHoraires: string[]
): string | null {
  if (salle.indisponibilite && salle.indisponibilite.length > 0) {
    for (const plageHoraire of plagesHoraires) {
      if (!salle.indisponibilite.includes(plageHoraire)) {
        return plageHoraire;
      }
    }
  } else {
    // Si salle.indisponibilite est vide retourner  la 1ere plage horaire disponible

    // const randomIndex = Math.floor(Math.random() * plagesHoraires.length);
    // return plagesHoraires[randomIndex];
    return plagesHoraires[0];
  }
  return null;
}

function melangerListeSalles(salles: Salle[]): Salle[] {
  return [...salles].sort(() => Math.random() - 0.5);
}

function trouverSalleDisponible(
  salles: Salle[],
  plagesHoraires: string[]
): [string, string] | null {
  const sallesMelangees = melangerListeSalles(salles);
  const plagesHorairesSansMillis: string[] = plagesHoraires.map(
    (plage) => plage.split(".")[0]
  );
  //console.log(plagesHorairesSansMillis);

  for (const salle of sallesMelangees) {
    const plageDisponible = trouverPlageDisponible(
      salle,
      plagesHorairesSansMillis
    );
    if (plageDisponible !== null) {
      return [salle.nom, plageDisponible];
    }
  }
  return null;
}

function mettreAjourDispoJury(
  indisponibilites: IndisponibiliteJury[],
  jurys: string[],
  date: string
): IndisponibiliteJury[] {
  if (!jurys) {
    return indisponibilites;
  }
  // Itérer sur chaque membre
  jurys?.forEach((encadrant) => {
    // Trouver l'indice de l'indisponibilité de l encadrant
    const index = indisponibilites.findIndex(
      (indisponibilite) => indisponibilite.idJury === encadrant
    );

    // Si l'indisponibilité de l encadrant est trouvée
    if (index !== -1) {
      // Vérifier si la date existe déjà
      const dateExisteDeja = indisponibilites[index].datesIndisponibles.some(
        (dateIndisponible) => dateIndisponible === date
      );

      // Si la date n'existe pas deja l'ajouter
      if (!dateExisteDeja) {
        indisponibilites[index].datesIndisponibles.push(date);
      }
    }
  });

  // console.log(indisponibilites);
  return indisponibilites;
}

function metterAJourSalle(salles: Salle[], nomSalle: string, date: string) {
  const salle = salles.find((salle) => salle.nom === nomSalle);

  if (!salle) {
    throw new Error(`La salle ${nomSalle} n'existe pas.`);
  }

  const dateExisteDeja = salle.indisponibilite!.some(
    (dateIndisponible) => dateIndisponible === date
  );

  if (!dateExisteDeja) {
    salle.indisponibilite!.push(date);
  }

  return salles;
}

function filtrerExaminateurs(
  specialites: string[],
  enseignants: Enseignant[]
): Enseignant[] {
  return enseignants.filter((enseignant) =>
    specialites.some((specialite) => enseignant.specialite.includes(specialite))
  );
}
function filtrerEnseignants(
  grade: string,
  specialites: string[],
  enseignants: Enseignant[]
): Enseignant[] {
  return enseignants.filter(
    (enseignant) =>
      enseignant.grade === grade &&
      specialites.some((specialite) =>
        enseignant.specialite.includes(specialite)
      )
  );
}
function affecterEnseignantAvecPoidsLePlusFaible(
  enseignants: Enseignant[],
  specialites: string[]
): Enseignant | undefined {
  if (enseignants.length === 0) {
    return undefined;
  }

  const sortedEnseignants = enseignants.sort((a, b) => a.poids - b.poids);
  return sortedEnseignants[0];
}

function shuffleTeachers(enseignants: Enseignant[]) {
  const shuffledEnseignants = [...enseignants];

  for (let i = shuffledEnseignants.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledEnseignants[i], shuffledEnseignants[randomIndex]] = [
      shuffledEnseignants[randomIndex],
      shuffledEnseignants[i],
    ];
  }

  return shuffledEnseignants;
}

function convertDurationToMinutes(duree: string): number {
  const [hoursStr, minutesStr] = duree.split(":");

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  return hours * 60 + minutes;
}
function generateIntervals(
  baseDate: string,
  startTime: string,
  endTime: string,
  duree: string
): string[] {
  const durationInMinutes = convertDurationToMinutes(duree);
  const startDate = parse(
    `${baseDate} ${startTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const endDate = parse(
    `${baseDate} ${endTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  const intervals: string[] = [];

  let currentTime = startDate;

  while (currentTime < endDate) {
    const formattedDate = format(currentTime, "yyyy-MM-dd'T'HH:mm:ss");
    intervals.push(formattedDate);

    // Ajouter la durée à la date actuelle pour obtenir le prochain intervalle
    currentTime = addMinutes(currentTime, durationInMinutes);
  }

  return intervals;
}
