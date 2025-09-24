"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { use, useEffect, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AjouterModelProps } from "../ens-etud/import-ajouter-button";
import { addEnseignant, editEnseignant } from "@/actions/add-enseignant";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";

export const AjouterModel = ({
  specialites,
  grades,
  update,
  updateEnseignant,
}: AjouterModelProps) => {
  const [s, setS] = useState("");
  const [g, setG] = useState("");
  const enseignantSchemaInterface = z
    .object({
      nom: z.string().min(1, {
        message: "Le nom est obligatoire",
      }),
      prenom: z.string().min(1, {
        message: "Le prénom est obligatoire",
      }),
      email: z.string().email({
        message: "L'email est obligatoire",
      }),
      matricule: z.string().min(1, {
        message: "Le matricule est obligatoire",
      }),

      gradeOp1: z.string().optional(),
      gradeOpt2: z
        .string()
        .optional()
        .default(updateEnseignant?.grade || ""),

      specialiteOpt1: z.string().optional(),
      specialiteOpt2: z
        .string()
        .optional()
        .default(updateEnseignant?.specialite || ""),
    })
    .refine(
      (data) => {
        if (data.gradeOp1 && data.gradeOpt2) {
          return false;
        }

        return true;
      },
      {
        message: "Vous devez choisir ou ajouter uniquement ",
        path: ["gradeOp1"],
      }
    )
    .refine(
      (data) => {
        if (!data.gradeOp1 && !data.gradeOpt2) {
          return false;
        }

        return true;
      },
      {
        message: "Vous devez choisir un grade",
        path: ["gradeOp1"],
      }
    )
    .refine(
      (data) => {
        if (data.specialiteOpt1 && data.specialiteOpt2) {
          return false;
        }

        return true;
      },
      {
        message: "Vous devrez choisir ou ajouter uniquement ",
        path: ["specialiteOpt1"],
      }
    )
    .refine(
      (data) => {
        if (!data.specialiteOpt1 && !data.specialiteOpt2) {
          return false;
        }

        return true;
      },
      {
        message: "Vous devrez choisir une spécialité",
        path: ["specialiteOpt1"],
      }
    );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  useEffect(() => {
    setS(updateEnseignant?.specialite || "");
    setG(updateEnseignant?.grade || "");
  }, []);
  const form = useForm<z.infer<typeof enseignantSchemaInterface>>({
    resolver: zodResolver(enseignantSchemaInterface),
    defaultValues: {
      nom: updateEnseignant?.nom || "",
      prenom: updateEnseignant?.prenom || "",
      email: updateEnseignant?.email || "",
      matricule: updateEnseignant?.matricule || "",
      specialiteOpt1: "",
      specialiteOpt2: "",
      gradeOpt2: "",

      gradeOp1: "",
    },
  });

  const onSubmit = (values: z.infer<typeof enseignantSchemaInterface>) => {
    if (update) {
      const specialite =
        values.specialiteOpt1 ||
        values.specialiteOpt2 ||
        updateEnseignant?.specialite ||
        s;
      const grade =
        values.gradeOp1 || values.gradeOpt2 || updateEnseignant?.grade || g;
      startTransition(() => {
        editEnseignant(specialite!, grade!, updateEnseignant?.email!, values)
          .then((data) => {
            if (data.error) {
              toast.error(data.error);
            }
            if (data.success) {
              toast.success(data.success);
            }
          })
          .catch(() => toast.error("Something went wrong!"));
        router.refresh();
      });
    } else {
      const specialite = values.specialiteOpt1 || values.specialiteOpt2;
      const grade = values.gradeOp1 || values.gradeOpt2;
      startTransition(() => {
        addEnseignant(specialite!, grade!, values)
          .then((data) => {
            if (data.error) {
              toast.error(data.error);
            }
            if (data.success) {
              toast.success(data.success);
            }
            form.reset();
            router.refresh();
          })
          .catch(() => toast.error("Something went wrong!"));
        form.reset();
        router.refresh();
      });
    }
  };

  return (
    <DialogContent className=" md:w-[470px] w-[400px] pr-0  ">
      <DialogHeader>
        <DialogTitle className="text-center mb-3 pr-5 ">
          {update ? "Modifier Enseignant" : "Ajouter un Enseignant"}
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[80vh] pr-5">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 ">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nom"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Prénom"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="example@se-univ.dz"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="matricule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Matricule"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex  justify-between space-x-3 w-full">
                {!!specialites && (
                  <FormField
                    control={form.control}
                    name="specialiteOpt2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spécialité</FormLabel>
                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={
                            updateEnseignant?.specialite
                              ?.toString()
                              .toUpperCase() || field.value
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-200/80 border-0 focus:ring-0 text-slate-500 ring-offset-0 focus:ring-offset-0 capitalize outline-none dark:bg-zinc-700/50 dark:text-white min-w-48">
                              <SelectValue
                                placeholder="Choisir une spécialité"
                                defaultValue={
                                  updateEnseignant?.specialite
                                    ?.toString()
                                    .toUpperCase() || field.value
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {specialites.map((specialite) => (
                              <SelectItem
                                key={specialite.nom}
                                value={specialite.nom}
                              >
                                {specialite.nom.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="specialiteOpt1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ajouter une spécialité</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="spécialité"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex  justify-between space-x-3 w-full">
                {!!grades && (
                  <FormField
                    control={form.control}
                    name="gradeOpt2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={
                            updateEnseignant?.grade?.toString().toUpperCase() ||
                            ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-200/80 border-0 focus:ring-0 text-slate-500 ring-offset-0 focus:ring-offset-0 capitalize outline-none dark:bg-zinc-700/50 dark:text-white min-w-48">
                              <SelectValue placeholder="Choisir un grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade.grade} value={grade.grade}>
                                {grade.grade.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="gradeOp1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ajouter un grade</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="grade"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-center gap-y-3 w-full">
              <Button
                className="sm:mr-auto "
                disabled={isPending}
                type="button"
                variant={"secondary"}
                name="saves"
              >
                Annuler
              </Button>
              {update ? (
                <Button
                  disabled={isPending}
                  type="submit"
                  className="bg-primary_blue hover:bg-primary_blue/95"
                  name="saves"
                >
                  Modifier
                </Button>
              ) : (
                <Button
                  disabled={isPending}
                  type="submit"
                  className="bg-primary_blue hover:bg-primary_blue/95"
                  name="saves"
                >
                  Enregistrer
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </ScrollArea>
    </DialogContent>
  );
};
