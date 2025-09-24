import { currentUser } from "./current-user";
import { db } from "./db";

export const getDepartement = async () => {
  const user = await currentUser();
  if (!user || !user.departementId) {
    return null;
  }
  const departement = await db.departement.findUnique({
    where: {
      id: user.departementId,
    },
    select: {
      nom: true,
    },
  });
  return departement;
};
