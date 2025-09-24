import { db } from "./db";

export const getGrades = async (departementId: string | undefined) => {
  if (departementId) {
    const grades = await db.enseignant.findMany({
      distinct: ["grade"],

      select: {
        grade: true,
      },
    });

    return grades;
  }
  return null;
};
