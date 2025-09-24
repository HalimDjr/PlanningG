"use client";
import { BackButton } from "@/components/back-button";
import Image from "next/image";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { LoginSchema } from "@/schemas";
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
import { Login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { font } from "@/app/dashboard/_components/logo";
import { ClipLoader } from "react-spinners";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccesss] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccesss("");
    startTransition(() => {
      Login(values, callbackUrl).then((data) => {
        setError(data?.error);
        setSuccesss(data?.success);
      });
    });
    form.reset();
  };
  return (
    <section className="flex flex-col p-6 gap-5 items-center  md:w-[400px]  bg-white shadow-md rounded-md w-[320px]">
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <Button
                      name="password"
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/reset">Forgot password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              name="login"
              type="submit"
              variant={"primary"}
              className="w-full bg-primary_blue"
              disabled={isPending}
            >
              {isPending ? <ClipLoader color="white" size={17} /> : "Login"}
            </Button>
          </form>
        </Form>
      </div>
      <BackButton href="/register" label="Vous n'avez pas de compte?" />
    </section>
  );
}
