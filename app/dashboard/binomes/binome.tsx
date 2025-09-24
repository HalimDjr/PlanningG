import {
  AjouterButton,
  ImportButton,
} from "@/components/ens-etud/import-ajouter-button";
import { TableBinome } from "@/components/ens-etud/table";
import { currentUser } from "@/lib/current-user";
import { getBinomes } from "@/lib/getUsers";

export interface Binomes {
  etudiant1: string;
  etudiant2?: string;
  matricule1: string;
  matricule2?: string;
}
const Binomes = async () => {
  const user = await currentUser();
  if (!user) return null;
  const binomes = await getBinomes();

  // parsed binomes
  const formattedBinome: Binomes[] =
    binomes?.map((data) => ({
      etudiant1: data.etudiants[0]
        ? `${data.etudiants[0]?.nom} ${data.etudiants[0]?.prenom}`
        : "",
      matricule1: data.etudiants[0]?.matricule,
      etudiant2: data.etudiants[1]
        ? `${data.etudiants[1]?.nom} ${data.etudiants[1]?.prenom}`
        : "",
      matricule2: data.etudiants[1]?.matricule || "",
    })) ?? [];
  return (
    <main className=" flex flex-col h-full p-6 bg-main">
      <section className="flex justify-end gap-x-4 w-full h-10 mb-4">
        <AjouterButton isEnseignant={false} isBinome />
        <ImportButton isEtudiant={false} isBinome />
      </section>
      <section className="flex flex-col  w-full flex-grow ">
        <TableBinome formattedBinome={formattedBinome} />
      </section>
    </main>
  );
};

export default Binomes;
