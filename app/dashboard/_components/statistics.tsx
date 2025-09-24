import { currentUser } from "@/lib/current-user";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatisticItem } from "./statistic-item";
import { redirect } from "next/navigation";
import { getStatistics } from "@/lib/statistics";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, stringToColor } from "@/lib/utils";
import { Users, UsersRound } from "lucide-react";

type Specialites = {
  Nom: string;
  nbThemes: number | 0;
  nbEnseignants: number | 0;
  nbEtudiants: number | 0;
};
type Enseignants = {
  Nom: string;
  Prenom: string;
  Id: string;
  nbThemes: number | 0;
  nbAffectation: number | 0;
};
let SpecialitesArray: Specialites[] | undefined = [];
let EnseignantsArray: Enseignants[] | undefined = [];
export const Statistics = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    redirect(`/login`);
  }
  const statistics = await getStatistics();
  const nbEnseignants = statistics?.enseignantCount;
  const nbEtudiants = statistics?.etudiantCount;
  const nbSalles = statistics?.salleCount;
  const nbThemes = statistics?.themeCount;
  const specialites = statistics?.specialites;
  const enseignants = statistics?.enseignants;
  const binomes = statistics?.binomeCount;

  SpecialitesArray = specialites?.map((specialite) => ({
    Nom: specialite.nom,
    nbThemes: specialite._count.Theme,
    nbEnseignants: specialite._count.enseignants,
    nbEtudiants: specialite._count.etudiants,
  }));
  EnseignantsArray = enseignants?.map((ens) => ({
    Nom: ens.nom,
    Prenom: ens.prenom,
    Id: ens.id,
    nbThemes: ens._count.themes,
    nbAffectation: ens._count.Affectation,
  }));
  return (
    <main className="flex h-[80vh] w-full  flex-col gap-y-12   p-6 z-0">
      <section className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 place-items-center  ">
        {/* <div className="w-56 h-24 bg-white rounded-lg shadow-md p-3 flex flex-col justify-center relative ">
          <div className="flex gap-x-4 items-center">
            <span
              className={cn(
                "rounded-lg  p-3  flex items-center justify-center bg-[#33D69F3A]"
              )}
            >
              <Users className={cn("size-6 text-[#00D100]")} />
            </span>
            <div className="flex- flex-col ">
              <p className="text-xl font-semibold ">
                {nbEnseignants ? nbEnseignants : 0}
              </p>
              <p className="text-slate-700 ">{"Enseignants"}</p>
            </div>
          </div>
          <div
            className={cn(
              " w-1 h-14 rounded-3xl   absolute right-0 bg-[#00D100]"
            )}
          />
        </div> */}
        <StatisticItem
          text="Enseignants"
          bg={"#00D100"}
          icon={"users"}
          textColor="#00D100"
          lightBg="#33D69F3A"
          nb={nbEnseignants || 0}
        />
        {/* <div className="w-56 h-24 bg-white rounded-lg shadow-md p-3 flex flex-col justify-center relative ">
          <div className="flex gap-x-4 items-center">
            <span
              className={cn(
                "rounded-lg  p-3  flex items-center justify-center bg-[#3179CF3A]"
              )}
            >
              <Users className={cn("size-6 text-[#3179CF]")} />
            </span>
            <div className="flex- flex-col ">
              <p className="text-xl font-semibold ">
                {nbEtudiants ? nbEtudiants : 0}
              </p>
              <p className="text-slate-700 ">{"Etudiants"}</p>
            </div>
          </div>
          <div
            className={cn(
              " w-1 h-14 rounded-3xl   absolute right-0 bg-[#3179CF]"
            )} 
          />
        </div>*/}
        <StatisticItem
          text="Etudiants"
          bg={"#3179CF"}
          icon={"UsersRound"}
          textColor="#3179CF"
          lightBg="#3179CF3A"
          nb={nbEtudiants || 0}
        />
        {/* <div className="w-56 h-24 bg-white rounded-lg shadow-md p-3 flex flex-col justify-center relative ">
          <div className="flex gap-x-4 items-center">
            <span
              className={cn(
                "rounded-lg  p-3  flex items-center justify-center bg-[#FEE6C8]"
              )}
            >
              <Users className={cn("size-6 text-[#F39E43]")} />
            </span>
            <div className="flex- flex-col ">
              <p className="text-xl font-semibold ">
                {nbSalles ? nbSalles : 0}
              </p>
              <p className="text-slate-700 ">{"Salles"}</p>
            </div>
          </div>
          <div
            className={cn(
              " w-1 h-14 rounded-3xl   absolute right-0 bg-[#F39E43]"
            )}
          />
        </div> */}
        <StatisticItem
          text="Salles"
          bg={"#F39E43"}
          icon={"DoorOpen"}
          textColor="#F39E43"
          lightBg="#FEE6C8"
          nb={nbSalles || 0}
        />
        {/* <div className="w-56 h-24 bg-white rounded-lg shadow-md p-3 flex flex-col justify-center relative ">
          <div className="flex gap-x-4 items-center">
            <span
              className={cn(
                "rounded-lg  p-3  flex items-center justify-center bg-[#FBD9DA]"
              )}
            >
              <Users className={cn("size-6 text-[#EE4650]")} />
            </span>
            <div className="flex- flex-col ">
              <p className="text-xl font-semibold ">
                {nbEnseignants ? nbEnseignants : 0}
              </p>
              <p className="text-slate-700 ">{"Enseigan"}</p>
            </div>
          </div>
          <div
            className={cn(
              " w-1 h-14 rounded-3xl   absolute right-0 bg-[#EE4650]"
            )}
          />
        </div> */}
        <StatisticItem
          text="Thèmes"
          bg={"#EE4650"}
          icon={"PaletteIcon"}
          textColor="#EE4650"
          lightBg="#FBD9DA"
          nb={nbThemes || 0}
        />
        {/* <div className="w-56 h-24 bg-white rounded-lg shadow-md p-3 flex flex-col justify-center relative ">
          <div className="flex gap-x-4 items-center">
            <span
              className={cn(
                "rounded-lg  p-3  flex items-center justify-center bg-[#ded4e1]"
              )}
            >
              <Users className={cn("size-6 text-[#5b1c62]")} />
            </span>
            <div className="flex- flex-col ">
              <p className="text-xl font-semibold ">
                {nbEnseignants ? nbEnseignants : 0}
              </p>
              <p className="text-slate-700 ">{"Enseigan"}</p>
            </div>
          </div>
          <div
            className={cn(
              " w-1 h-14 rounded-3xl   absolute right-0 bg-[#5b1c62]"
            )}
          />
        </div> */}
        <StatisticItem
          text="Binomes"
          bg={"#5b1c62"}
          icon={"GraduationCap"}
          textColor="#5b1c62"
          lightBg="#ded4e1"
          nb={binomes || 0}
        />
      </section>
      <section className="w-full flex lg:justify-between lg:flex-row gap-y-4 flex-col gap-x-3 h-[85vh] flex-1 mt-4">
        <ScrollArea className="lg:w-[55%] bg-white rounded-md p-4 lg:h-[55vh] h-64 w-full">
          <h1 className="p-2 font-bold text-base mb-2">
            Spécialitées Statistics
          </h1>
          <Table className="border p-2 px-4 rounded-md ">
            <TableHeader className="bg-[#C8C9E6]/30 px-3 text-center">
              <TableRow>
                <TableHead className="w-[100px] text-center text-[13px]">
                  Spécialitée
                </TableHead>
                <TableHead className="text-center w-[100px] text-[13px]">
                  NB Enseignants
                </TableHead>
                <TableHead className="text-center w-[100px] text-[13px]">
                  NB Etuddiants
                </TableHead>
                <TableHead className="text-center w-[100px] text-[13px]">
                  NB Thèmes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SpecialitesArray?.map((spe) => (
                <TableRow key={spe.Nom} className="px-3 text-center">
                  <TableCell className="flex items-center justify-center">
                    <p
                      className={cn(
                        "text-xs font-semibold rounded-lg px-3 py-1 text-black size-fit text-center"
                      )}
                      style={{
                        color: `${stringToColor(spe.Nom)}`,
                        backgroundColor: hexToRgba(stringToColor(spe.Nom), 0.2),
                      }}
                    >
                      {spe.Nom}
                    </p>
                  </TableCell>
                  <TableCell className="font-medium px-4 text-center">
                    {spe.nbEnseignants}
                  </TableCell>
                  <TableCell className="font-medium px-4 text-center">
                    {spe.nbEtudiants}
                  </TableCell>
                  <TableCell className="font-medium px-4 text-center">
                    {spe.nbThemes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <ScrollArea className=" bg-white rounded-md p-4 lg:w-[45%] lg:h-[55vh] h-64 px-4 w-full">
          <h1 className="p-2 font-bold text-base mb-2">
            Enseignants Statistics
          </h1>
          <Table className="border p-2 px-4 rounded-md ">
            <TableHeader className="bg-[#C8C9E6]/30 px-3 text-center">
              <TableRow>
                <TableHead className="w-[100px] pl-4 text-[13px]">
                  Enseignant
                </TableHead>

                <TableHead className="text-center w-[100px] text-[13px]">
                  NB Thèmes
                </TableHead>
                <TableHead className="text-center w-[100px] text-[13px]">
                  NB Affectation
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EnseignantsArray?.map((ens) => (
                <TableRow key={ens.Id} className=" text-">
                  <TableCell className="flex items-center justify-start pl-4 text-[13px]">
                    {ens.Nom} {ens.Prenom}
                  </TableCell>

                  <TableCell className="font-medium px-4 text-center">
                    {ens.nbThemes}
                  </TableCell>
                  <TableCell className="font-medium px-4 text-center">
                    {ens.nbAffectation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </section>
    </main>
  );
};
export function hexToRgba(hex: string, opacity: number): string {
  hex = hex.replace("#", "");

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

{
  /* <div className="w-56 h-24 bg-white rounded-lg shadow-md p-3 flex flex-col  justify-center relative ">
          <div className="flex gap-x-4 items-center">
            <span className="rounded-full  p-3 bg-[#55D35F] flex items-center justify-center">
              <Users className="size-6 text-white" />
            </span>
            <div className="flex- flex-col  ">
              <p className="text-xl font-semibold ">35</p>
              <p className="text-slate-500 ">Enseignants</p>
            </div>
          </div>
          <div className="flex justify-end w-1 h-14 rounded-3xl bg-[#55D35F] absolute right-0 " />
        </div>
        <div className="w-56 h-24 bg-white rounded-lg shadow-md p-3 flex flex-col  justify-center relative ">
          <div className="flex gap-x-4 items-center">
            <span className="rounded-full  p-3 bg-[#3179CF] flex items-center justify-center">
              <UsersRound className="size-6 text-white" />
            </span>
            <div className="flex- flex-col  ">
              <p className="text-xl font-semibold ">128</p>
              <p className="text-slate-500 "> Etudiants</p>
            </div>
          </div>
          <div className="flex justify-end w-1 h-14 rounded-3xl bg-[#3179CF] absolute right-0 " />
        </div>
        <div className="w-56 h-24 bg-white rounded-lg shadow-md p-3 flex flex-col  justify-center relative ">
          <div className="flex gap-x-4 items-center">
            <span className="rounded-full  p-3 bg-[#F39E43] flex items-center justify-center">
              <DoorOpen className="size-6 text-white" />
            </span>
            <div className="flex- flex-col  ">
              <p className="text-xl font-semibold ">35</p>
              <p className="text-slate-500 ">Salles</p>
            </div>
          </div>
          <div className="flex justify-end w-1 h-14 rounded-3xl bg-[#F39E43] absolute right-0 " />
        </div>
        <div className="w-56 h-24 bg-white rounded-lg shadow-md p-3 flex flex-col  justify-center relative ">
          <div className="flex gap-x-4 items-center">
            <span className="rounded-full  p-3 bg-[#EE4650] flex items-center justify-center">
              <PaletteIcon className="size-6 text-white" />
            </span>
            <div className="flex- flex-col  ">
              <p className="text-xl font-semibold ">75</p>
              <p className="text-slate-500 "> Thèmes</p>
            </div>
          </div>
          <div className="flex justify-end w-1 h-14 rounded-3xl bg-[#EE4650] absolute right-0 " />
        </div> */
}
