"use client";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { Check, ChevronsUpDown, PenBoxIcon } from "lucide-react";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { Examinateur, President, Sallee } from "../calendrier/calendrier";
import { useEffect, useState, useTransition } from "react";
import {
  getAllEnseignants,
  getAllSalles,
  getDateDisponibleEncadrant,
  getHeureDisponibleEncadrant,
} from "@/actions/add-enseignant";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useModal } from "@/hooks/modal-store";
import { editSoutenance } from "@/actions/generation";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

export interface UpdatePlanningProps {
  date: string | null;
  heure: string | null;
  president: President | null;
  id: number;
  planningId: number;
  soutenanceId: number;
  idEncadrant: string | undefined;
  Examinateur1?: Examinateur;
  Examinateur2?: Examinateur;
  salle: Sallee | null;
}

type Enseignants = {
  id: string;
  nom: string;
  prenom: string;
};
type Salles = {
  id: string;
  numero: number;
  bloc: number;
}[];
export const UpdatePlanning = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isPending, startTransition] = useTransition();
  const [ens, setEns] = useState<Enseignants[]>([]);

  const [ensEx2, setEnsEx2] = useState<Enseignants[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [heure, setHeure] = useState<string[]>([]);
  const [salles, setSalles] = useState<Salles>([]);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [time, setTime] = useState("");
  const [timee, setTimee] = useState("");
  const [sallee, setSallee] = useState(data.soutenanceDetails?.salle?.id || "");

  const [value, setValue] = useState("");
  const [valueEX1, setValueEX1] = useState("");
  const [value1, setValue1] = useState(
    data.soutenanceDetails?.Examinateur1?.enseignant.id || ""
  );
  const [valuePre, setValuePre] = useState(
    data.soutenanceDetails?.president?.id || ""
  );
  const [ensEx1, setEnsEx1] = useState<Enseignants[]>([]);
  const [valueEX2, setValueEX2] = useState("");
  const [value2, setValue2] = useState("");
  const router = useRouter();

  const planningSchema = z.object({
    date: z
      .string({
        required_error: "La date est obligatoire.",
      })
      .default(data.soutenanceDetails?.date || ""),
    heure: z
      .string({
        required_error: "L'heure est obligatoire.",
      })
      .default(data.soutenanceDetails?.heure || ""),
    salle: z
      .string({
        required_error: "La salle est obligatoire.",
      })
      .default(data.soutenanceDetails?.heure || ""),
    president: z.string().default(data.soutenanceDetails?.president?.id || ""),

    examinateur1: z.string({
      required_error: "Veuillez selectionner un examinateur",
    }),
    examinateur2: z.string({
      required_error: "Veuillez selectionner un examinateur",
    }),
  });
  const isModalOpen = isOpen && type === "editSoutenance";
  const form = useForm<z.infer<typeof planningSchema>>({
    resolver: zodResolver(planningSchema),
    defaultValues: {
      date: data.soutenanceDetails?.date || "",
      heure: data.soutenanceDetails?.heure || "",
      salle: data.soutenanceDetails?.salle?.id || "",
      examinateur1:
        `${data.soutenanceDetails?.Examinateur1?.enseignant.nom} ${data.soutenanceDetails?.Examinateur1?.enseignant.prenom}` ||
        "",
      examinateur2:
        `${data.soutenanceDetails?.Examinateur2?.enseignant.nom} ${data.soutenanceDetails?.Examinateur2?.enseignant.prenom}` ||
        "",
    },
  });
  const handleDateChange = (newValue: string) => {
    setTime(newValue);
  };
  const handleHeureChange = (newValue: string) => {
    setTimee(newValue);
  };
  const handleSalleChange = (newValue: string) => {
    setSallee(newValue);
  };
  const onSubmit = (values: z.infer<typeof planningSchema>) => {
    const date = time || data.soutenanceDetails?.date;
    const heuree = timee || data.soutenanceDetails?.heure;
    const president = valuePre || data.soutenanceDetails?.president?.id;
    const examinateur1 =
      value1 || data.soutenanceDetails?.Examinateur1?.enseignant.id;
    const examinateur2 =
      value2 || data.soutenanceDetails?.Examinateur2?.enseignant.id;
    const salle = sallee || data.soutenanceDetails?.salle?.id;
    startTransition(() => {
      editSoutenance(
        date,
        heuree,
        president,
        examinateur1,
        examinateur2,
        salle,
        data.soutenanceDetails?.soutenanceId
      )
        .then(async (data) => {
          if (data.sucess) {
            toast.success(data.sucess);
          }
          if (data.error) {
            toast.success(data.error);
          }
          window.location.replace("/dashboard/calendrier");
          onClosee();
        })

        .catch(() => toast.error("Something went wrong!"));
    });
  };

  useEffect(() => {
    setEnsEx1(ensEx1.filter((e) => e.id !== valuePre));
    setEnsEx2(ensEx1.filter((e) => e.id !== value1 && e.id !== valuePre));

    // setEns(ens.filter((e) => e.id !== data.soutenanceDetails?.idEncadrant));

    // setEnsEx2(ensEx1.filter((e) => e.id !== value1));
    if (time || data.soutenanceDetails?.date) {
      setHeure([]);
      getHeureDisponibleEncadrant(
        data.soutenanceDetails?.idEncadrant,
        data.soutenanceDetails?.planningId,
        time || data.soutenanceDetails?.date,
        data.soutenanceDetails?.soutenanceId
      ).then((data) => {
        if (data.success) {
          setHeure(data.success);
        }
      });
    }
    //  startTransition(() => {
    if (data.soutenanceDetails?.idEncadrant) {
      getDateDisponibleEncadrant(data.soutenanceDetails?.idEncadrant).then(
        (data) => {
          if (data.success) {
            setDates(data.success);
          }
        }
      );
    }

    getAllEnseignants(
      time || data?.soutenanceDetails?.date,
      timee || data.soutenanceDetails?.heure,
      data.soutenanceDetails?.planningId,
      data.soutenanceDetails?.soutenanceId
    )
      .then((data) => {
        if (data.success) {
          setEns(data.success);

          setEnsEx1(data.success);

          setEnsEx2(data.success);
        }
      })

      .catch(() => toast.error("Something went wrong!"));
    setSalles([]);
    getAllSalles(
      time || data?.soutenanceDetails?.date,
      timee || data.soutenanceDetails?.heure,
      data.soutenanceDetails?.planningId,
      data.soutenanceDetails?.soutenanceId
    )
      .then((data) => {
        if (data.success) {
          setSalles(data.success);
          // setEnsEx1(data.success);
          // setEnsEx2(data.success);
        }
      })

      .catch(() => toast.error("Something went wrong!"));
    setEnsEx1(ens.filter((e) => e.id !== valuePre));

    setEnsEx2(ensEx1.filter((e) => e.id !== value1));
  }, [
    data.soutenanceDetails?.date,
    data.soutenanceDetails?.heure,
    data.soutenanceDetails?.idEncadrant,
    data.soutenanceDetails?.planningId,
    data.soutenanceDetails?.soutenanceId,
    valuePre,
    time,
    timee,
    data.soutenanceDetails?.president?.id,
  ]);
  const onClosee = () => {
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" md:w-[350px] w-[320px] p-5 pr-0 ">
        <DialogHeader>
          <DialogTitle className="text-center mb-3 flex items-center gap-x-2 justify-center">
            <PenBoxIcon className="text-primary_blue h-5 w-5 cursor-pointer" />

            {"Modifier La soutenance"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="pr-0">
            <ScrollArea className="  w-full h-[65vh]">
              {" "}
              <div className="flex w-full  flex-col gap-y-4 pr-5 pb-5">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date:</FormLabel>
                      <Select
                        disabled={isPending}
                        defaultValue={data.soutenanceDetails?.date || ""}
                        onValueChange={handleDateChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-200/80 border-0 focus:ring-0 text-slate-500 ring-offset-0 focus:ring-offset-0 capitalize outline-none dark:bg-zinc-700/50 dark:text-white min-w-48">
                            <SelectValue placeholder="Choisir une date" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dates?.map((date) => (
                            <SelectItem key={date} value={date}>
                              {date}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heure:</FormLabel>
                      <Select
                        disabled={isPending}
                        // onValueChange={field.onChange}
                        onValueChange={handleHeureChange}
                        defaultValue={data.soutenanceDetails?.heure || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-200/80 border-0 focus:ring-0 text-slate-500 ring-offset-0 focus:ring-offset-0 capitalize outline-none dark:bg-zinc-700/50 dark:text-white min-w-48">
                            <SelectValue placeholder="Choisir une heure" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {heure?.map((h) => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="president"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="text-[15px]">Président: </FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between z-50"
                          >
                            {value
                              ? `${
                                  ens.find(
                                    (e) => `${e.nom} ${e.prenom}` === value
                                  )?.nom
                                } ${
                                  ens.find(
                                    (e) => `${e.nom} ${e.prenom}` === value
                                  )?.prenom
                                }`
                              : `${data.soutenanceDetails?.president?.nom} ${data.soutenanceDetails?.president?.prenom}`}

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Chercher Enseignant..." />
                            <CommandEmpty>
                              Enseignant(e) non trouvé.
                            </CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                <ScrollArea className="h-36">
                                  {ens
                                    .filter(
                                      (e) =>
                                        e.id !==
                                        data.soutenanceDetails?.idEncadrant
                                    )
                                    ?.map((e) => (
                                      <CommandItem
                                        key={e.id}
                                        value={`${e.id}:${e.nom} ${e.prenom}`}
                                        onSelect={(currentValue) => {
                                          setValue(
                                            currentValue.split(":")[1] === value
                                              ? ""
                                              : currentValue.split(":")[1]
                                          );
                                          setOpen(false);
                                          setValuePre(
                                            currentValue.split(":")[0]
                                          );

                                          setEnsEx1(
                                            ensEx1.filter(
                                              (e) => e.id !== valuePre
                                            )
                                          );
                                          setEnsEx2(
                                            ensEx1.filter(
                                              (e) => e.id !== value1
                                            )
                                          );
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            value === `${e.nom} ${e.prenom}`
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {e.nom} {e.prenom}
                                      </CommandItem>
                                    ))}
                                </ScrollArea>
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="examinateur1"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="text-[15px]">
                        Examinateur 1:
                      </FormLabel>
                      <Popover open={open1} onOpenChange={setOpen1}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open1}
                            className="w-full justify-between"
                          >
                            {valueEX1
                              ? `${
                                  ensEx1.find(
                                    (e) => `${e.nom} ${e.prenom}` === valueEX1
                                  )?.nom
                                } ${
                                  ensEx1.find(
                                    (e) => `${e.nom} ${e.prenom}` === valueEX1
                                  )?.prenom
                                }`
                              : `${data.soutenanceDetails?.Examinateur1?.enseignant.nom} ${data.soutenanceDetails?.Examinateur1?.enseignant.prenom}`}

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Chercher Enseignant..." />
                            <CommandEmpty>
                              Enseignant(e) non trouvé.
                            </CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                <ScrollArea className="h-36">
                                  {ensEx1
                                    .filter((e) => e.id !== valuePre)
                                    ?.map((e) => (
                                      <CommandItem
                                        key={e.id}
                                        value={`${e.id}:${e.nom} ${e.prenom}`}
                                        onSelect={(currentValue: string) => {
                                          setValueEX1(
                                            currentValue.split(":")[1] ===
                                              valueEX1
                                              ? ""
                                              : currentValue.split(":")[1]
                                          );
                                          setOpen1(false);
                                          setValue1(currentValue.split(":")[0]);
                                          setEnsEx2(
                                            ensEx2.filter(
                                              (e) =>
                                                e.id !== value1 &&
                                                e.id !== valuePre
                                            )
                                          );
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            valueEX1 === `${e.nom} ${e.prenom}`
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {e.nom} {e.prenom}
                                      </CommandItem>
                                    ))}
                                </ScrollArea>
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="examinateur2"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="text-[15px]">
                        Examinateur 2:
                      </FormLabel>
                      <Popover open={open2} onOpenChange={setOpen2}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open2}
                            className="w-full justify-between"
                          >
                            {valueEX2
                              ? `${
                                  ensEx2.find(
                                    (e) => `${e.nom} ${e.prenom}` === valueEX2
                                  )?.nom
                                } ${
                                  ensEx2.find(
                                    (e) => `${e.nom} ${e.prenom}` === valueEX2
                                  )?.prenom
                                }`
                              : `${data.soutenanceDetails?.Examinateur2?.enseignant.nom} ${data.soutenanceDetails?.Examinateur2?.enseignant.prenom}`}

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Chercher Enseignant..." />
                            <CommandEmpty>
                              Enseignant(e) non trouvé.
                            </CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                <ScrollArea className="h-36">
                                  {ensEx2
                                    .filter(
                                      (e) =>
                                        e.id !== value1 &&
                                        e.id !==
                                          data.soutenanceDetails?.idEncadrant
                                    )
                                    ?.map((e) => (
                                      <CommandItem
                                        key={e.id}
                                        value={`${e.id}:${e.nom} ${e.prenom}`}
                                        onSelect={(currentValue) => {
                                          setValueEX2(
                                            currentValue.split(":")[1] ===
                                              valueEX2
                                              ? ""
                                              : currentValue.split(":")[1]
                                          );
                                          setOpen2(false);
                                          setValue2(currentValue.split(":")[0]);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            valueEX2 === `${e.id}`
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {e.nom} {e.prenom}
                                      </CommandItem>
                                    ))}
                                </ScrollArea>
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salle:</FormLabel>
                      <Select
                        disabled={isPending}
                        // onValueChange={field.onChange}
                        onValueChange={handleSalleChange}
                        defaultValue={data.soutenanceDetails?.salle?.id || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-200/80 border-0 focus:ring-0 text-slate-500 ring-offset-0 focus:ring-offset-0 capitalize outline-none dark:bg-zinc-700/50 dark:text-white min-w-48">
                            <SelectValue placeholder="Choisir une heure" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {salles?.map((h) => (
                            <SelectItem key={h.id} value={h.id}>
                              {h.bloc} N° {h.numero}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <Button
              type="submit"
              className="w-[120px]  mt-auto flex items-center justify-center  bg-primary_blue hover:bg-primary_blue/95 text-white"
            >
              {isPending ? (
                <ClipLoader size={17} color="while" />
              ) : (
                <span className="text-white">Enregistrer</span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
