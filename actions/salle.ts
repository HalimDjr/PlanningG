"use server";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { salleSchema, sallesSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const addOne = async (values: z.infer<typeof salleSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }
  //   const validatedFields = salleSchema.safeParse(values);
  //   //   if (!validatedFields.success) {
  //   //     return { error: "Champs invalides" };
  //   //   }
  //   const { bloc, numero } = validatedFields.data;

  const existingSalle = await db.salle.findFirst({
    where: {
      bloc: values.bloc,
      numero: values.numero,
    },
  });
  if (existingSalle) {
    return { error: "Salle existe déjà" };
  }
  await db.salle.create({
    data: {
      bloc: values.bloc,
      numero: values.numero,
      departementId: user.departementId,
    },
  });
  revalidatePath(`/dashboard/salles`);
  return { success: "Salle insérée" };
};

export const addManyy = async (values: z.infer<typeof sallesSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }
  //   const validatedFields = salleSchema.safeParse(values);
  //   //   if (!validatedFields.success) {
  //   //     return { error: "Champs invalides" };
  //   //   }
  //   const { bloc, numero } = validatedFields.data;
  try {
    for (let i = values.numero1; i <= values.numero2; i++) {
      const existingSalle = await db.salle.findFirst({
        where: {
          bloc: values.bloc,
          numero: i,
        },
      });
      if (!existingSalle) {
        await db.salle.create({
          data: {
            bloc: values.bloc,
            numero: i,
            departementId: user.departementId,
          },
        });
      }
    }
    revalidatePath(`/dashboard/salles`);
    return { success: "Salles insérées" };
  } catch {
    return { error: "Veuillez réessayer" };
  }
};

export const deleteSalle = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  const salleExist = await db.salle.findUnique({
    where: { id },
  });

  if (!salleExist) {
    return { error: "Salle pas trouvé" };
  }

  const salle = await db.salle.delete({
    where: {
      id,
    },
  });

  //   revalidatePath(`/u/${self.username}/community`);
  revalidatePath(`/dashboard/salles`);
  return { success: salle };
};
