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
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AjouterModelProps } from "../ens-etud/import-ajouter-button";
import { addEtudiant, editEtudiant } from "@/actions/add-enseignant";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";

export const AjouterEtudiantModel = ({
  specialites,
  update,
  updateEtudiant,
}: AjouterModelProps) => {
  const etudiantSchemaInterface = z
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

      specialiteOpt1: z.string().optional(),
      specialiteOpt2: z
        .string()
        .optional()
        .default(updateEtudiant?.specialite || ""),
    })

    .refine(
      (data) => {
        if (data.specialiteOpt1 && data.specialiteOpt2) {
          return false;
        }

        return true;
      },
      {
        message: "Vous devez choisir ou ajouter uniquement ",
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
        message: "Vous devez choisir une spécialité",
        path: ["specialiteOpt1"],
      }
    );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof etudiantSchemaInterface>>({
    resolver: zodResolver(etudiantSchemaInterface),
    defaultValues: {
      nom: updateEtudiant?.nom || "",
      prenom: updateEtudiant?.prenom || "",
      email: updateEtudiant?.email || "",
      matricule: updateEtudiant?.matricule || "",
      specialiteOpt1: "",
    },
  });
  const onSubmit = (values: z.infer<typeof etudiantSchemaInterface>) => {
    if (update) {
      const specialite =
        values.specialiteOpt1 ||
        values.specialiteOpt2 ||
        updateEtudiant?.specialite;

      startTransition(() => {
        editEtudiant(specialite!, updateEtudiant?.email!, values)
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
      startTransition(() => {
        addEtudiant(specialite!, values)
          .then((data) => {
            if (data.error) {
              toast.error(data.error);
            }
            if (data.success) {
              toast.success(data.success);
            }
            router.refresh();
          })
          .catch(() => toast.error("Something went wrong!"));
        router.refresh();
      });
      form.reset();
    }
  };

  return (
    <DialogContent className=" md:w-[450px] w-[400px] pr-0 ">
      <DialogHeader>
        <DialogTitle className="text-center mb-3 pr-5">
          {update ? "Modifier Etudiant" : "  Ajouter un Etudiant"}
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[75vh] pr-5">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
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
                {specialites && (
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
                            updateEtudiant?.specialite
                              ?.toString()
                              .toUpperCase() || field.value
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-200/80 border-0 focus:ring-0 text-slate-500 ring-offset-0 focus:ring-offset-0 capitalize outline-none dark:bg-zinc-700/50 dark:text-white min-w-48 text-start">
                              <SelectValue placeholder="Choisir une spécialitée" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {specialites.map((specialite) => (
                              <SelectItem
                                key={specialite.nom}
                                value={specialite.nom}
                                defaultValue={
                                  updateEtudiant?.specialite
                                    ?.toString()
                                    .toUpperCase() || field.value
                                }
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
            </div>

            <DialogFooter className="flex justify-center gap-y-3 w-full items-end">
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
