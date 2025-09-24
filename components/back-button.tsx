"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button
      name="back"
      variant="link"
      className="font-normal w-full underline "
      size="sm"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
