"use client";

import { toast } from "sonner";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteEnseignant, deleteEtudiant } from "@/actions/delete";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DeleteButtonProps {
  email: string;
}

export const DeleteEnsButton = ({ email }: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      deleteEnseignant(email)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(
              `L'enseignant ${data.success.nom} ${data.success.prenom} a été supprimé`
            );
          }
        })
        .catch((error) => {
          toast.error("Somthing went wrong");
        });
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        asChild
        className="text-start flex justify-start p-0 w-full"
      >
        <Button
          variant="link"
          size="sm"
          disabled={isPending}
          className="text-rose-500 "
        >
          <Trash2 size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 " side="top">
        <div className="flex flex-col justify-center">
          <p className=" text-center p-0 mb-2">Vous etes sure?</p>
          <div className="flex justify-around items-center">
            <Button
              disabled={isPending}
              onClick={onClick}
              variant="link"
              size="sm"
              className="text-rose-500  py-0 h-5"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export const DeleteEtudButton = ({ email }: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      deleteEtudiant(email)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(
              `L'etudiant ${data.success.nom} ${data.success.prenom} a été supprimé`
            );
          }
        })
        .catch((error) => {
          toast.error("Somthing went wrong");
        });
    });
    // router.refresh();
  };

  return (
    <Popover>
      <PopoverTrigger
        asChild
        className="text-start flex justify-start p-0 w-full"
      >
        <Button
          variant="link"
          size="sm"
          disabled={isPending}
          className="text-rose-500 "
        >
          <Trash2 size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 " side="top">
        <div className="flex flex-col justify-center">
          <p className=" text-center p-0 mb-2">Vous etes sure?</p>
          <div className="flex justify-around items-center">
            <Button
              disabled={isPending}
              onClick={onClick}
              variant="link"
              size="sm"
              className="text-rose-500  py-0 h-5"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
