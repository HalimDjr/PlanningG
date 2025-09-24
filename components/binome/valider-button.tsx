"use client";
import useStore from "@/hooks/useStore";
import { Button } from "../ui/button";
import { getCaseInsensitiveProperty } from "../ens-etud/table";

import { toast } from "sonner";
import { useState } from "react";

import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { addBinomes } from "@/actions/add-enseignant";

export const ValiderButtonBinome = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { fileDataBinome, setfileDataBinome } = useStore();
  const formattedData =
    fileDataBinome?.map((data) => ({
      ...data,
      etudiant1: getCaseInsensitiveProperty(data, "etudiant1", ""),
      etudiant2: getCaseInsensitiveProperty(data, "etudiant2", ""),
      matricule1: getCaseInsensitiveProperty(data, "matricule1", ""),
      matricule2: getCaseInsensitiveProperty(data, "matricule2", ""),
    })) ?? [];

  const onClick = async () => {
    if (!fileDataBinome) return;

    setIsLoading(true);

    const promises = formattedData.map(async (data) => {
      return await addBinomes(data);
    });

    try {
      const results = await Promise.all(promises);

      if (results.length > 0) {
        toast.success(`Modification enregistrées!`);
        router.refresh();
        setfileDataBinome([]);
      } else {
        toast.error(`Veuillez réessayer`);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred while adding etudiants.");
    }
  };
  if (!fileDataBinome) return null;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant={"primary"}
      size={"default"}
      className=" bg-secondary_purpule hover:bg-secondary_purpule/95 w-[8rem] "
    >
      {isLoading ? <ClipLoader size={17} color="while" /> : <>Valider</>}
    </Button>
  );
};
