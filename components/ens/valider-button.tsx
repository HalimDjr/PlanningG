"use client";
import useStore from "@/hooks/useStore";
import { Button } from "../ui/button";
import { getCaseInsensitiveProperty } from "../ens-etud/table";
import { addEnseignants } from "@/actions/add-enseignant";

import { toast } from "sonner";
import { useState } from "react";

import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export const ValiderButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { fileDataEns, savedEns, setsavedEns, setfileDataEns } = useStore();
  const formattedData =
    fileDataEns?.map((data) => ({
      ...data,
      nom: getCaseInsensitiveProperty(data, "Nom", ""),
      prenom: getCaseInsensitiveProperty(data, "Prénom", ""),
      email: getCaseInsensitiveProperty(data, "email", ""),
      matricule: getCaseInsensitiveProperty(data, "Matricule", ""),

      specialite: getCaseInsensitiveProperty(data, "spécialité", ""),
      grade: getCaseInsensitiveProperty(data, "Grade", ""),
    })) ?? [];

  const onClick = async () => {
    if (!fileDataEns) return;

    setIsLoading(true);

    const promises = formattedData.map(async (data) => {
      return await addEnseignants(data.specialite, data);
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
        setsavedEns(false);
        toast.error(
          `Errors occurred while adding Enseignants: \n${errorMessages.join(
            "\n"
          )}`
        );
      } else {
        toast.success(`Modification enregistrées!`);
        router.refresh();
        setfileDataEns([]);
        setsavedEns(true);
      }
    } catch (error) {
      setsavedEns(false);
      setIsLoading(false);
      toast.error("An error occurred while adding Enseignants.");
    }
  };
  if (!fileDataEns) return null;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size={"default"}
      className=" bg-secondary_purpule hover:bg-secondary_purpule/95 w-[8rem] text-[13px] py-0.5 mb-2 "
    >
      {isLoading ? <ClipLoader size={17} color="while" /> : <>Valider</>}
    </Button>
  );
};
