"use client";
import { BackButton } from "@/components/back-button";
import Image from "next/image";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { ResetSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { reset } from "@/actions/reset";
import { cn } from "@/lib/utils";
import { font } from "@/app/dashboard/_components/logo";

export function ResetForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
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
            <div className="space-y-6 mb-4">
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
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              className="w-full"
              variant={"primary"}
              disabled={isPending}
            >
              Send reset email
            </Button>
          </form>
        </Form>
      </div>
      <BackButton href="/login" label="Back To Login" />
    </section>
  );
}
