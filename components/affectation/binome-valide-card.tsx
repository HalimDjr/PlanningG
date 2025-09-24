import { stringToColor } from "@/lib/utils";

interface BinomeValideCardProp {
  etudiants: {
    nom: string;
    prenom: string;
    specialite: {
      nom: string;
    } | null;
  }[];
  theme: string;
  Encadrant: {
    nom: string;
    prenom: string;
  } | null;
}

export const BinomeValideCard = ({
  etudiants,
  theme,
  Encadrant,
}: BinomeValideCardProp) => {
  return (
    <div className="flex flex-col gap-y-2 rounded-md p-2 relative group shadow-lg bg-white">
      <div
        className="left-0 top-0 rounded-s-3xl absolute w-1 h-full "
        style={{
          backgroundColor: stringToColor(theme || ""),
        }}
      />
      <span className="text-primary_purpule text-sm font-semibold ml-2">
        Binome:
      </span>
      <div className=" flex justify-between gap-y-2 ml-3">
        {etudiants?.map((s) => (
          <div className="flex  w-full justify-between   " key={s.nom}>
            <p className="  text-[14px]  text-black w-full ">
              {s.nom} {s.prenom}
            </p>
            {/* <p
              className={cn(
                "text-xs font-semibold rounded-md px-2 py-0 text-black flex items-center bg-slate-300 "
              )}
              // style={{
              //   color: `${stringToColor(s.specialite?.nom || "")}`,
              //   backgroundColor: hexToRgba(
              //     stringToColor(s.specialite?.nom || ""),
              //     0.2
              //   ),
              // }}
            >
              {s.specialite?.nom}
            </p> */}
          </div>
        ))}
      </div>
      <span className="text-primary_purpule text-sm font-semibold ml-2">
        Encadrant:
      </span>
      <p className="  text-[13px]  text-black w-fit ml-3 ">
        {Encadrant?.nom} {Encadrant?.prenom}
      </p>
      <span className="text-primary_purpule text-sm font-semibold ml-2">
        Thème:
      </span>
      <p className="  text-[13px]  text-black w-fit ml-3 ">{theme}</p>
    </div>
  );
};
