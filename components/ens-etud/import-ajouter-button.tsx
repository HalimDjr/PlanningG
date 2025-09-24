"use client";

import { CirclePlus, CloudDownload } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";

import { ImportModel } from "./import-model";
import { AjouterModel } from "../ens/ajouter-ens-form";
import { AjouterEtudiantModel } from "../etud/ajouter-etud-form";
import { AjouterBinomeModel } from "../binome/ajouter-binome-form";
import { Enseignant } from "@prisma/client";
interface ImportButtonProps {
  isEtudiant: boolean;
  isBinome?: boolean;
}

export const ImportButton = ({ isEtudiant, isBinome }: ImportButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"primary"}
          className=" text-[13px] flex items-center justify-center  h-9 bg-primary_blue"
        >
          <CloudDownload className="h-5 w-5 text-white mr-2" color="white" />
          Importer
        </Button>
      </DialogTrigger>
      <ImportModel isEtudiant={isEtudiant} isBinome={isBinome} />
    </Dialog>
  );
};
export interface AjouterModelProps {
  specialites?: { nom: string }[] | null;
  grades?: { grade: string }[] | null;
  isEnseignant?: boolean;
  isBinome?: boolean;
  update?: boolean;
  updateEnseignant?: EnseignantUpdate;
  updateEtudiant?: EtudiantUpdate;
}
interface EnseignantUpdate {
  email: string;
  specialite?: string;
  grade?: string;
  nom?: string;
  prenom?: string;
  matricule?: string;
}
interface EtudiantUpdate {
  email: string;
  specialite?: string;

  nom?: string;
  prenom?: string;
  matricule?: string;
}
export const AjouterButton = ({
  specialites,
  grades,
  isEnseignant,
  isBinome,
}: AjouterModelProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" text-[14px] flex items-center  justify-center h-9 bg-neutral-100 text-primary_purpule border-[1.5px] hover:bg-neutral-50  px-5 font-semibold border-primary_purpule hover:text-primary_purpule/90">
          <CirclePlus className=" mr-1" size={20} />
          Ajouter
        </Button>
      </DialogTrigger>
      {isBinome && <AjouterBinomeModel />}
      {!isBinome && isEnseignant && (
        <AjouterModel specialites={specialites} grades={grades} />
      )}
      {!isBinome && !isEnseignant && (
        <AjouterEtudiantModel specialites={specialites} />
      )}
    </Dialog>
  );
};
