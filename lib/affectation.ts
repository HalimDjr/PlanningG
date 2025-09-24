import { currentUser } from "./current-user";
import { db } from "./db";

export const getBinomesAffectations = async () => {
  const user = await currentUser();
  const binomes = await db.binome.findMany({
    where: {
      etudiants: {
        every: {
          departementId: user?.departementId,
        },
      },
    },
    select: {
      id: true,
      etudiants: {
        select: {
          nom: true,
          prenom: true,
          specialite: { select: { nom: true } },
        },
      },
    },
  });
  const affectations = await db.affectation.findMany({
    where: {
      encadrent: {
        departementId: user?.departementId,
      },
    },
    select: {
      Theme: {
        select: {
          id: true,
          nom: true,
          proposePar: {
            select: {
              nom: true,
              prenom: true,
            },
          },
        },
      },
      Binome: {
        select: {
          id: true,
          etudiants: {
            select: {
              nom: true,
              prenom: true,

              specialite: { select: { nom: true } },
            },
          },
        },
      },
    },
  });
  return { binomes, affectations };
};

export const EnsNbAffectation = async () => {
  const user = await currentUser();
  if (!user) return null;
  const enseignants = await db.enseignant.findMany({
    where: {
      departementId: user.departementId,
    },
    select: {
      id: true,
      nom: true,
      prenom: true,
      _count: {
        select: { Affectation: true },
      },
    },
  });
  return enseignants;
};
export const getThemeNonAffecter = async () => {
  const user = await currentUser();
  if (!user) return null;
  const affectationThemeIds = (
    await db.affectation.findMany({
      select: {
        themeId: true,
      },
    })
  )
    .map((affectation) => affectation.themeId)
    .filter((id): id is string => id !== null);
  const theme = await db.theme.findMany({
    where: {
      proposePar: {
        departementId: user.departementId,
      },
      id: {
        notIn: affectationThemeIds,
      },
    },
    select: {
      id: true,
      nom: true,
      createdAt: true,
      proposePar: {
        select: {
          id: true,
          nom: true,
          prenom: true,
        },
      },
      themeSpecialites: {
        include: {
          specialite: {
            select: {
              nom: true,
            },
          },
        },
      },
    },
  });
  return theme;
};
