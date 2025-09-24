import { currentUser } from "./current-user";
import { db } from "./db";
import { getUserById } from "./user";

export const getConfiguration = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return null;
  }

  const existingConfiguration = await db.configuration.findFirst({
    where: {
      departementId: user.departementId,
    },
  });

  if (existingConfiguration) {
    return existingConfiguration;
  }

  return null;
};
