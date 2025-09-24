"use server";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const affecterEncadrant = async (
  idBinome: string,
  encadrantId: string
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const isAffected = await db.affectation.findUnique({
    where: {
      idBinome: idBinome,
    },
  });

  if (isAffected) {
    return { error: "Binôme déjà affecté!" };
  }
  const affectation = await db.affectation.create({
    data: {
      idBinome,
      encadrantId,
    },
  });
  revalidatePath(`/dashboard/affectation`);
  return { success: "Affectation insérées!" };
};

export const affecterTheme = async (
  idBinome: string,
  encadrantId: string,
  idTheme: string
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const isAffected = await db.affectation.findUnique({
    where: {
      idBinome: idBinome,
    },
  });

  if (isAffected) {
    return { error: "Binôme déjà affecté!" };
  }
  const affectation = await db.affectation.create({
    data: {
      idBinome,
      encadrantId,
      themeId: idTheme,
    },
  });
  revalidatePath(`/dashboard/affectation`);
  return { success: "Affectation insérées!" };
};
