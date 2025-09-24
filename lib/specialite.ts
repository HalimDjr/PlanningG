import { db } from "./db";

export const getSpecialites = async (departementId: string | undefined) => {
  if (departementId) {
    const specialites = await db.specialite.findMany({
      where: {
        departementId: departementId,
      },
      select: {
        nom: true,
      },
    });

    return specialites;
  }
  return null;
};
