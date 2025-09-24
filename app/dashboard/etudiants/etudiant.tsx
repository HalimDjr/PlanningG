import {
  AjouterButton,
  ImportButton,
} from "@/components/ens-etud/import-ajouter-button";
import { Ens, TableEtud } from "@/components/ens-etud/table";

import { currentUser } from "@/lib/current-user";
import { getEtudiants } from "@/lib/getUsers";
import { getSpecialites } from "@/lib/specialite";

const Etudiant = async () => {
  const user = await currentUser();
  const etudiants = await getEtudiants(user?.departementId);

  const specilaites = await getSpecialites(user?.departementId);
  // parsed etudiants
  const formattedEtud: Ens[] =
    etudiants?.map((data) => ({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      matricule: data.matricule,

      specialite: data.specialite!.nom,
    })) ?? [];
  // parsed etudiants
  return (
    <main className=" flex flex-col h-full p-6 bg-neutral-100">
      <section className="flex justify-end gap-x-4 w-full h-10 mb-4">
        <AjouterButton specialites={specilaites} isEnseignant={false} />
        <ImportButton isEtudiant />
      </section>
      <section className="flex flex-col  w-full flex-grow ">
        <TableEtud formattedEtud={formattedEtud} />
      </section>
    </main>
  );
};

export default Etudiant;
