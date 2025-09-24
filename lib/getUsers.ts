import { currentUser } from "./current-user";
import { db } from "./db";

export const getEnseignants = async (departementId: string | undefined) => {
  const enseignants = await db.enseignant.findMany({
    where: {
      departementId: departementId,
    },
    select: {
      nom: true,
      prenom: true,
      email: true,
      matricule: true,
      specialite: {
        select: { nom: true },
      },
      grade: true,
      id: true,
    },
  });

  return enseignants;
};
export const getEnsWithGrade = async () => {
  const user = await currentUser();
  const enseignantsWithGrade = await db.enseignant.findMany({
    where: {
      departementId: user?.departementId,
    },
    select: {
      specialite: {
        select: { nom: true },
      },
      grade: true,
      id: true,
    },
  });

  return enseignantsWithGrade;
};

export const getEtudiants = async (departementId: string | undefined) => {
  const etudiants = await db.etudiant.findMany({
    where: {
      departementId: departementId,
    },
    select: {
      nom: true,
      prenom: true,
      email: true,
      matricule: true,
      specialite: {
        select: { nom: true },
      },
    },
  });

  return etudiants;
};

export const getBinomes = async () => {
  const user = await currentUser();
  const binomes = await db.binome.findMany({
    include: {
      etudiants: {
        where: {
          departementId: user?.departementId,
        },
        select: {
          nom: true,
          prenom: true,
          matricule: true,
        },
      },
    },
  });

  return binomes;
};

export const getBinomesWithSpecialite = async () => {
  const user = await currentUser();
  const binomes = await db.binome.findMany({
    where: {
      etudiants: {
        some: {
          departementId: user?.departementId,
        },
      },
    },
    include: {
      etudiants: {
        select: {
          specialite: {
            select: {
              nom: true,
            },
          },
        },
      },
    },
  });

  return binomes;
};
