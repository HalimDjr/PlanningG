import { currentUser } from "./current-user";
import { db } from "./db";

export const getVersions = async () => {
  const user = await currentUser();
  if (!user) return null;
  const versions = await db.planning.findMany({
    where: {
      departementId: user.departementId,
    },
    select: {
      id: true,
      version: true,
      etat: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return versions;
};
