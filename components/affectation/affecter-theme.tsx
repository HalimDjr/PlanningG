"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { ScrollArea } from "../ui/scroll-area";
import { useState, useTransition } from "react";
import { cn, stringToColor } from "@/lib/utils";
import { toast } from "sonner";
import { affecterTheme } from "@/actions/affecter-binome";

export type Theme = {
  id: string;
  nom: string;

  createdAt: Date;
  themeSpecialites: ThemeSpecialite[];
  proposePar: Enseignant | null;
};

export type ThemeSpecialite = {
  themeId: string;
  specialiteId: string;
  specialite: {
    nom: string;
  };
};

export type Enseignant = {
  id: string;
  nom: string;
  prenom: string;
};
export const AffecterTheme = ({
  themes,
  idBinome,
}: {
  themes: Theme[] | null;
  idBinome: string;
}) => {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [ens, setEns] = useState("");

  const onClick = () => {
    if (!ens) {
      return toast.error("Vous devez d'abord choisir un enseignant!");
    }
    startTransition(() => {
      // affecterEncadrant(idBinome, ens)
      //   .then((data) => {
      //     if (data.error) {
      //       toast.error(data.error);
      //     }
      //     if (data.success) {
      //       toast.success(data.success);
      //     }
      //   })
      //   .catch(() => toast.error("Something went wrong!"));
    });
  };
  return (
    <DialogContent className="w-[425px] md:w-[70vw] lg:w-[100vw] h-[80vh] ">
      <DialogHeader>
        <DialogTitle className="flex justify-center items-center gap-x-2 mb-3 ">
          Liste des Thèmes disponibles
        </DialogTitle>
      </DialogHeader>

      <div>
        {!!themes && (
          <ScrollArea className="h-[63vh] pr-0">
            <div className="grid grid-cols-1  gap-4 gap-y-6 sm:grid-cols-2 md:grid-cols-2 mb-2 pr-3">
              {themes.map((theme) => (
                <ThemeItem
                  key={theme.id}
                  nom={theme.nom}
                  id={theme.id}
                  specialite={theme.themeSpecialites}
                  proposePar={
                    `${theme.proposePar?.nom} ${theme.proposePar?.prenom}` || ""
                  }
                  encadrantId={theme.proposePar?.id || ""}
                  idBinome={idBinome}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </DialogContent>
  );
};
interface Speciality {
  specialite: {
    nom: string;
  };
}

type ThemeSpecialites = Speciality[];
interface ThemeItemProps {
  nom: string;
  id: string;

  specialite?: ThemeSpecialites;
  proposePar: string;
  encadrantId: string;
  idBinome: string;
}
const ThemeItem = ({
  nom,
  specialite,
  proposePar,
  encadrantId,
  id,
  idBinome,
}: ThemeItemProps) => {
  const bg = stringToColor(nom);
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(() => {
      affecterTheme(idBinome, encadrantId, id)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };
  return (
    <div className=" flex flex-col bg-white shadow-md rounded-sm justify-between group  scale-103 transition duration-200 ease-in-out">
      <div>
        <div className="w-full h-1 rounded-t-sm" style={{ background: bg }} />
        <div className="flex justify-between w-full p-2 gap-x-1 gap-y-3">
          <div className=" flex gap-x-1 flex-wrap gap-y-1 flex-1 flex-grow">
            {specialite?.map((s) => (
              <p
                className="text-xs font-semibold rounded-md px-3 py-1.5 flex items-center h-6 text-black bg-slate-200 "
                key={s.specialite.nom}
              >
                {s.specialite.nom}
              </p>
            ))}
          </div>
          <p className=" text-slate-800 text-xs  flex justify-end w-fit text-left ml-auto ">
            {proposePar}
          </p>
        </div>
        <div className="w-full p-4 pb-0 pt-2 rounded-sm text-xs font-medium text-wrap capitalize">
          {nom}
        </div>
      </div>
      <div className="p-2 flex justify-center items-center mt-auto pt-3">
        <Button
          className={cn("w-full h-8 bg-[#454E8F] hover:bg-[#454E8F]/90")}
          disabled={isPending}
          onClick={onClick}
        >
          Affecter
        </Button>
      </div>
    </div>
  );
};
