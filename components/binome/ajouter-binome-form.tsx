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
import { binomesSchema } from "@/schemas";
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

import { addBinomes, editBinome } from "@/actions/add-enseignant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AjouterBinomeModelProps {
  update?: boolean;
  matricule1?: string;
  matricule2?: string;
}
export const AjouterBinomeModel = ({
  matricule1,
  matricule2,
  update,
}: AjouterBinomeModelProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof binomesSchema>>({
    resolver: zodResolver(binomesSchema),
    defaultValues: {
      matricule1: matricule1 || "",

      matricule2: matricule2 || "",
    },
  });
  const onSubmit = (values: z.infer<typeof binomesSchema>) => {
    if (update) {
      startTransition(() => {
        if (matricule1) {
          editBinome(matricule1, values)
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
        }
      });
    } else {
      startTransition(() => {
        addBinomes(values)
          .then((data) => {
            if (data.error) {
              toast.error(data.error);
              form.reset();
            }
            if (data.success) {
              toast.success(data.success);
              form.reset();
            }
          })
          .catch(() => toast.error("Something went wrong!"));
      });
      form.reset();
    }
  };

  return (
    <DialogContent className="  w-[400px] p-5  max-h-[95vh]">
      <DialogHeader>
        <DialogTitle className="text-center mb-3">
          {update ? "Modifier Binome" : " Ajouter un Binome"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form className="space-y-6 " onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="matricule1"
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

            <FormField
              control={form.control}
              name="matricule2"
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
    </DialogContent>
  );
};
