"use client";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { DeleteConfiguration } from "@/actions/configuration";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { formatDate } from "date-fns";

interface Configuration {
  configuration: {
    id: string;
    dateDebut: Date;
    dateFin: Date;
    heureDebut: string;
    heureFin: string;
    duree: string;
    departementId: string;
  };
}

export const ConfigurationList = ({ configuration }: Configuration) => {
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(() => {
      DeleteConfiguration()
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => toast.success("Something went wrong!"));
    });
  };
  return (
    <section className="flex flex-col gap-y-5 p-3 px-8  h-full w-full">
      <div className="space-y-2">
        <p className="text-slate-500 text-[15px]">Date Début</p>
        <p className="border-b-slate-300 border-b-[1px] pb-2 text-[15px]">
          {formatDate(configuration.dateDebut, "yyyy-MM-dd")}
        </p>
      </div>

      <div className="space-y-2">
        {" "}
        <p className="text-slate-500 text-[15px]">Date Fin</p>
        <p className="border-b-slate-300 border-b-[1px] pb-2 text-[15px]">
          {formatDate(configuration.dateFin, "yyyy-MM-dd")}
        </p>
      </div>
      <div className="space-y-2">
        {" "}
        <p className="text-slate-500 text-[15px]">Heure Début</p>
        <p className="border-b-slate-300 border-b-[1px] pb-2 text-[15px]">
          {configuration.heureDebut}
        </p>
      </div>
      <div className="space-y-2">
        {" "}
        <p className="text-slate-500 text-[15px]">Heure Fin</p>
        <p className="border-b-slate-300 border-b-[1px] pb-2 text-[15px]">
          {configuration.heureFin}
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-slate-500 text-[15px]">Durée</p>
        <p className="border-b-slate-300 border-b-1 pb-2 text-[15px]">
          {configuration.duree}
        </p>
      </div>
      <Button
        size={"sm"}
        className="mt-auto bg-[#17203F]
        
        text-white  hover:bg-[#17203F]/90 py-1"
        onClick={onClick}
      >
        {isPending ? <ClipLoader size={16} color="while" /> : "Reset"}
      </Button>
    </section>
  );
};
