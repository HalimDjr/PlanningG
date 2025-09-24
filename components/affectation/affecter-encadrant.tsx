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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { affecterEncadrant } from "@/actions/affecter-binome";

interface EnsNbAffectation {
  idBinome: string;
  ensNbAffectation:
    | {
        nom: string;
        id: string;
        _count: {
          Affectation: number;
        };
        prenom: string;
      }[]
    | null;
}

export const AffecterEncadrant = ({
  ensNbAffectation,
  idBinome,
}: EnsNbAffectation) => {
  //const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [ens, setEns] = useState("");

  const onClick = () => {
    if (!ens) {
      return toast.error("Vous devez d'abord choisir un enseignant!");
    }
    startTransition(() => {
      affecterEncadrant(idBinome, ens)
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
    <DialogContent className="max-w-[425px] md:[550px] h-[70vh] z-50">
      <DialogHeader>
        <DialogTitle className="flex justify-center items-center gap-x-2 mb-2 ">
          Liste des Enseignants
        </DialogTitle>
      </DialogHeader>

      <div className="flex justify-between w-full gap-x-1 items-center">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={true}
          className="w-full justify-between"
        >
          {value
            ? `${
                ensNbAffectation?.find((e) => `${e.nom} ${e.prenom}` === value)
                  ?.nom
              } ${
                ensNbAffectation?.find((e) => `${e.nom} ${e.prenom}` === value)
                  ?.prenom
              }`
            : "Chercher enseignant..."}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        <Button
          className={cn("w-[100px] h-8 bg-[#6A5AA7] hover:bg-[#6A5AA7]/90")}
          disabled={ens !== "" || !isPending ? false : true}
          onClick={onClick}
        >
          Affecter
        </Button>
      </div>

      <div className="w-full p-0 z-50">
        <Command className="bg-neutral-100 pb-0 ">
          <CommandInput placeholder="Chercher Enseignant..." />
          <CommandEmpty className="h-48 flex justify-center text-center text-sm items-center">
            Aucun(e) Enseignant(e) trouvé(e).
          </CommandEmpty>
          <CommandGroup>
            <CommandList className="z-50 bg-white">
              <div className="flex flex-col w-full">
                <div className="bg-gray-100 rounded-t-md shadow p-2 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-slate-800">
                    Enseignant
                  </h2>
                  <h2 className="text-sm font-medium text-slate-800">
                    Affectations
                  </h2>
                </div>
                <ScrollArea className="h-48">
                  {ensNbAffectation?.map((e) => (
                    <CommandItem
                      className="flex justify-between"
                      key={e.id}
                      value={`${e.id}:${e.nom} ${e.prenom}`}
                      onSelect={(currentValue) => {
                        setValue(
                          currentValue.split(":")[1] === value
                            ? ""
                            : currentValue.split(":")[1]
                        );
                        // setOpen(false);
                        setEns(currentValue.split(":")[0]);
                      }}
                    >
                      <div>
                        {e.nom} {e.prenom}
                      </div>
                      <div className="mr-2">{e._count.Affectation}</div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </div>
            </CommandList>
          </CommandGroup>
        </Command>
      </div>
    </DialogContent>
  );
};
