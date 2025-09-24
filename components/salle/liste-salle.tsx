import { ScrollArea } from "../ui/scroll-area";
import { SalleItem } from "./salle-item";

interface ListeSallesInterface {
  salles:
    | {
        bloc: number;
        numero: number;
        id: string;
      }[]
    | null;
}
export const ListeSalles = ({ salles }: ListeSallesInterface) => {
  return (
    <main className="flex flex-col w-[90vh] border rounded-s-sm  gap-y-4 items-center overflow-y-auto">
      <div className="flex items-center justify-between border-b bg-[#C8C9E6]/30 py-4 px-6 w-full">
        <div className="w-1/4 text-slate-500"></div>
        <div className="w-1/4 text-slate-500">Bloc</div>
        <div className="w-1/4 text-slate-500">Salle</div>
        <div className="w-1/4 text-slate-500"> Action</div>
      </div>

      <ScrollArea className="flex flex-col h-96 md:h-[480px]  items-center justify-between border-b  py-2 px-6 w-full bg-white">
        {salles?.map((salle, _index) => {
          return (
            <SalleItem
              key={salle.id}
              bloc={salle.bloc}
              numero={salle.numero}
              index={_index + 1}
              id={salle.id}
            />
          );
        })}
      </ScrollArea>
    </main>
  );
};
