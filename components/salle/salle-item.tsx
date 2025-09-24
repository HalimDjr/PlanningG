"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { deleteSalle } from "@/actions/salle";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface SalleItemProps {
  bloc: number;
  numero: number;
  id: string;
  index?: number;
}

export const SalleItem = ({ bloc, index, numero, id }: SalleItemProps) => {
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(() => {
      deleteSalle(id)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(
              `La salle ${data.success.numero} du bloc  ${data.success.bloc} a été supprimé`
            );
          }
        })
        .catch((error) => {
          toast.error("Somthing went wrong");
        });
    });
  };
  return (
    <div className="flex items-center justify-between border-b  py-4 px-6 w-full">
      <div className="w-1/4 "> {`N° ${index}`}</div>
      <div className="w-1/4 "> {`Bloc ${"  "}  ${bloc}`}</div>
      <div className="w-1/4 font-normal"> {` ${numero}`}</div>
      <div className="w-1/4 ">
        <Popover>
          <PopoverTrigger asChild className="text-start flex justify-start p-2">
            <Button
              disabled={isPending}
              variant="ghost"
              size="sm"
              className="text-rose-500 hover:bg-red-100 rounded-sm p-2 flex justify-center items-center border border-rose-600/65 hover:text-red-400 "
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
      </div>
    </div>
  );
};
