"use client";

import { stringToColor } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Calendar } from "lucide-react";

interface Speciality {
  specialite: {
    nom: string;
  };
}

type ThemeSpecialites = Speciality[];
interface ThemeItemProps {
  nom: string;
  id: string;
  createdAt: Date;
  specialite?: ThemeSpecialites;
  proposePar: string;
}
export const ThemeItem = ({
  nom,
  specialite,
  proposePar,
  createdAt,
}: ThemeItemProps) => {
  const bg = stringToColor(nom);

  return (
    <div className=" flex flex-col bg-white shadow-md rounded-sm justify-between group  scale-103 transition duration-200 ease-in-out">
      <div>
        <div className="w-full h-1 rounded-t-sm" style={{ background: bg }} />
        <div className="flex justify-between w-full p-2 gap-x-1 gap-y-3">
          <div className=" flex gap-x-1 flex-wrap gap-y-1 flex-1 flex-grow">
            {specialite?.map((s) => (
              <p
                className="text-xs font-semibold rounded-md px-3 py-1.5 flex items-center h-6 text-black bg-slate-200 "
                key={s.specialite.nom}
              >
                {s.specialite.nom}
              </p>
            ))}
          </div>
          <p className=" text-slate-800 text-xs  flex justify-end w-fit text-left ml-auto ">
            {proposePar}
          </p>
        </div>
        <div className="w-full p-4 pb-0 pt-2 rounded-sm text-xs font-medium text-wrap capitalize">
          {nom}
        </div>
      </div>
      <div className="p-2 py-">
        <div className="w-full h-[1px]  bg-slate-300 rounded-lg" />
        <p className="flex gap-x-2 text-slate-700 text-xs capitalize mt-3">
          <Calendar className="h-4 w-4" />

          {`ajouté le ${formatDate(createdAt, "yyyy-MM-dd")}`}
        </p>
      </div>
    </div>
  );
};
