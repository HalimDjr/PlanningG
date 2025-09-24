"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { salleSchema, sallesSchema } from "@/schemas";
import { addManyy, addOne } from "@/actions/salle";
import { toast } from "sonner";

export const AjouterButton = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof salleSchema>>({
    resolver: zodResolver(salleSchema),
    defaultValues: {
      numero: undefined,
      bloc: undefined,
    },
  });
  const formSalles = useForm<z.infer<typeof sallesSchema>>({
    resolver: zodResolver(sallesSchema),
  });

  const onSubmit = (values: z.infer<typeof salleSchema>) => {
    startTransition(() => {
      addOne(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => toast.success("Something went wrong!"));
    });
    form.reset();
  };
  const addMany = (values: z.infer<typeof sallesSchema>) => {
    startTransition(() => {
      addManyy(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => toast.success("Something went wrong!"));
    });
    form.reset();
  };
  return (
    <Tabs defaultValue="salle" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2 ">
        <TabsTrigger value="salle" className="h-11 text-[15.5px]">
          Insérer une salle
        </TabsTrigger>
        <TabsTrigger value="salles" className="h-11 text-[15.5px]">
          Insérer plusieurs salles
        </TabsTrigger>
      </TabsList>
      <TabsContent value="salle" className="h-[400px]">
        <Card className="mt-5 ">
          <CardHeader>
            <CardTitle className="mb-3">Salle</CardTitle>
            <CardDescription>
              Entrer les information de la salle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-0 h-full">
            <Form {...form}>
              <form
                className="space-y-2 flex flex-col h-full"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-2 mb-4 md:mb-24  h-full">
                  <FormField
                    control={form.control}
                    name="bloc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bloc</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="Bloc"
                            disabled={isPending}
                            accept="positive"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Numéro"
                            type="number"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <CardFooter className=" flex  pb-4 items-end justify-center w-full  ">
                  <Button
                    disabled={isPending}
                    type="submit"
                    variant={"primary"}
                    name="saves"
                    className="w-full bg-secondary_purpule hover:bg-secondary_purpule/95"
                  >
                    Enregistrer
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="salles" className="h-[400px]">
        <Card className="mt-5 ">
          <CardHeader>
            <CardTitle className="mb-3">Salles</CardTitle>
            <CardDescription>
              Entrer les information des salles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-0 h-full">
            <Form {...formSalles}>
              <form
                className="space-y-2 flex flex-col h-full"
                onSubmit={formSalles.handleSubmit(addMany)}
              >
                <div className="space-y-4 mb-4 md:mb-24  h-full">
                  <FormField
                    control={formSalles.control}
                    name="bloc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bloc</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="Bloc"
                            disabled={isPending}
                            accept="positive"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-around w-full gap-x-1">
                    <FormField
                      control={formSalles.control}
                      name="numero1"
                      render={({ field }) => (
                        <FormItem className="">
                          <div className="flex items-center justify-center gap-x-2">
                            <FormLabel>De</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="N° première"
                                type="number"
                                disabled={isPending}
                                className="w-28"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formSalles.control}
                      name="numero2"
                      render={({ field }) => (
                        <FormItem className="">
                          <div className="flex items-center justify-center gap-x-2">
                            {" "}
                            <FormLabel>à</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="N° derinière"
                                type="number"
                                disabled={isPending}
                                className="w-28"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <CardFooter className=" flex  pb-4 items-end justify-center w-full  ">
                  <Button
                    disabled={isPending}
                    type="submit"
                    name="saves"
                    className="w-full bg-secondary_purpule hover:bg-secondary_purpule/95"
                  >
                    Enregistrer
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
