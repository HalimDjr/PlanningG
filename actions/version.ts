"use server";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

import { revalidatePath } from "next/cache";

export const getPlanningByVersion = async (version: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const planning = await db.soutenance.findMany({
    where: {
      Planning: {
        departementId: user.departementId,
        version: version,
      },
    },
    select: {
      planningId: true,
      id: true,
      date: true,
      heure: true,
      Binome: {
        select: {
          etudiants: {
            select: {
              nom: true,
              prenom: true,
            },
          },
          Affectation: {
            select: {
              Theme: {
                select: {
                  nom: true,
                },
              },
              encadrent: {
                select: {
                  id: true,
                  nom: true,
                  prenom: true,
                },
              },
            },
          },
        },
      },
      salle: {
        select: {
          id: true,
          bloc: true,
          numero: true,
        },
      },
      president: {
        select: {
          nom: true,
          prenom: true,
        },
      },
      examinateurs: {
        select: {
          enseignant: {
            select: {
              id: true,
              nom: true,
              prenom: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
  revalidatePath("/dashboard/calendrier");
  return { planning };
};
