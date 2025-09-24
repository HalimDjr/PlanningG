import { currentUser } from "./current-user";
import { db } from "./db";

export const getStatistics = async () => {
  const user = await currentUser();
  if (!user || !user.departementId) {
    return null;
  }

  const enseignantCount = await db.enseignant.count({
    where: {
      departementId: user.departementId,
    },
  });
  const etudiantCount = await db.etudiant.count({
    where: {
      departementId: user.departementId,
    },
  });
  const binomeCount = await db.binome.count({
    where: {
      etudiants: {
        some: {
          departementId: user.departementId,
        },
      },
    },
  });
  const salleCount = await db.salle.count({
    where: {
      departementId: user.departementId,
    },
  });
  const themeCount = await db.theme.count({
    where: {
      proposePar: {
        departementId: user.departementId,
      },
    },
  });
  const specialites = await db.specialite.findMany({
    where: {
      departementId: user.departementId,
    },
    select: {
      id: false,
      nom: true,
      _count: {
        select: { enseignants: true, etudiants: true, Theme: true },
      },
    },
  });

  const enseignants = await db.enseignant.findMany({
    where: {
      departementId: user.departementId,
    },
    select: {
      id: true,
      nom: true,
      prenom: true,
      _count: {
        select: { themes: true, Affectation: true },
      },
    },
  });
  return {
    etudiantCount,
    enseignantCount,
    salleCount,
    themeCount,
    specialites,
    enseignants,
    binomeCount,
  };
};
