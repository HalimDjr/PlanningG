import { Etat } from "@prisma/client";
import { currentUser } from "./current-user";
import { db } from "./db";

export const getThemes = async () => {
  const user = await currentUser();

  if (!user) return null;
  const themes = await db.theme.findMany({
    where: {
      proposePar: {
        departementId: user.departementId,
      },
    },

    select: {
      id: true,
      nom: true,
      createdAt: true,
      proposePar: {
        select: {
          nom: true,
          prenom: true,
          email: true,
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
  return themes;
};
