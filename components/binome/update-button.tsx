"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { AjouterBinomeModel } from "./ajouter-binome-form";

interface DeleteButtonProps {
  matricule1: string;
  matricule2?: string;
}

export const UpdateBinomeButton = ({
  matricule1,
  matricule2,
}: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    // startTransition(() => {
    //   deleteEnseignant(email)
    //     .then((data) => {
    //       if (data.error) {
    //         toast.error(data.error);
    //       }
    //       if (data.success) {
    //         toast.success(
    //           `L'enseignant ${data.success.nom} ${data.success.prenom} a été supprimé`
    //         );
    //       }
    //     })
    //     .catch((error) => {
    //       toast.error("Somthing went wrong");
    //     });
    // });
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
      <AjouterBinomeModel
        update
        matricule1={matricule1}
        matricule2={matricule2}
      />
    </Dialog>
  );
};
