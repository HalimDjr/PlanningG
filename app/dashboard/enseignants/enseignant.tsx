import {
  AjouterButton,
  ImportButton,
} from "@/components/ens-etud/import-ajouter-button";
import { Ens, TableEns } from "@/components/ens-etud/table";

import { currentUser } from "@/lib/current-user";
import { getEnseignants } from "@/lib/getUsers";
import { getGrades } from "@/lib/grade";
import { getSpecialites } from "@/lib/specialite";

const Enseignant = async () => {
  const user = await currentUser();
  const enseignants = await getEnseignants(user?.departementId);
  const grades = await getGrades(user?.departementId);
  const specilaites = await getSpecialites(user?.departementId);
  // parsed enseignats
  const formattedEns: Ens[] =
    enseignants?.map((data) => ({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      matricule: data.matricule,

      specialite: data.specialite.nom,
      grade: data.grade,
    })) ?? [];
  // parsed enseignants
  return (
    <main className=" flex flex-col h-full p-6 bg-main">
      <section className="flex justify-end gap-x-4 w-full h-10 mb-4">
        <AjouterButton specialites={specilaites} grades={grades} isEnseignant />
        <ImportButton isEtudiant={false} />
      </section>
      <section className="flex flex-col  w-full flex-grow ">
        <TableEns formattedEns={formattedEns} />
      </section>
    </main>
  );
};

export default Enseignant;
