import { NothingFound } from "@/components/nothing-found";
import { AjouterButton } from "@/components/salle/ajouter-model";
import { ListeSalles } from "@/components/salle/liste-salle";
import { currentUser } from "@/lib/current-user";
import { getSalles } from "@/lib/salles";
import { cn } from "@/lib/utils";

const Salle = async () => {
  const user = await currentUser();

  const salles = await getSalles(user?.departementId);
  return (
    <main className=" flex  h-full md:justify-between p-6 items-center bg-main flex-col md:flex-row md:items-start gap-4 md:gap-x-10">
      <section
        className={cn(
          " flex-1  flex items-center justify-center h-full",
          salles?.length && "items-start"
        )}
      >
        {!salles?.length && (
          <NothingFound
            src="/note.svg"
            header="Aucune Salle Trouvé!"
            paragraph=" Ajouter vos salles "
          />
        )}
        {!!salles?.length && <ListeSalles salles={salles} />}
      </section>
      <section className="  flex   ">
        <AjouterButton />
      </section>
    </main>
  );
};

export default Salle;
