"use client";

import {
  Check,
  ChevronsUpDown,
  EllipsisVertical,
  LucideTrash2,
  PenBoxIcon,
  TrashIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState, useTransition } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useVersionStore from "@/hooks/version-store";

type Version = {
  version: string;
  id: number;
  etat: $Enums.Visibility;
};
export function ComboboxDemo({ versions }: { versions: Version[] }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [etat, setEtat] = useState<Visibility>(Visibility.NON_VISIBLE);
  const [id, setId] = useState(versions[0].id);
  const { setVersion, version } = useVersionStore();

  useEffect(() => {
    if (version) {
      setValue(version);
      const etatt = versions.filter((ver) => ver.version === version);
      setEtat(etatt[0]?.etat);
      setId(etatt[0]?.id);
    } else {
      setValue(versions[0].version);
      setEtat(versions[0].etat);
      setId(versions[0].id);
    }
    const down = (e: KeyboardEvent) => {
      if ((e.key === "K" || e.key === "k") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [version, versions]);

  const handleVersionSelect = (selectedVersion: string) => {
    setVersion(selectedVersion);
    setValue(selectedVersion === value ? "" : selectedVersion);

    setOpen(false);
  };
  return (
    <main className=" h-full flex flex-col justify-end items-center ml-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-x-1.5">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="focus:outline-none focus-visible:ring-0 ring-offset-0"
            >
              {value
                ? versions.find((ver) => ver.version === value)?.version
                : "Version"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PlanningSettings version={value} etat={etat} planningId={id} />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">CTRL</span>K
          </kbd>
        </div>
        <PopoverContent className="w-[200px] p-0 ml-auto">
          <Command>
            <CommandInput placeholder="Search planning..." />
            <CommandEmpty>Aucune Versions trouvée.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                <ScrollArea className="h-36">
                  {versions.map((ver) => (
                    <CommandItem
                      key={ver.version}
                      value={ver.version}
                      onSelect={() => handleVersionSelect(ver.version)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === ver.version ? "opacity-100" : "opacity-0"
                        )}
                      />

                      {ver.version}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </main>
  );
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/modal-store";
import { $Enums, Visibility } from "@prisma/client";

export function PlanningSettings({
  version,
  etat,
  planningId,
}: {
  version: string;
  etat: Visibility;
  planningId: number;
}) {
  const { onOpen } = useModal();
  return (
    <DropdownMenu>
      <div className="flex items-center flex-row-reverse gap-x-2 hover:bg-neutral-100 p-1.5 px-3 rounded-md justify-start">
        <DropdownMenuTrigger className=" outline-none flex gap-x-2 flex-row-reverse items-center">
          <EllipsisVertical className="size-5  text-slate-800 cursor-pointer " />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-40 mr-2 " side="right">
        <DropdownMenuItem
          className="text-[14px] flex items-center gap-x-3 cursor-pointer "
          onClick={() =>
            onOpen("edit", { editData: { version: version, etat: etat } })
          }
        >
          <PenBoxIcon className="h-4 w-4  text-emerald-500" />
          Modifier
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-[14px] flex items-center gap-x-3 cursor-pointer "
          onClick={() =>
            onOpen("deletePlanning", {
              idPlanning: planningId,
              editData: { version: version, etat: etat },
            })
          }
        >
          <LucideTrash2 className="h-4 w-4  text-red-500" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
