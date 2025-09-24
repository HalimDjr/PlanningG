"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bolt, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState, useTransition } from "react";

import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { gestionSchema } from "@/schemas";
import { gestion } from "@/actions/settings-gestion";
import { ScrollArea } from "../ui/scroll-area";
import { Configuration } from "@prisma/client";
import { ClipLoader } from "react-spinners";
import { useModal } from "@/hooks/modal-store";
import NoWorkResult from "postcss/lib/no-work-result";

interface gestionInterface {
  config: Configuration | null;
}

export function Gestion() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [gestionn, setGestion] = useState<Configuration>();
  const { isOpen, onClose, type, data, onOpen } = useModal();

  const [isPending, startTransition] = useTransition();
  const isModalOpen = isOpen && type === "gestion";

  const form = useForm<z.infer<typeof gestionSchema>>({
    resolver: zodResolver(gestionSchema),
    defaultValues: {
      dateFinChoix:
        gestionn?.dateFinChoix || data?.config?.dateFinChoix || undefined,
      //@ts-ignore
      nbChoix:
        gestionn?.nbChoix?.toString() ||
        data?.config?.nbChoix?.toString() ||
        undefined,
      //@ts-ignore
      nbTheme:
        gestionn?.nbTheme?.toString() ||
        data?.config?.nbTheme?.toString() ||
        undefined,
      //@ts-ignore
      nbEncadrement:
        gestionn?.nbEncadrement?.toString() ||
        data?.config?.nbEncadrement?.toString() ||
        undefined,
      //@ts-ignore
      nbDateIndispo:
        gestionn?.nbDateIndispo?.toString() ||
        data?.config?.nbDateIndispo?.toString() ||
        undefined,
    },
  });
  const onSubmit = (values: z.infer<typeof gestionSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      gestion(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess("Modification Enregistrer!");
            setGestion(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-x-2 mb-2 ">
            <Bolt className="h-5 w-5 text-primary_purpule" />
            Gestion Avancée
          </DialogTitle>
          <DialogDescription className="text-center text-[13px] mb-4">
            Pour le bon déroulement des soutenances,
            <br /> veuillez remplir les champs au dessous.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="space-y-3 h-[390px]">
              <FormField
                control={form.control}
                name="dateFinChoix"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-[13px]">
                      Date limite des propositions et choix:
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              " w-full    pl-3 text-left font-normal h-9  hover:bg-slate-50 focus-visible:ring-0 ring-0",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : gestionn?.dateFinChoix ||
                                data?.config?.dateFinChoix
                              ? format(
                                  gestionn?.dateFinChoix ||
                                    data?.config?.dateFinChoix ||
                                    "",
                                  "PPP"
                                )
                              : ""}
                            <CalendarIcon className="ml-auto h-[16px] w-[16px] opacity-90 text-blue-950" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          className="focus-visible:ring-0 focus:ring-0"
                          mode="single"
                          selected={field.value ? field.value : undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          defaultMonth={
                            gestionn?.dateFinChoix ||
                            data?.config?.dateFinChoix ||
                            undefined
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nbChoix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">
                      Nombre de choix par étudiant:
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0"
                        defaultValue={
                          gestionn?.nbChoix?.toString() ||
                          data?.config?.nbChoix?.toString()
                        }
                        type="number"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nbTheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">
                      Nombre de thèmes proposés par enseignant:
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0"
                        type="number"
                        disabled={isPending}
                        defaultValue={
                          gestionn?.nbTheme?.toString() ||
                          data?.config?.nbTheme?.toString()
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nbEncadrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">
                      Nombre d&apos;encadrement par enseignant:
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0"
                        type="number"
                        disabled={isPending}
                        defaultValue={
                          gestionn?.nbEncadrement?.toString() ||
                          data?.config?.nbEncadrement?.toString()
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nbDateIndispo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">
                      Nombre de jours d&apos;indisponibilité déclarés par
                      enseignant:
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0"
                        type="number"
                        defaultValue={
                          gestionn?.nbDateIndispo?.toString() ||
                          data?.config?.nbDateIndispo?.toString()
                        }
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ScrollArea>
            <FormError message={error} />
            <FormSuccess message={success} />
            <DialogFooter>
              <Button
                disabled={isPending}
                type="submit"
                variant={"primary"}
                name="saves"
                className=" bg-primary_purpule hover:bg-primary_purpule/95 w-[100px]"
              >
                {isPending ? (
                  <ClipLoader size={17} color="while" />
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
