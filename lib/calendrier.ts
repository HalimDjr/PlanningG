import { currentUser } from "./current-user";
import { db } from "./db";

export async function getEnseignantsWithIndisponibilites() {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  try {
    const enseignants = await db.enseignant.findMany({
      where: {
        departementId: user.departementId,
      },
      select: {
        id: true,
        datesIndisponibles: true,
      },
    });

    return enseignants;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export const getSalles = async () => {
  const user = await currentUser();

  const salles = await db.salle.findMany({
    where: {
      departementId: user?.departementId,
    },
    select: {
      id: true,
      indisponibilite: true,
    },
  });
  return salles;
};

export const getEnsWithGrade = async () => {
  const user = await currentUser();

  const ensWithGradeWithSpecialite = await db.enseignant.findMany({
    where: {
      departementId: user?.departementId,
    },
    select: {
      id: true,
      grade: true,
      specialite: {
        select: {
          nom: true,
        },
      },
      _count: {
        select: {
          Affectation: true,
        },
      },
    },
  });
  return ensWithGradeWithSpecialite;
};

export const getJury = async () => {
  const user = await currentUser();

  const binomeWithThemeWithEncadrant = await db.binome.findMany({
    where: {
      etudiants: {
        every: {
          departementId: user?.departementId,
        },
      },
    },
    select: {
      id: true,

      Affectation: {
        select: {
          Theme: {
            select: {
              themeSpecialites: {
                select: {
                  specialite: {
                    select: {
                      nom: true,
                    },
                  },
                },
              },
            },
          },
          encadrent: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
  return binomeWithThemeWithEncadrant;
};
