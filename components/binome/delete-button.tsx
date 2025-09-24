"use client";

import { toast } from "sonner";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  deleteBinome,
  deleteEnseignant,
  deleteEtudiant,
} from "@/actions/delete";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DeleteButtonProps {
  matricule: string;
}

export const DeleteBinomeButton = ({ matricule }: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      deleteBinome(matricule)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(`Binome supprimé!`);
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
