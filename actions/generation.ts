"use server";

import { ResultatPlanification } from "@/app/dashboard/calendrier/calendrier";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NotificationType, Visibility } from "@prisma/client";

import { revalidatePath } from "next/cache";

export const generer = async (
  resultat: ResultatPlanification,
  nom: string,
  visibility: Visibility
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!resultat) {
    return { error: "Aucune soutenance" };
  }
  let planning = await db.planning.findFirst({
    where: {
      AND: [{ version: nom }, { departementId: user.departementId }],
    },
  });

  if (!planning) {
    planning = await db.planning.create({
      data: {
        version: nom,
        createdAt: new Date(),
        etat: visibility,
        departementId: user.departementId,
      },
    });
  } else {
    await db.soutenance.deleteMany({
      where: {
        planningId: planning.id,
      },
    });
    planning = await db.planning.update({
      where: {
        id: planning.id,
      },
      data: {
        etat: visibility,
      },
    });
  }
  const createPromises = resultat.resultats.map(async (soutenanceData) => {
    if (
      !!soutenanceData.salle &&
      !!soutenanceData.president &&
      !!soutenanceData.examinateurs?.length
    ) {
      await db.soutenance.create({
        data: {
          Binome: { connect: { id: soutenanceData.idBinome } },

          date: soutenanceData.date,
          heure: soutenanceData.heure,
          salle: { connect: { id: soutenanceData.salle } },
          examinateurs: {
            //@ts-ignore
            create: soutenanceData.examinateurs?.map((spe) => ({
              enseignnatId: spe,
            })),
          },
          president: {
            connect: {
              //@ts-ignore
              id: soutenanceData?.president!,
            },
          },
          Planning: { connect: { id: planning.id } },
        },
      });
    } else if (
      !soutenanceData.salle &&
      soutenanceData.president &&
      !!soutenanceData.examinateurs &&
      !!soutenanceData.examinateurs.length
    ) {
      await db.soutenance.create({
        data: {
          Binome: { connect: { id: soutenanceData.idBinome } },
          date: soutenanceData.date,
          heure: soutenanceData.heure,
          //@ts-ignore
          president: {
            connect: {
              //@ts-ignore
              id: soutenanceData.president,
            },
          },

          examinateurs: {
            //@ts-ignore
            create: soutenanceData.examinateurs?.map((spe) => ({
              enseignnatId: spe,
            })),
          },
          Planning: { connect: { id: planning.id } },
        },
      });
    } else if (
      !!soutenanceData.salle &&
      !!soutenanceData.examinateurs &&
      !!soutenanceData.examinateurs?.length &&
      !soutenanceData.president
    ) {
      await db.soutenance.create({
        data: {
          Binome: { connect: { id: soutenanceData.idBinome } },
          salle: { connect: { id: soutenanceData.salle } },
          date: soutenanceData.date,
          heure: soutenanceData.heure,
          examinateurs: {
            //@ts-ignore
            create: soutenanceData.examinateurs?.map((spe) => ({
              enseignnatId: spe,
            })),
          },
          Planning: { connect: { id: planning.id } },
        },
      });
    } else if (
      soutenanceData.salle &&
      soutenanceData.president &&
      !soutenanceData.examinateurs?.length
    ) {
      await db.soutenance.create({
        data: {
          Binome: { connect: { id: soutenanceData.idBinome } },

          salle: { connect: { id: soutenanceData.salle } },

          date: soutenanceData.date,
          heure: soutenanceData.heure,
          president: {
            connect: {
              //@ts-ignore
              id: soutenanceData?.president!,
            },
          },
          Planning: { connect: { id: planning.id } },
        },
      });
    } else if (
      !soutenanceData.salle &&
      !soutenanceData.president &&
      !soutenanceData.examinateurs?.length
    ) {
      await db.soutenance.create({
        data: {
          Binome: { connect: { id: soutenanceData.idBinome } },

          date: soutenanceData.date,
          heure: soutenanceData.heure,
          Planning: { connect: { id: planning.id } },
        },
      });
    }
  });
  await Promise.all(createPromises);
  revalidatePath("/dashboard/calendrier");
  if (planning.etat === Visibility.VISIBLE && !!user.departementId) {
    const content = `Le planning des soutenances est pret`;
    const notifs = await db.notification.create({
      data: {
        content: content,
        from: { connect: { id: user.departementId } },
        type: NotificationType.ADMIN_TO_USERS,
      },
    });
    await pusherServer.trigger(user.departementId, "planning", notifs);
  }
  return { sucess: "" };
};
export const regenerer = async (
  resultat: ResultatPlanification,
  nom: string,
  visibility: Visibility
) => {
  if (!resultat) {
    return { error: "Aucune soutenance" };
  }

  await generer(resultat, nom, visibility);

  return { sucess: "" };
};

export const editPlanning = async (
  nom: string,
  visibility: Visibility,
  oldName: string
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  let planning = await db.planning.findFirst({
    where: {
      AND: [{ version: nom }, { departementId: user.departementId }],
    },
  });

  if (planning && oldName !== nom) {
    return { error: "Nom de version exist déjà" };
  }
  if (visibility === Visibility.VISIBLE) {
    await db.planning.updateMany({
      where: {
        departementId: user.departementId,
      },
      data: {
        etat: Visibility.NON_VISIBLE,
      },
    });
  }
  await db.planning.updateMany({
    where: {
      version: oldName,
      departementId: user.departementId,
    },
    data: {
      version: nom,

      etat: visibility,
    },
  });

  revalidatePath("/dashboard/calendrier");
  return { sucess: "success" };
};

export const editSoutenance = async (
  date: string | undefined | null,
  heure: string | undefined | null,

  president: string | undefined,
  examinater1: string | undefined,
  examinater2: string | undefined,
  salle: string | undefined,
  idSoutenance: number | undefined
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  if (!idSoutenance) {
    return { error: "Veuillez selectionner une soutenance" };
  }

  const newExaminerIds = [examinater1, examinater2];
  await db.examinateurs.deleteMany({
    where: {
      soutenanceId: idSoutenance,
    },
  });
  await db.soutenance.update({
    where: {
      id: idSoutenance,
    },
    data: {
      date,
      heure,
      presidentId: president,
      examinateurs: {
        //@ts-ignore
        create: newExaminerIds?.map((spe) => ({
          enseignnatId: spe,
        })),
      },
      salleId: salle,
    },
  });

  revalidatePath("/dashboard/calendrier");
  return { sucess: "Soutenance modifiée!" };
};
