"use client";

import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { deleteEtudiant } from "@/actions/delete";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { AjouterModel } from "./ajouter-ens-form";
import {
  getGradesServer,
  getSpecialitesServer,
} from "@/actions/specialite-grade";
import { AjouterEtudiantModel } from "../etud/ajouter-etud-form";

interface DeleteButtonProps {
  email: string;
  specialite?: string;
  grade?: string;
  nom?: string;
  prenom?: string;
  matricule?: string;
}
type Spec = {
  nom: string;
}[];
type Grade = {
  grade: string;
}[];
export const UpdateEnsButton = ({
  email,
  grade,
  matricule,
  nom,
  prenom,
  specialite,
}: DeleteButtonProps) => {
  const updateEns = { email, specialite, grade, nom, prenom, matricule };
  const [isPending, startTransition] = useTransition();
  const [spec, setSpec] = useState<Spec>([]);
  const [grades, setGrades] = useState<Grade>([]);

  useEffect(() => {
    getSpecialitesServer().then((data) => {
      if (data) {
        setSpec(data);
      }
    });
    getGradesServer().then((data) => {
      if (data) {
        setGrades(data);
      }
    });
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          disabled={isPending}
          className="text-emerald-500 "
        >
          <EditIcon size={18} />
        </Button>
      </DialogTrigger>
      <AjouterModel
        update
        updateEnseignant={updateEns}
        specialites={spec}
        grades={grades}
      />
    </Dialog>
  );
};
export const UpdateEtudButton = ({
  email,
  matricule,
  nom,
  prenom,
  specialite,
}: DeleteButtonProps) => {
  const updateEtud = { email, specialite, nom, prenom, matricule };
  const [isPending, startTransition] = useTransition();
  const [spec, setSpec] = useState<Spec>([]);

  useEffect(() => {
    getSpecialitesServer().then((data) => {
      if (data) {
        setSpec(data);
      }
    });
  }, []);
  const onClick = () => {
    // startTransition(() => {
    //   deleteEtudiant(email)
    //     .then((data) => {
    //       if (data.error) {
    //         toast.error(data.error);
    //       }
    //       if (data.success) {
    //         toast.success(
    //           `L'etudiant ${data.success.nom} ${data.success.prenom} a été modifié`
    //         );
    //       }
    //     })
    //     .catch((error) => {
    //       toast.error("Somthing went wrong");
    //     });
    // });
    // router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          disabled={isPending}
          className="text-emerald-500 "
        >
          <EditIcon size={18} />
        </Button>
      </DialogTrigger>
      <AjouterEtudiantModel
        update
        specialites={spec}
        updateEtudiant={updateEtud}
      />
    </Dialog>
  );
};
