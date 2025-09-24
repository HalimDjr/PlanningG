"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { planningSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Visibility } from "@prisma/client";

import { Button } from "@/components/ui/button";

import {
  Plan,
  Salle,
  Binome,
  Enseignant,
  IndisponibiliteJury,
  Configuration,
} from "../calendrier/calendrier";
import { regenerer } from "@/actions/generation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

import { format } from "date-fns";
import { RotateCcw } from "lucide-react";
import useVersionStore from "@/hooks/version-store";

interface genererProps {
  indisponibilites: IndisponibiliteJury[];
  salles: Salle[];
  binomes: Binome[];
  enseignants: Enseignant[];
  configuration: Configuration;
}
export const Regenerer = ({
  indisponibilites,
  enseignants,
  binomes,
  salles,
  configuration,
}: genererProps) => {
  const [isPending, startTransition] = useTransition();
  const { setVersion } = useVersionStore();
  const [open, setOpen] = useState(false);

  const dateDebut = format(configuration.dateDebut, "yyyy-MM-dd");

  const dateFin = format(configuration.dateFin, "yyyy-MM-dd");

  const heureDebut = configuration?.heureDebut;
  const heureFin = configuration?.heureFin;
  const duree = configuration?.duree;

  const form = useForm<z.infer<typeof planningSchema>>({
    resolver: zodResolver(planningSchema),
    defaultValues: {
      nom: "",
      visibility: Visibility.NON_VISIBLE,
    },
  });
  const onSubmit = (values: z.infer<typeof planningSchema>) => {
    const resultat = Plan(
      binomes,
      enseignants,
      salles,
      indisponibilites,
      dateDebut,
      dateFin,
      heureDebut,
      heureFin,
      duree
    );
    startTransition(() => {
      regenerer(resultat, values.nom, values.visibility).then((data) => {
        if (data.error) {
          toast.success("Veuillez réessayer");
        }
      });
      setVersion(values.nom);
      form.reset();
      setOpen((open) => !open);
    });
  };

  return (
    <main className=" h-full flex flex-col justify-end items-center ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className=" flex gap-x-2 mt-2 mr-1  w-40 ml-auto text-sm"
            size={"default"}
          >
            {isPending ? (
              <ClipLoader size={16} color="while" />
            ) : (
              <>
                <RotateCcw className="w-4 h-4 text-white" /> Regénérer
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Générer un planning</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de version</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Version"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Je veux que le planning soit:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue="NON_VISIBLE"
                          className="flex  justify-between items-center"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="VISIBLE" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Public
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="NON_VISIBLE" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Privée
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex justify-center gap-y-3 mt-2 w-full">
                <Button
                  className="sm:mr-auto "
                  disabled={isPending}
                  type="button"
                  variant={"secondary"}
                  name="saves"
                >
                  Annuler
                </Button>
                <Button
                  disabled={isPending}
                  type="submit"
                  variant={"primary"}
                  name="saves"
                  className="bg-black text-white hover:bg-black/80 w-[100px]"
                >
                  {isPending ? (
                    <ClipLoader size={17} color="while" />
                  ) : (
                    <>Regénérer</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
};
