"use client";
import useStore, { DataItem, DataItemBinome } from "@/hooks/useStore";
import { DataTable } from "./data-table";
import { columns } from "../ens/columns";

import { NothingFound } from "../nothing-found";
import { ValiderButton } from "../ens/valider-button";
import { ValiderButtonEtud } from "../etud/valider-button";
import { columnss } from "../etud/columns";
import { Binomes } from "@/app/dashboard/binomes/binome";
import { columnsBinome } from "../binome/columns";
import { ValiderButtonBinome } from "../binome/valider-button";

export interface Ens {
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  specialite: string;
  grade?: string;
}

export const TableEns = ({ formattedEns }: { formattedEns: Ens[] }) => {
  const { fileDataEns, savedEns } = useStore();

  const formattedData =
    fileDataEns?.map((data) => ({
      nom: getCaseInsensitiveProperty(data, "Nom", ""),
      prenom: getCaseInsensitiveProperty(data, "Prénom", ""),
      email: getCaseInsensitiveProperty(data, "email", ""),
      matricule: getCaseInsensitiveProperty(data, "Matricule", ""),

      specialite: getCaseInsensitiveProperty(data, "spécialité", ""),
      grade: getCaseInsensitiveProperty(data, "Grade", "") || undefined,
    })) ?? [];

  const combinedData = [...formattedData, ...formattedEns];
  if (!fileDataEns?.length && !formattedEns.length) {
    return (
      <section className=" flex flex-col w-full h-full ">
        <NothingFound
          header="Aucun Enseignant Trouvé!"
          paragraph=" Importer vos enseignants a partir d'un fichier excel"
        />
      </section>
    );
  }
  if (formattedData.length > 0) {
    return (
      <section className=" flex flex-col w-full h-full flex-1 ">
        <div className="w-full bg-white p-3 py-0 ">
          <DataTable columns={columns} data={combinedData} />
        </div>
        <div className="flex items-end justify-end w-full mt-auto  ">
          <ValiderButton />
        </div>
      </section>
    );
  }
  // if there is enseignants in db show them
  if (formattedEns) {
    return (
      <section className=" flex flex-col w-full h-full flex-1 ">
        <div className="w-full bg-white p-3 py-0 ">
          <DataTable columns={columns} data={formattedEns} />
        </div>
        <div className="flex items-end justify-end w-full mt-auto  ">
          {/* <ValiderButton /> */}
        </div>
      </section>
    );
  }

  return (
    <section className=" flex flex-col w-full h-full ">
      <NothingFound
        header="Aucun Enseignant Trouvé!"
        paragraph=" Importer vos enseignants a partir d'un fichier excel"
      />
    </section>
  );
};

export const TableEtud = ({ formattedEtud }: { formattedEtud: Ens[] }) => {
  const { fileDataEtud, savedEtud } = useStore();

  const formattedData =
    fileDataEtud?.map((data) => ({
      nom: getCaseInsensitiveProperty(data, "Nom", ""),
      prenom: getCaseInsensitiveProperty(data, "Prénom", ""),
      email: getCaseInsensitiveProperty(data, "email", ""),
      matricule: getCaseInsensitiveProperty(data, "Matricule", ""),

      specialite: getCaseInsensitiveProperty(data, "spécialité", ""),
    })) ?? [];
  if (!fileDataEtud?.length && !formattedEtud.length) {
    return (
      <section className=" flex flex-col w-full h-full ">
        <NothingFound
          header="Aucun Etudiant Trouvé!"
          paragraph=" Importer vos etudiants a partir d'un fichier excel"
        />
      </section>
    );
  }

  const combinedData = [...formattedData, ...formattedEtud];
  if (formattedData.length > 0) {
    return (
      <section className=" flex flex-col w-full h-full flex-1 ">
        <div className="w-full bg-white p-3 py-0 ">
          <DataTable columns={columnss} data={combinedData} />
        </div>
        <div className="flex items-end justify-end w-full mt-auto  ">
          <ValiderButtonEtud />
        </div>
      </section>
    );
  }
  // if there is etudiants in db show them
  if (formattedEtud) {
    return (
      <section className=" flex flex-col w-full h-full flex-1 ">
        <div className="w-full bg-white p-3 py-0 ">
          <DataTable columns={columnss} data={formattedEtud} />
        </div>
        <div className="flex items-end justify-end w-full mt-auto  ">
          <ValiderButtonEtud />
        </div>
      </section>
    );
  }

  return (
    <section className=" flex flex-col w-full h-full ">
      <NothingFound
        header="Aucun Etudiant Trouvé!"
        paragraph=" Importer vos etudiants a partir d'un fichier excel"
      />
    </section>
  );
};

export function getCaseInsensitiveProperty(
  obj: DataItem | DataItemBinome,
  propertyName: string,
  defaultValue = ""
): string {
  return (
    Object.entries(obj)
      .reduce(
        (acc, [key]) =>
          //@ts-ignore
          key.toLowerCase() === propertyName.toLowerCase() ? obj[key] : acc,
        defaultValue
      )
      ?.toString() || defaultValue
  );
}

export const TableBinome = ({
  formattedBinome,
}: {
  formattedBinome: Binomes[];
}) => {
  const { fileDataBinome } = useStore();

  const formattedData =
    fileDataBinome?.map((data) => ({
      etudiant1: getCaseInsensitiveProperty(data, "etudiant1", ""),
      etudiant2: getCaseInsensitiveProperty(data, "etudiant2", ""),
      matricule1: getCaseInsensitiveProperty(data, "matricule1", ""),
      matricule2: getCaseInsensitiveProperty(data, "matricule2", ""),
    })) ?? [];

  if (!fileDataBinome?.length && !formattedBinome.length) {
    return (
      <section className=" flex flex-col w-full h-full ">
        <NothingFound
          header="Aucun Binome Trouvé!"
          paragraph=" Importer vos Binomes a partir d'un fichier excel"
        />
      </section>
    );
  }
  const combinedData = [...formattedData, ...formattedBinome];
  if (formattedData.length > 0) {
    return (
      <section className=" flex flex-col w-full h-full flex-1 ">
        <div className="w-full bg-white p-3 py-0 ">
          <DataTable
            columns={columnsBinome}
            //@ts-ignore
            data={combinedData}
          />
        </div>
        <div className="flex items-end justify-end w-full mt-auto  ">
          <ValiderButtonBinome />
        </div>
      </section>
    );
  }

  if (formattedBinome) {
    return (
      <section className=" flex flex-col w-full h-full flex-1 ">
        <div className="w-full bg-white p-3 py-0 ">
          <DataTable
            columns={columnsBinome}
            //@ts-ignore
            data={formattedBinome}
          />
        </div>
        <div className="flex items-end justify-end w-full mt-auto  ">
          <ValiderButtonEtud />
        </div>
      </section>
    );
  }

  return (
    <section className=" flex flex-col w-full h-full ">
      <NothingFound
        header="Aucun Etudiant Trouvé!"
        paragraph=" Importer vos Binomes a partir d'un fichier excel"
      />
    </section>
  );
};
