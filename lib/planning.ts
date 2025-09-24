import { currentUser } from "./current-user";
import { db } from "./db";

export const getPlanning = async () => {
  const user = await currentUser();

  const mostRecentPlanning = await db.planning.findFirst({
    where: { departementId: user?.departementId },
    orderBy: {
      createdAt: "desc",
    },
  });

  const planning = await db.soutenance.findMany({
    where: {
      planningId: mostRecentPlanning?.id,
    },
    select: {
      planningId: true,
      id: true,
      date: true,
      heure: true,
      Binome: {
        select: {
          etudiants: {
            select: {
              nom: true,
              prenom: true,
            },
          },
          Affectation: {
            select: {
              Theme: {
                select: {
                  nom: true,
                },
              },
              encadrent: {
                select: {
                  id: true,
                  nom: true,
                  prenom: true,
                },
              },
            },
          },
        },
      },
      salle: {
        select: {
          id: true,
          bloc: true,
          numero: true,
        },
      },
      president: {
        select: {
          nom: true,
          prenom: true,
          id: true,
        },
      },
      examinateurs: {
        select: {
          enseignant: {
            select: {
              id: true,
              nom: true,
              prenom: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
  return planning;
};
