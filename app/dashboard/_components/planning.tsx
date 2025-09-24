"use client";

import { CircleHelp, FileUpIcon, SquarePenIcon } from "lucide-react";
import {
  Binomee,
  Examinateur,
  President,
  Sallee,
  planning,
} from "../calendrier/calendrier";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { cn, stringToColor } from "@/lib/utils";
import { hexToRgba } from "./statistics";
import useVersionStore from "@/hooks/version-store";
import { useEffect, useRef, useState, useTransition } from "react";
import { getPlanningByVersion } from "@/actions/version";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

import { useModal } from "@/hooks/modal-store";
import { Button } from "@/components/ui/button";

export type planningWithDate = {
  salle: Sallee | null;
  date: string;
  heure: string;
  examinateurs: Examinateur[];
  Binome: Binomee | null;
  id: number;
  planningId: number;
  president: President | null;
};
export const Planning = ({ resultat }: { resultat: planning[] }) => {
  const planningWithDateAndTime: planningWithDate[] = [];
  const planningWithoutDateAndTime: planning[] = [];
  const [content, setContent] = useState(resultat);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();
  const { onOpen } = useModal();

  const { version } = useVersionStore();
  useEffect(() => {
    setMounted(true);
    if (version) {
      startTransition(() => {
        getPlanningByVersion(version).then((data) => {
          if (data.planning) {
            setContent(data.planning);
          }
        });
      });
    }
  }, [router, version]);

  content?.forEach((itemPlanning) => {
    if (itemPlanning.date && itemPlanning.heure) {
      planningWithDateAndTime.push(itemPlanning as planningWithDate);
    } else {
      planningWithoutDateAndTime.push(itemPlanning);
    }
  });

  const sortedPlanning = planningWithDateAndTime.sort((a, b) => {
    const aDateTime = `${a.date} ${a.heure}`;
    const bDateTime = `${b.date} ${b.heure}`;
    const aDateObj = new Date(aDateTime);
    const bDateObj = new Date(bDateTime);
    if (aDateObj < bDateObj) {
      return -1;
    } else if (aDateObj > bDateObj) {
      return 1;
    } else {
      return 0;
    }
  });
  const planningByDate = sortedPlanning.reduce(
    (groupedPlanning: Record<string, planning[]>, item) => {
      const date = item.date;
      if (!groupedPlanning[date]) {
        groupedPlanning[date] = [];
      }
      groupedPlanning[date].push(item);
      return groupedPlanning;
    },
    {}
  );
  if (isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center ">
        <ClipLoader className="size-12 text-primary_purpule" />
      </div>
    );
  }

  const handleExportClick = async () => {
    if (isExporting) return;

    setIsExporting(true);

    const input = pdfRef.current;
    if (!input) {
      return;
    }
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      // Calculate optimal image scaling to fit the page
      const widthRatio = pdfWidth / imgWidth;
      const heightRatio = pdfHeight / imgHeight;
      const scale = Math.min(widthRatio, heightRatio);

      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;
      const leftMargin = (pdfWidth - finalWidth) / 2;
      const topMargin = 10;
      const bottomMargin = 10;

      pdf.addImage(imgData, "PNG", 10, 10, finalWidth - 5, finalHeight - 20);

      setIsExporting(false);
      pdf.save("planning.pdf");
    });
  };

  if (!mounted) {
    return null;
  }
  return (
    <section className="flex flex-col w-full h-full ">
      <div className="w-fit -mt-10 mb-4  flex justify-start items-start">
        <Button
          type="button"
          onClick={handleExportClick}
          disabled={isExporting}
          className="bg-black text-white min-w-[100px]"
        >
          <FileUpIcon className="h-5 w-5 mr-2 " />
          {isExporting ? "Exportation..." : "Exporter  "}
        </Button>
      </div>
      <div className="flex flex-col w-full h-full gap-y-4" ref={pdfRef}>
        {Object.keys(planningByDate).map((date) => (
          <div key={date} className="mt-">
            <h1
              className={cn(
                "text-base font-semibold rounded-md  px-4 py-1.5 text-black size-fit text-center mb-4"
              )}
              style={{
                color: `${stringToColor(date)}`,
                backgroundColor: hexToRgba(stringToColor(date), 0.2),
              }}
            >
              {date}
            </h1>
            <div className="grid grid-cols-1  gap-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
              {/* afficher planning items for this date */}
              {planningByDate[date].map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-y-3 rounded-md p-2 relative group"
                  style={{
                    backgroundColor: hexToRgba(
                      stringToColor(item.Binome?.Affectation?.Theme?.nom || ""),
                      0.05
                    ),
                  }}
                >
                  <div
                    className="left-0 top-0 rounded-s-3xl absolute w-1 h-full "
                    style={{
                      backgroundColor: hexToRgba(
                        stringToColor(
                          item.Binome?.Affectation?.Theme?.nom || ""
                        ),
                        0.5
                      ),
                    }}
                  />
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 text-sm">Binome:</span>
                      <div className=" text-slate-700 flex opacity-0 group-hover:opacity-100 transition-all  gap-x-2">
                        <Pop theme={item.Binome?.Affectation?.Theme?.nom} />
                        <SquarePenIcon
                          className="text-slate-600 h-5 w-5 cursor-pointer"
                          onClick={() =>
                            onOpen("editSoutenance", {
                              soutenanceDetails: {
                                date: item.date,
                                heure: item.heure,
                                planningId: item.planningId,
                                id: item.id,
                                president: item.president,
                                idEncadrant:
                                  item.Binome?.Affectation?.encadrent?.id,
                                soutenanceId: item.id,
                                Examinateur1: item.examinateurs[0],
                                Examinateur2: item.examinateurs[1],
                                salle: item.salle,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      {item.Binome?.etudiants.map((s) => (
                        <div
                          className="flex  w-full justify-between   "
                          key={s.nom}
                        >
                          <p className="  text-sm  text-black w-fit ">
                            {s.nom} {s.prenom}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-x-2">
                      <span className="text-slate-600 text-sm">Encadrant:</span>
                      <p className="flex gap-x-2  text-sm  text-black w-fit ">
                        {item.Binome?.Affectation?.encadrent?.nom}{" "}
                        {item.Binome?.Affectation?.encadrent?.prenom}{" "}
                      </p>
                    </div>

                    <div className="flex gap-x-2">
                      <span className="text-slate-700 text-[14px]">
                        Président:
                      </span>
                      <div className="flex gap-x-2  text-sm  text-black w-fit ">
                        {item.president ? (
                          <>
                            {" "}
                            {item.president?.nom} {item.president?.prenom}
                          </>
                        ) : (
                          <span className="size-fit px-2 py-1 bg-[#FF00001A] text-[#FF0000] ">
                            Aucune Président associé
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="text-slate-600 text-sm">
                        Examinateurs:
                      </span>
                      <div>
                        {!!item.examinateurs.length ? (
                          item.examinateurs?.map((s) => (
                            <div
                              className="flex  w-full justify-between   "
                              key={s.enseignant?.nom}
                            >
                              <p className="  text-sm  text-black w-fit ">
                                {s.enseignant?.nom} {s.enseignant?.prenom}
                              </p>
                            </div>
                          ))
                        ) : (
                          <span className="size-fit px-2 py-1 bg-[#FF00001A] text-[#FF0000] ">
                            Aucune examinateur associé
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-x-4 items-center text-wrap">
                      <span className="text-slate-600 text-[14px]">Salle:</span>
                      <div className="flex gap-x-2  text-sm  text-black w-fit ">
                        {item.salle ? (
                          `Bloc: ${item.salle.bloc} N°: ${item.salle.numero} `
                        ) : (
                          <span className="size-fit px-2 py-1 bg-[#FF00001A] text-[#FF0000] ">
                            Aucune salle associé
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-x-3 items-center ">
                      <span className="text-slate-600 text-[14px]">Heure:</span>
                      <p className="flex gap-x-2  text-sm  text-black w-fit ">
                        {item.heure}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!!planningWithoutDateAndTime.length && (
          <>
            <h1
              className={cn(
                "text-base font-semibold rounded-md  px-4 py-1.5 bg-[#FF00001A] text-[#FF0000]  size-fit text-center my-3"
              )}
            >
              Soutenances qui ne peuvent pas etre réalisées durant les dates
              sitées
            </h1>
            <div className="grid grid-cols-1  gap-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
              {planningWithoutDateAndTime.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-y-3 rounded-md p-2 relative group"
                  style={{
                    backgroundColor: hexToRgba(
                      stringToColor(item.Binome?.Affectation?.Theme?.nom || ""),
                      0.05
                    ),
                  }}
                >
                  <div
                    className="left-0 top-0 rounded-s-3xl absolute w-1 h-full "
                    style={{
                      backgroundColor: hexToRgba(
                        stringToColor(
                          item.Binome?.Affectation?.Theme?.nom || ""
                        ),
                        0.5
                      ),
                    }}
                  />
                  <div className="flex flex-col gap-y-2 ml-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 text-sm">Binome:</span>
                      <div className=" text-slate-700 flex opacity-0 group-hover:opacity-100 transition-all gap-x-2">
                        <Pop theme={item.Binome?.Affectation?.Theme?.nom} />
                      </div>
                    </div>
                    <p>
                      {item.Binome?.etudiants.map((s) => (
                        <div
                          className="flex  w-full justify-between   "
                          key={s.nom}
                        >
                          <p className="  text-sm  text-black w-fit ">
                            {s.nom} {s.prenom}
                          </p>
                        </div>
                      ))}
                    </p>

                    <div className="flex gap-x-2">
                      <span className="text-slate-600 text-sm">Encadrant:</span>
                      <p className="flex gap-x-2  text-sm  text-black w-fit ">
                        {item.Binome?.Affectation?.encadrent?.nom}{" "}
                        {item.Binome?.Affectation?.encadrent?.prenom}{" "}
                      </p>
                    </div>

                    <div className="flex gap-x-2">
                      <span className="text-slate-700 text-[14px]">
                        Président:
                      </span>
                      <div className="flex gap-x-2  text-sm  text-black w-fit ">
                        {item.president ? (
                          <>
                            {" "}
                            {item.president?.nom} {item.president?.prenom}
                          </>
                        ) : (
                          <span className="size-fit px-2 py-1 bg-[#FF00001A] text-[#FF0000] ">
                            Aucune Président associé
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="text-slate-600 text-sm">
                        Examinateurs:
                      </span>
                      <div>
                        {!!item.examinateurs.length ? (
                          item.examinateurs?.map((s) => (
                            <div
                              className="flex  w-full justify-between   "
                              key={s.enseignant?.nom}
                            >
                              <p className="  text-sm  text-black w-fit ">
                                {s.enseignant?.nom} {s.enseignant?.prenom}
                              </p>
                            </div>
                          ))
                        ) : (
                          <span className="size-fit px-2 py-1 bg-[#FF00001A] text-[#FF0000] ">
                            Aucune examinateur associé
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-x-4 items-center text-wrap">
                      <span className="text-slate-600 text-[14px]">Salle:</span>
                      <div className="flex gap-x-2  text-sm  text-black w-fit ">
                        {item.salle ? (
                          `Bloc: ${item.salle.bloc} N°: ${item.salle.numero} `
                        ) : (
                          <span className="size-fit px-2 py-1 bg-[#FF00001A] text-[#FF0000] ">
                            Aucune salle associé
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
  // <div className="grid grid-cols-1  gap-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
  //   {planningWithDateAndTime?.map((item) => (
  //     <div
  //       className=" flex flex-col bg-white shadow-lg justify-between group hover:opacity-75 scale-103"
  //       key={item.id}
  //     >
  //       <div>
  //         <div
  //           className="w-full h-1 rounded-t-sm"
  //           // style={{ background: bg }}
  //         />
  //         <div className=" w-full p-2 gap-x-3 py-2 flex ">
  //           <span className="font-semibold text-[17px]"> Binome:</span>
  //           <div className="w-full  ">
  //             {item.Binome?.etudiants.map((s) => (
  //               <div className="flex flex-col w-full pt-0.5 " key={s.nom}>
  //                 <p className="  text-[15px]  text-black w-full ">
  //                   {s.nom} {s.prenom}
  //                 </p>
  //               </div>
  //             ))}
  //           </div>
  //           <div className=" text-slate-700 flex opacity-0 group-hover:opacity-100 transition-all gap-x-2">
  //             <Pop theme={item.Binome?.Affectation?.Theme.nom} />
  //           </div>
  //         </div>

  //         <div className="w-full p-3  text-[15px] font-medium flex flex-col gap-y-1 capitalize">
  //           <p className="flex gap-x-2">
  //             <span className="font-semibold text-[17px]"> Encadrant: </span>
  //             {item.Binome?.Affectation?.encadrent?.nom}{" "}
  //             {item.Binome?.Affectation?.encadrent?.prenom}{" "}
  //           </p>

  //           <p className="flex gap-x-2">
  //             <span className="font-semibold text-[17px]"> Président: </span>{" "}
  //             {item.president?.nom} {item.president?.prenom}
  //           </p>
  //           <div className="flex justify-between w-full p-2 gap-x-3 py-2">
  //             <span className="font-semibold text-[17px]"> Encadrant: </span>
  //             <div className="w-full  ">
  //               {item.examinateurs.map((s) => (
  //                 <div
  //                   className="flex flex-col w-full pt-0.5 "
  //                   key={s.enseignant.nom}
  //                 >
  //                   <p className="   text-[15px]  text-black w-full ">
  //                     {s.enseignant.nom} {s.enseignant.prenom}
  //                   </p>
  //                 </div>
  //               ))}
  //               <p className="   text-[15px]  text-black w-full ">
  //                 Bloc: {item.salle?.bloc} N°: {item.salle?.numero}
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div>
  //         <p className="flex flex-col gap-y-1 text-slate-700 text-[16px] capitalize mt-1 px-2">
  //           <span>
  //             {" "}
  //             {`Date: ${formatDate(item.date || "", "yyyy-MM-dd")}`}
  //           </span>
  //           {`Heure: ${item.heure} `}
  //         </p>
  //       </div>
  //     </div>
  //   ))}
  // </div>
};

const Pop = ({ theme }: { theme: string | undefined }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CircleHelp className="text-slate-600 h-5 w-5 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className="w-56 z-40 bg-white" side="bottom">
          <p>{theme}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// {resultat.map((item) => (
//   <div
//     key={item.toString() || "message"}
//     className={`p-4 border rounded-md ${
//       typeof item === "string"
//         ? "bg-gray-200"
//         : item.salle?.bloc && item.date
//         ? "bg-[#FFFDE7]"
//         : "bg-red-200"
//     }`}
//   >
//     {typeof item === "string" ? (
//       <p className="text-red-500">{item}</p>
//     ) : (
//       <>
//         <h3 className="font-bold text-primary_blue">
//           Binome:{" "}
//           {item.Binome?.etudiants.map((e) => (
//             <p key={e.nom}>
//               {e.nom} {e.prenom}
//             </p>
//           ))}
//         </h3>
//         <p className="text-sm">
//           Encadrant: {item.Binome?.Affectation?.encadrent?.nom}{" "}
//           {item.Binome?.Affectation?.encadrent?.prenom}
//         </p>
//         <p>
//           President: {item.president?.nom} {item.president?.prenom}
//         </p>
//         <p>
//           Examinateurs:{" "}
//           {item.examinateurs?.map((e) => (
//             <p key={e.enseignant.nom}>
//               {" "}
//               {e.enseignant.nom} {e.enseignant.prenom}
//             </p>
//           ))}
//         </p>
//         <div>
//           {item.salle && item.date ? (
//             <>
//               Salle: {item.salle.bloc} {item.salle.numero}
//               <br />
//               Date: {item.date}
//               <br />
//               Heure: {item.heure}
//             </>
//           ) : (
//             <p>Salle ou date non disponible</p>
//           )}
//         </div>
//       </>
//     )}
//   </div>
// ))}
