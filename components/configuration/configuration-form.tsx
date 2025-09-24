"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useTransition } from "react";
import { configuration } from "@/actions/configuration";
import { ClipLoader } from "react-spinners";

export const ConfigurationSchema = z.object({
  dateDebut: z.date({
    required_error: "date  debut est obligatoire.",
  }),
  dateFin: z.date({
    required_error: "A date  fin est obligatoire.",
  }),
  heureDebut: z.string({ required_error: "L'heure du début est obligatoire" }),
  heureFin: z.string({ required_error: "L'heure de fin est obligatoire" }),
  duree: z.string({ required_error: "La durée  est obligatoire" }),
});

export function ConfigurationForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ConfigurationSchema>>({
    resolver: zodResolver(ConfigurationSchema),
  });

  function onSubmit(data: z.infer<typeof ConfigurationSchema>) {
    startTransition(() => {
      configuration(data)
        .then((data) => {
          if (data.error) {
            form.reset();
            toast.error(data.error);
          }
          if (data.success) {
            form.reset();
            toast.success(data.success);
          }
        })
        .catch(() => toast.success("Something went wrong!"));
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-10 mt-1 w-full  bg-[#F6F4FC] p-6 pb-2 justify-between rounded-md h-full"
      >
        <div className="flex flex-col sm:justify-center  flex-grow  gap-y-10 mt-4 w-full h-full">
          {" "}
          <div className="flex w-full lg:gap-x-4 lg:flex-row flex-col gap-y-4">
            <FormField
              control={form.control}
              name="dateDebut"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="text-[15px]">Date Début</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " w-full md:w-[80%]   pl-3 text-left font-normal h-9  hover:bg-slate-50",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-[13px]">Choisi une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-[16px] w-[16px] opacity-90 text-blue-950" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
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
              name="dateFin"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="text-[15px]">Date Fin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " w-full md:w-[80%]  pl-3 text-left font-normal h-9 hover:bg-slate-50 ",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-[13px]">Choisi une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-[18px] w-[18px] opacity-90 text-blue-950" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full lg:gap-x-4 lg:flex-row flex-col gap-y-4">
            <FormField
              control={form.control}
              name="heureDebut"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="text-[15px]">Heure Début</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="08:00"
                      type="time"
                      className="w-full md:w-[80%] h-9 bg-white hover:bg-slate-50"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heureFin"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full ">
                  <FormLabel className="text-[15px]">Heure Fin</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="08:00"
                      type="time"
                      className=" flex h-9 w-full md:w-[80%] bg-white"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="duree"
            render={({ field }) => (
              <FormItem className="flex justify-center flex-col items-center w-full ">
                <div className="flex justify-center gap-x-2 items-center w-full">
                  {" "}
                  <FormLabel className="text-[15px]">Durée</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="08:00"
                      type="time"
                      className="w-full md:w-[40%] h-9 hover:bg-slate-50 "
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w- full  mt-auto flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="w-[120px] flex items-center justify-center  bg-secondary_purpule hover:bg-secondary_purpule/95"
          >
            {isPending ? <ClipLoader size={17} color="while" /> : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
