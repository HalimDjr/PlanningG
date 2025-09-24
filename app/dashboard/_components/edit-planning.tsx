import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $Enums, Visibility } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClipLoader } from "react-spinners";
import { editPlanning } from "@/actions/generation";
import { toast } from "sonner";
import { useModal } from "@/hooks/modal-store";
import { useTransition } from "react";
import { PenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Edit = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "edit";
  const planningSchema = z.object({
    nom: z
      .string()
      .min(1, {
        message: "Le nom est obligatoire",
      })
      .default(data.editData?.version!),
    visibility: z
      .enum(["VISIBLE", "NON_VISIBLE"], {
        required_error: "Vous devez choisir la visibilité",
      })
      .default(data.editData?.etat as Visibility),
  });
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof planningSchema>>({
    resolver: zodResolver(planningSchema),
    defaultValues: {
      visibility: data.editData?.etat as Visibility,
    },
  });
  const onSubmit = (values: z.infer<typeof planningSchema>) => {
    startTransition(() => {
      editPlanning(values.nom, values.visibility, data.editData?.version!).then(
        (data) => {
          if (data.sucess) {
            toast.success("Modifications Enregistrées!");
          }
          if (data.error) {
            toast.error(data.error);
          }
          onClose();
        }
      );

      form.reset();
    });
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center mb-3 flex items-center gap-x-2 justify-center">
            <PenIcon className="text-primary_blue h-4 w-4 cursor-pointer" />

            {`Modifier la version ${data.editData?.version}`}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du version:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        defaultValue={data.editData?.version}
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
                        defaultValue={data.editData?.etat as Visibility}
                        className="flex  justify-between items-center"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="VISIBLE" />
                          </FormControl>
                          <FormLabel className="font-normal">Public</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="NON_VISIBLE" />
                          </FormControl>
                          <FormLabel className="font-normal">Privée</FormLabel>
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
                  <>Modifier</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
