"use server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteEnseignant = async (email: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  const ensExist = await db.enseignant.findFirst({
    where: { email, departementId: user.departementId },
  });

  if (!ensExist) {
    return { error: "Enseignant(e) pas trouvé(e)" };
  }

  const enseignant = await db.enseignant.delete({
    //@ts-ignore
    where: { email, departementId: user.departementId },
  });

  revalidatePath(`/dashboard/enseignants`);
  revalidatePath(`/dashboard/binomes`);
  return { success: enseignant };
};

export const deleteEtudiant = async (email: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  const entudiantExist = await db.etudiant.findFirst({
    where: { email, departementId: user.departementId },
  });

  if (!entudiantExist) {
    return { error: "Etudiant(e) pas trouvé(e)" };
  }

  const etudiant = await db.etudiant.delete({
    //@ts-ignore
    where: { email, departementId: user.departementId },
  });

  revalidatePath(`/dashboard/etudiants`);
  revalidatePath(`/dashboard/binomes`);
  return { success: etudiant };
};

export const deleteBinome = async (matricule1: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  const binomeExist = await db.etudiant.findFirst({
    where: { matricule: matricule1, departementId: user.departementId },
    select: {
      idBinome: true,
    },
  });

  if (!binomeExist || !binomeExist.idBinome) {
    return { error: "Binome pas trouvé" };
  }

  const binome = await db.binome.delete({
    where: { id: binomeExist.idBinome },
  });

  revalidatePath(`/dashboard/binomes`);
  return { success: binome };
};

export const deletePlanning = async (id: number | undefined) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  if (!id) {
    return null;
  }
  const plan = await db.planning.delete({
    where: { id: id },
  });

  revalidatePath(`/dashboard/calendrier`);

  return { success: "Planning supprimé!" };
};
