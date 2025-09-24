"use server";

import * as z from "zod";

import { db } from "@/lib/db";

import { ConfigurationSchema } from "@/components/configuration/configuration-form";
import { currentUser } from "@/lib/current-user";
import { getUserById } from "@/lib/user";
import { revalidatePath } from "next/cache";

export const configuration = async (
  values: z.infer<typeof ConfigurationSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }
  //   const validatedFields = ConfigurationSchema.safeParse(values);

  //   if (!validatedFields.success) {
  //     return { error: "Invalid fields!" };
  //   }

  const { dateDebut, dateFin, duree, heureDebut, heureFin } = values;

  const existingConfiguration = await db.configuration.findFirst({
    where: {
      departementId: user.departementId,
    },
  });

  if (existingConfiguration) {
    await db.configuration.update({
      where: {
        departementId: user.departementId,
      },
      data: {
        dateDebut,
        dateFin,
        duree,
        heureDebut,
        heureFin,
      },
    });
    revalidatePath("/dashboard/configuration");
    return { success: "configuration  modifiée!" };
  }

  await db.configuration.create({
    data: {
      dateDebut,
      dateFin,
      duree,
      heureDebut,
      heureFin,
      departementId: user.departementId,
    },
  });
  revalidatePath("/dashboard/configuration");
  return { success: "configuration  enregistrée!" };
};

export const DeleteConfiguration = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  try {
    await db.configuration.delete({
      where: {
        departementId: user.departementId,
      },
    });
    revalidatePath("/dashboard/configuration");
    return { success: "La configuration est supprimée" };
  } catch {
    return { error: "Veuillez réessayer" };
  }
};
