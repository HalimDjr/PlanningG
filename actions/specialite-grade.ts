"use server";

import { currentUser } from "@/lib/current-user";
import { getGrades } from "@/lib/grade";
import { getSpecialites } from "@/lib/specialite";

export const getSpecialitesServer = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  const spec = await getSpecialites(user.departementId);

  return spec;
};
export const getGradesServer = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  const grades = await getGrades(user.departementId);

  return grades;
};
