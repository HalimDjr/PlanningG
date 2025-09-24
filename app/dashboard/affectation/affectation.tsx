import { AffecterEncadrant } from "@/components/affectation/affecter-encadrant";
import { AffecterTheme } from "@/components/affectation/affecter-theme";
import { BinomeValideCard } from "@/components/affectation/binome-valide-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EnsNbAffectation,
  getBinomesAffectations,
  getThemeNonAffecter,
} from "@/lib/affectation";
import { currentUser } from "@/lib/current-user";

import Image from "next/image";
import { redirect } from "next/navigation";

type Etudiant = {
  nom: string;
  prenom: string;
  specialite: { nom: string } | null;
};

type Proposer = {
  nom: string;
  prenom: string;
};

type Theme = {
  id: string;
  nom: string;
  proposePar: Proposer | null;
};

type Binome = {
  id: string;
  etudiants: Etudiant[];
};

export interface affectations {
  Binome: {
    id: string;
    etudiants: {
      nom: string;
      prenom: string;

      specialite: {
        nom: string;
      } | null;
    }[];
  };
  Theme: {
    nom: string;
    id: string;
    proposePar: {
      nom: string;
      prenom: string;
    } | null;
  };
}

export const Affectation = async () => {
  const user = await currentUser();

  if (!user?.prenom) {
    redirect("/login");
  }
  const ensNbAffectation = await EnsNbAffectation();
  const themeNonAffecter = await getThemeNonAffecter();

  const { affectations, binomes } = await getBinomesAffectations();
  const affectationsBinomeIds = new Set(
    affectations.map((affectation) => affectation.Binome.id)
  );
  const attenteListe = binomes.filter((binome) => {
    const binomeId = binome.id;
    return !affectationsBinomeIds.has(binomeId);
  });
  //@ts-ignore
  const validatedList: affectations[] = affectations;
  return (
    <Tabs defaultValue="VALIDE" className="w-full h-full border-none">
      <TabsList className="grid w-full grid-cols-2 bg-slate-200">
        <TabsTrigger value="ATTENTE">En attente</TabsTrigger>
        <TabsTrigger value="VALIDE">Binome validé</TabsTrigger>
      </TabsList>
      <TabsContent value="ATTENTE" className="h-full">
        <Card>
          <ScrollArea className="p-2 pb-0 h-[75vh] bg-[#F5F6FB] ">
            <CardContent className="space-y-2 h-full ">
              {!attenteListe.length && (
                <div className="flex flex-col items-center justify-center h-full mt-5">
                  <Image
                    src={"/task-searching.png"}
                    height={160}
                    width={160}
                    alt="searching"
                  />
                  <h1 className="font-semibold mt-3 text-xl">
                    Aucun binôme en attente
                  </h1>
                </div>
              )}
              <div className="grid grid-cols-1  gap-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {!!attenteListe &&
                  attenteListe.map((list) => (
                    <div
                      key={list.id}
                      className="shadow-lg py-3 px-2  bg-white rounded-md flex flex-col gap-y-1"
                      // style={{ border: `1px solid ${stringToColor(list.id)}` }}
                    >
                      <span className="text-primary_purpule text-[15px] font-semibold ml-2">
                        Binome:
                      </span>
                      {list.etudiants.map((e) => (
                        <div key={e.nom} className="ml-2">
                          <p className="text-sm capitalize">
                            {e.nom.toLowerCase()} {e.prenom.toLowerCase()}
                          </p>
                        </div>
                      ))}
                      <div className="w-full flex flex-col gap-y-2 justify-center items-center mt-auto py-3 ">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-[85%] mx-4 bg-[#98BFFB] text-[13px] py-0 rounded-sm h-8 hover:bg-[#98BFFB]/90">
                              Affecter un thème
                            </Button>
                          </DialogTrigger>
                          <AffecterTheme
                            themes={themeNonAffecter}
                            idBinome={list.id}
                          />
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-[85%] mx-4  bg-[#454E8F] text-[13px]  py-0 rounded-sm h-8 hover:bg-[#454E8F]/90">
                              Affecter un encadrant
                            </Button>
                          </DialogTrigger>
                          <AffecterEncadrant
                            ensNbAffectation={ensNbAffectation}
                            idBinome={list.id}
                          />
                        </Dialog>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </TabsContent>
      <TabsContent value="VALIDE" className="h-full border-none">
        <Card className="max-h-screen border-none">
          <ScrollArea className="p-2 h-[75vh] bg-[#F5F6FB] ">
            <CardContent className="space-y-2 h-full py-3 bg-[#F5F6FB]">
              {!validatedList.length && (
                <div className="flex flex-col items-center justify-center h-full mt-5">
                  <Image
                    src={"/task-searching.png"}
                    height={160}
                    width={160}
                    alt="searching"
                  />
                  <h1 className="font-semibold mt-3 text-xl">
                    Aucun binôme validé
                  </h1>
                </div>
              )}
              <div className="grid grid-cols-1  gap-4 gap-y-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 ">
                {!!validatedList &&
                  validatedList.map((v) => (
                    <BinomeValideCard
                      key={v.Binome.id}
                      etudiants={v.Binome.etudiants}
                      theme={v.Theme ? v.Theme.nom : ""}
                      Encadrant={v.Theme ? v.Theme.proposePar : null}
                    />
                  ))}
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
