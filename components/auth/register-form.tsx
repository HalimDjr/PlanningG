"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import Image from "next/image";
import { BackButton } from "../back-button";
import { register } from "@/actions/register";
import { ClipLoader } from "react-spinners";
import { cn } from "@/lib/utils";
import { font } from "@/app/dashboard/_components/logo";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <section className="flex flex-col p-6 gap-5 items-center  md:w-[400px]  bg-white shadow-md rounded-md w-[350px]">
      <div className="flex flex-col   gap-5 items-center w-full  bg-white  flex-1 ">
        <div
          className="
    w-full
    flex
    justify-center
    items-center"
        >
          <Image
            src={"/logo-colore.png"}
            alt="cypress Logo"
            width={100}
            height={100}
          />
          {/* <span
            className={cn(
              "font-semibold dark:text-white  text-3xl first-letter:ml-2 text-primary_purpule",
              font.className
            )}
          >
            Plan
          </span> */}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departement</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="departement name"
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
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full"
              variant={"primary"}
            >
              {isPending ? (
                <ClipLoader color="white" size={17} />
              ) : (
                " Creer un compte"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <BackButton href="/login" label="Vous avez déjà un compte?" />
    </section>
  );
};
