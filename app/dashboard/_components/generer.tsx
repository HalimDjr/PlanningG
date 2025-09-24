"use client";

import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Image from "next/image";
import {
  Plan,
  Salle,
  Binome,
  Enseignant,
  IndisponibiliteJury,
  Configuration,
} from "../calendrier/calendrier";
import { generer } from "@/actions/generation";
import { useTransition } from "react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
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

interface genererProps {
  indisponibilites: IndisponibiliteJury[];
  salles: Salle[];
  binomes: Binome[];
  enseignants: Enseignant[];
  configuration: Configuration;
}
export const Generer = ({
  indisponibilites,
  enseignants,
  binomes,
  salles,
  configuration,
}: genererProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof planningSchema>>({
    resolver: zodResolver(planningSchema),
    defaultValues: {
      nom: "",
      visibility: Visibility.NON_VISIBLE,
    },
  });
  const dateDebut = format(configuration.dateDebut, "yyyy-MM-dd");

  const dateFin = format(configuration.dateFin, "yyyy-MM-dd");

  const heureDebut = configuration?.heureDebut;
  const heureFin = configuration?.heureFin;
  const duree = configuration?.duree;

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
      startTransition(() => {
        generer(resultat, values.nom, values.visibility).then((data) => {
          if (data.error) {
            toast.success("Veuillez réessayer");
          }
        });
      });
      router.refresh();
    });
    form.reset();
  };
  return (
    <main className="w-full h-full flex flex-col justify-center items-center ">
      <Image src={"/calendar.png"} height={190} width={190} alt="calendar" />
      <h1 className="text-xl md:text-xl text-foreground font-bold p-2 pb-0">
        Générer Votre Planning
      </h1>
      <p className=" text-muted-foreground text-[14px]">
        Clickez ici pour commencer
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className=" flex gap-x-2 mt-2  w-40" size={"lg"}>
            <CalendarPlus className="w-5 h-5 text-white" /> Générer
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
                              Visible
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="NON_VISIBLE" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Invisible
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
                    <>Enregistrer</>
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
