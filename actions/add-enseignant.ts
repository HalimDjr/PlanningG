"use server";

import { db } from "@/lib/db";
import { currentUser } from "../lib/current-user";

import { ExtendedUser } from "@/next-auth";
import { revalidatePath } from "next/cache";
import { DataItemBinome } from "@/hooks/useStore";
import {
  DatesIndisponibles,
  IndisponibiliteJury,
} from "@/app/dashboard/calendrier/calendrier";
import { getEnseignantsWithIndisponibilites } from "@/lib/calendrier";
import { format, isValid, parse, parseISO } from "date-fns";
import { Soutenance } from "@prisma/client";
import { binomesSchema } from "@/schemas";
import { z } from "zod";
import { User } from "lucide-react";

export const getSpecialite = async (name: string, user: ExtendedUser) => {
  const existingSpecialite = await db.specialite.findUnique({
    where: { nom: name.toUpperCase() },
  });
  if (existingSpecialite) return existingSpecialite.id;

  const specialite = await db.specialite.create({
    data: {
      nom: name.toUpperCase(),
      departementId: user?.departementId,
    },
  });

  return specialite.id;
};

export const addEnseignants = async (specialite: string, data: any) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const specialiteId = await getSpecialite(specialite.toUpperCase(), user);
  if (!specialiteId) {
    return { error: "Spécialitée manquante" };
  }
  const existingEnseingant = await db.enseignant.findFirst({
    where: {
      email: data.email,
      departementId: user.departementId,
    },
  });

  try {
    if (!existingEnseingant) {
      const ens = await db.enseignant.create({
        data: {
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          grade: data.grade.toUpperCase(),
          matricule: data.matricule,
          specialiteId: specialiteId,
          departementId: user.departementId,
        },
      });
      // } else {
      //   await db.enseignant.update({
      //     where: {
      //       email: existingEnseingant.email,
      //     },
      //     data: {
      //       nom: data.nom,
      //       prenom: data.prenom,
      //       grade: data.grade,
      //       matricule: data.matricule,
      //       specialiteId: specialiteId,
      //       departementId: user.departementId,
      //     },
      //   });
    }
    revalidatePath("/dashboard/enseignants");
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Veuillez réessayer" };
  }
};

export const addEtudiants = async (specialite: string, data: any) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const specialiteId = await getSpecialite(specialite.toUpperCase(), user);
  if (!specialiteId) {
    return { error: "Spécialité manquante" };
  }
  const existingEtudiant = await db.etudiant.findFirst({
    where: {
      email: data.email,
      departementId: user.departementId,
    },
  });

  try {
    if (!existingEtudiant) {
      const etud = await db.etudiant.create({
        //@ts-ignore
        data: {
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,

          matricule: data.matricule,
          specialiteId: specialiteId,
          departementId: user.departementId,
        },
      });
    }
    revalidatePath("/dashboard/etudiant");
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Veuillez réessayer" };
  }
};

export const addEnseignant = async (
  specialite: string,
  grade: string,
  data: any
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const specialiteId = await getSpecialite(specialite.toUpperCase(), user);
  if (!specialiteId) {
    return { error: "Spécialité manquante" };
  }
  const existingEnseingant = await db.enseignant.findFirst({
    where: {
      email: data.email,
      departementId: user.departementId,
    },
  });

  try {
    if (!existingEnseingant) {
      const ens = await db.enseignant.create({
        data: {
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          grade: grade,
          matricule: data.matricule,
          specialiteId: specialiteId,
          departementId: user.departementId,
        },
      });
    } else {
      return { error: "Enseignant(e) existe déjà" };
    }
    revalidatePath("/dashboard/enseignant");
    return { success: "Enseignant(e) ajouté!" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Veuillez réessayer" };
  }
};

export const editEnseignant = async (
  specialite: string,
  grade: string,
  email: string,
  data: any
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const specialiteId = await getSpecialite(specialite.toUpperCase(), user);
  if (!specialiteId) {
    return { error: "Spécialité manquante" };
  }

  const existingEnseingant = await db.enseignant.findFirst({
    where: {
      email: data.email,
      departementId: user.departementId,
    },
  });
  if (data.email.trim() !== email.trim() && existingEnseingant) {
    return { error: "Enseignant(e) existe déjà" };
  } else {
    try {
      await db.enseignant.update({
        where: {
          email: email,
        },
        data: {
          email: data.email.trim(),
          nom: data.nom,
          prenom: data.prenom,
          grade: grade,
          matricule: data.matricule,
          specialiteId: specialiteId,
        },
      });
      revalidatePath("/dashboard/enseignant");
      return { success: "Modifications enregistrées!" };
    } catch (error) {
      return { error: "Veuillez réessayer" };
    }
  }
};

export const editEtudiant = async (
  specialite: string,

  email: string,
  data: any
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const specialiteId = await getSpecialite(specialite.toUpperCase(), user);
  if (!specialiteId) {
    return { error: "Spécialité manquante" };
  }

  const existingEnseingant = await db.etudiant.findFirst({
    where: {
      email: data.email,
      departementId: user.departementId,
    },
  });
  if (data.email.trim() !== email.trim() && existingEnseingant) {
    return { error: "Etudiant(e) existe déjà" };
  } else {
    try {
      await db.etudiant.update({
        where: {
          email: email,
        },
        data: {
          email: data.email.trim(),
          nom: data.nom,
          prenom: data.prenom,

          matricule: data.matricule,
          specialiteId: specialiteId,
        },
      });
      revalidatePath("/dashboard/etudiants");
      return { success: "Modifications enregistrées!" };
    } catch (error) {
      return { error: "Veuillez réessayer" };
    }
  }
};
export const addEtudiant = async (specialite: string, dataa: any) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const specialiteId = await getSpecialite(specialite.toUpperCase(), user);
  if (!specialiteId) {
    return { error: "Spécialité manquante" };
  }
  const existingEtudiant = await db.etudiant.findFirst({
    where: {
      email: dataa.email,
      departementId: user.departementId,
    },
  });

  try {
    if (!existingEtudiant) {
      await db.etudiant.create({
        data: {
          nom: dataa.nom,
          prenom: dataa.prenom,
          email: dataa.email,

          matricule: dataa.matricule,
          specialiteId: specialiteId,
          departementId: user.departementId,
        },
      });
    } else {
      return { error: "Etudiant existe déjà" };
    }
    revalidatePath("/dashboard/etudiants");
    return { success: "Etudiant ajouté!" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Veuillez réessayer" };
  }
};

export const addBinomes = async (values: z.infer<typeof binomesSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!values.matricule1 && !values.matricule2) {
    return { error: "Vous devez insérer les informations d'abord" };
  }
  const existingEtudiant1 = await db.etudiant.findFirst({
    where: {
      matricule: values.matricule1,
      departementId: user.departementId,
    },
  });
  if (!values.matricule2) {
    if (existingEtudiant1) {
      const existBinome = await db.binome.findFirst({
        where: {
          etudiants: {
            some: {
              id: existingEtudiant1.id,
            },
          },
        },
      });
      if (!existBinome) {
        const binome = await db.binome.create({
          data: {
            etudiants: { connect: [{ id: existingEtudiant1.id }] },
          },
        });
        if (binome) {
          await db.etudiant.update({
            where: { id: existingEtudiant1.id },
            data: { idBinome: binome.id },
          });
        }

        revalidatePath("/dashboard/binomes");
        return { success: "Binome inséré!" };
      } else {
        return {
          error: `Etudiant déjà inséré à un autre binome`,
        };
      }
    } else {
      return {
        error: `Vous devez insérer cet etudiants d'abord`,
      };
    }
  } else {
    const existingEtudiant2 = await db.etudiant.findFirst({
      where: {
        matricule: values.matricule2,
        departementId: user.departementId,
      },
    });
    if (existingEtudiant1 && existingEtudiant2) {
      const existBinome = await db.binome.findFirst({
        where: {
          etudiants: {
            some: {
              OR: [{ id: existingEtudiant1.id }, { id: existingEtudiant2.id }],
            },
          },
        },
      });
      if (!existBinome) {
        const binome = await db.binome.create({
          data: {
            etudiants: {
              // Connect les deux étudiants existants
              connect: [
                { id: existingEtudiant1.id },
                { id: existingEtudiant2.id },
              ],
            },
          },
        });
        if (binome) {
          await db.etudiant.update({
            where: { id: existingEtudiant1.id },
            data: { idBinome: binome.id },
          });

          await db.etudiant.update({
            where: { id: existingEtudiant2.id },
            data: { idBinome: binome.id },
          });
        }
      }

      return { success: "Binomes insérés!" };
    }
    if (!existingEtudiant2) {
      return {
        error: `Vous devez insérer cet étudiants d'abord`,
      };
    }
  }

  revalidatePath("/dashboard/binomes");
  return { success: "" };
};

export const editBinome = async (
  matricule1: string,
  values: z.infer<typeof binomesSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!values.matricule1 && !values.matricule2) {
    return { error: "Vous devez insérer les informations d'abord" };
  }

  const oldBinome = await db.binome.findFirst({
    where: {
      etudiants: {
        some: {
          matricule: matricule1,
        },
      },
    },
  });
  const existingEtudiant1 = await db.etudiant.findFirst({
    where: {
      matricule: values.matricule1,
      departementId: user.departementId,
    },
    select: {
      id: true,
    },
  });

  if (values.matricule2) {
    const existingEtudiant2 = await db.etudiant.findFirst({
      where: {
        matricule: values.matricule2,
        departementId: user.departementId,
      },
      select: {
        id: true,
      },
    });

    if (!existingEtudiant1 || !existingEtudiant2) {
      return { error: "Etudiants non existés" };
    }
    const binome = await db.binome.update({
      where: {
        id: oldBinome?.id,
      },
      data: {
        etudiants: {
          connect: [{ id: existingEtudiant1.id }, { id: existingEtudiant2.id }],
        },
      },
    });
    revalidatePath("/dashboard/binomes");
    return { success: "Modifications inséré!" };
  }

  if (!existingEtudiant1) {
    return { error: "Etudiants non existés" };
  }
  const binome = await db.binome.update({
    where: {
      id: oldBinome?.id,
    },
    data: {
      etudiants: { connect: [{ id: existingEtudiant1.id }] },
    },
  });

  revalidatePath("/dashboard/binomes");
  return { success: "" };
};

export const getDateDisponibleEncadrant = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const configuration = await db.configuration.findUnique({
    where: {
      departementId: user.departementId,
    },
    select: {
      dateDebut: true,
      dateFin: true,
    },
  });
  const allDates: string[] = [];
  if (configuration) {
    const dateDebut = configuration.dateDebut;
    const dateFin = configuration.dateFin;
    // const startDate = parseISO(dateDebut);
    // const endDate = parseISO(dateFin);

    const a = new Date(format(dateDebut, "yyyy-MM-dd"));
    const b = new Date(format(dateFin, "yyyy-MM-dd"));

    let currentDate = new Date(a);

    while (currentDate <= b) {
      const formattedDate = currentDate.toISOString().slice(0, 10);
      allDates.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  const enseignant = await db.enseignant.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      datesIndisponibles: true,
    },
  });
  const dates: string[] = [];
  //@ts-ignore
  const indispo: DatesIndisponibles = enseignant?.datesIndisponibles;
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

  return { success: allDates.filter((item) => !dates.includes(item)) };
};
export const getHeureDisponibleEncadrant = async (
  idEncadrant: string | undefined,
  idPlanning: number | undefined,
  date: string | undefined | null,
  soutenanceId: number | undefined
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!idEncadrant || !idPlanning || !date || !soutenanceId) {
    return { error: "Veuillez choisir la date" };
  }

  const configuration = await db.configuration.findUnique({
    where: {
      departementId: user.departementId,
    },
    select: {
      heureDebut: true,
      heureFin: true,
      duree: true,
    },
  });
  let allHours: string[] = [];

  if (configuration) {
    allHours = generateIntervals(
      configuration.duree,
      configuration.heureDebut,
      configuration.heureFin
    );
  }

  const enseignant = await db.soutenance.findMany({
    where: {
      planningId: idPlanning,
      id: {
        not: soutenanceId,
      },

      AND: [
        { date: date },

        {
          OR: [
            { presidentId: idEncadrant },
            {
              examinateurs: {
                some: {
                  enseignnatId: idEncadrant,
                },
              },
            },
            {
              Binome: {
                Affectation: {
                  encadrantId: idEncadrant,
                },
              },
            },
          ],
        },
      ],
    },
    select: {
      heure: true,
    },
  });
  const heuresList = enseignant
    ?.filter((soutenance) => soutenance.heure !== null)
    .map((soutenance) => soutenance.heure);
  allHours = allHours.filter((item) => !heuresList?.includes(item));

  return { success: allHours.filter((item) => !heuresList?.includes(item)) };
};
export const getAllEnseignants = async (
  date: string | null | undefined,
  heure: string | null | undefined,
  id: number | undefined,
  soutenanceId: number | undefined
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  //#######" transformer indispo ens ###############"
  const enseignantsWithIndisponibilites: DatesIndisponibles | any =
    await getEnseignantsWithIndisponibilites();

  let indisponibilitess: IndisponibiliteJury[] =
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

  if (!date || !heure) return { error: "Manque date et heure" };

  const hasDateIndipo = indisponibilitess
    .filter((ind) => ind.datesIndisponibles.includes(date))
    .map((i) => i.idJury);

  const enseignants = await db.enseignant.findMany({
    where: {
      departementId: user.departementId,
      NOT: {
        OR: [
          {
            soutenancePresiden: {
              some: {
                planningId: id,
                id: {
                  not: soutenanceId,
                },

                AND: [{ date: date }, { heure: heure }],
              },
            },
          },
          {
            Affectation: {
              some: {
                Binome: {
                  soutenance: {
                    some: {
                      planningId: id,
                      id: {
                        not: soutenanceId,
                      },

                      AND: [{ date: date }, { heure: heure }],
                    },
                  },
                },
              },
            },
          },
          {
            Examinateurs: {
              some: {
                soutenance: {
                  planningId: id,
                  id: {
                    not: soutenanceId,
                  },

                  AND: [{ date: date }, { heure: heure }],
                },
              },
            },
          },
        ],
      },
    },
    select: {
      id: true,
      nom: true,
      prenom: true,
    },
  });

  //   where: {
  //     OR: [
  //       {
  //         // Filter for enseignants with soutenancePresiden
  //         soutenancePresiden: {
  //           some: {
  //             planningId: id,
  //             NOT: {
  //               AND: [{ date: date }, { heure: heure }],
  //             },
  //           },
  //         },
  //       },
  //       {
  //         // Filter for enseignants with NO soutenancePresiden
  //         soutenancePresiden: { none: {} },
  //       },
  //     ],
  //     // Affectation: {
  //     //   every: {
  //     //     Binome: {
  //     //       soutenance: {
  //     //         some: {
  //     //           // planningId: id,
  //     //           NOT: {
  //     //             AND: [{ date: date }, { heure: heure }],
  //     //           },
  //     //         },
  //     //       },
  //     //     },
  //     //   },
  //     // },
  //     // Examinateurs: {
  //     //   every: {
  //     //     soutenance: {
  //     //       planningId: id,
  //     //       NOT: {
  //     //         AND: [{ date: date }, { heure: heure }],
  //     //       },
  //     //     },
  //     //   },
  //     // },
  //   },
  //   select: {
  //     nom: true,
  //     prenom: true,
  //     id: true,
  //   },
  // });

  // console.log(enseignants);
  // console.log(enseignants.length);

  return { success: enseignants };
};

export const getAllSalles = async (
  date: string | null | undefined,
  heure: string | null | undefined,
  id: number | undefined,
  soutenanceId: number | undefined
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!date || !heure) return { error: "Manque date et heure" };

  const salles = await db.salle.findMany({
    where: {
      departementId: user.departementId,
      NOT: {
        OR: [
          {
            soutenances: {
              some: {
                planningId: id,
                id: {
                  not: soutenanceId,
                },

                AND: [{ date: date }, { heure: heure }],
              },
            },
          },
        ],
      },
    },
    select: {
      id: true,
      bloc: true,
      numero: true,
    },
  });

  return { success: salles };
};

function generateIntervals(
  duree: string,
  startTime: string,
  endTime: string
): string[] {
  const durationMinutes = convertDurationToMinutes(duree);
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  let startTimeMinutes = startHours * 60 + startMinutes;
  const endTimeMinutes = endHours * 60 + endMinutes;

  // Initialize the list of time intervals
  const timeIntervals: string[] = [];

  while (startTimeMinutes < endTimeMinutes) {
    const hours = Math.floor(startTimeMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (startTimeMinutes % 60).toString().padStart(2, "0");
    timeIntervals.push(`${hours}:${minutes}`);

    startTimeMinutes += durationMinutes;
  }

  return timeIntervals;
}

function convertDurationToMinutes(duree: string): number {
  const [hoursStr, minutesStr] = duree.split(":");

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  return hours * 60 + minutes;
}
