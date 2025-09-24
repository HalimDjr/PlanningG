"use client";
import useStore from "@/hooks/useStore";
import { Button } from "../ui/button";
import { getCaseInsensitiveProperty } from "../ens-etud/table";
import { addEtudiants } from "@/actions/add-enseignant";

import { toast } from "sonner";
import { useState } from "react";

import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export const ValiderButtonEtud = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { fileDataEtud, setfileDataEtud } = useStore();
  const formattedData =
    fileDataEtud?.map((data) => ({
      ...data,
      nom: getCaseInsensitiveProperty(data, "Nom", ""),
      prenom: getCaseInsensitiveProperty(data, "Prénom", ""),
      email: getCaseInsensitiveProperty(data, "email", ""),
      matricule: getCaseInsensitiveProperty(data, "Matricule", ""),

      specialite: getCaseInsensitiveProperty(data, "spécialité", ""),
    })) ?? [];

  const onClick = async () => {
    if (!fileDataEtud) return;

    setIsLoading(true);

    const promises = formattedData.map(async (data) => {
      return await addEtudiants(data.specialite, data);
    });

    try {
      const results = await Promise.all(promises);

      let successCount = 0;
      let errorMessages = [];

      for (const result of results) {
        if (result.error) {
          errorMessages.push(result.error);
        } else {
          successCount++;
        }
      }

      setIsLoading(false);

      if (errorMessages.length > 0) {
        toast.error(
          `Une erreur est survenue lors de l'ajout des etudiants: \n${errorMessages.join(
            "\n"
          )}`
        );
      } else {
        toast.success(`Modification enregistrées!`);
        router.refresh();
        setfileDataEtud([]);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred while adding etudiants.");
    }
  };
  if (!fileDataEtud) return null;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant={"primary"}
      size={"default"}
      className=" bg-secondary_purpule hover:bg-primary_purpule/95 w-[8rem] "
    >
      {isLoading ? <ClipLoader size={17} color="while" /> : <>Valider</>}
    </Button>
  );
};
