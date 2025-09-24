"use client";

import { DeletePlanning } from "@/app/dashboard/_components/delete-planning";
import { Edit } from "@/app/dashboard/_components/edit-planning";
import { UpdatePlanning } from "@/app/dashboard/_components/modifier-planning";
import { EditProfile } from "@/components/auth/edit-profile";
import { Gestion } from "@/components/configuration/gestion-avance";
import { useEffect, useState } from "react";

export const ModalProvder = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <EditProfile />
      <Gestion />
      <Edit />
      <DeletePlanning />
      <UpdatePlanning />
    </>
  );
};
