"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { UpdateBinomeButton } from "./update-button";
import { DeleteBinomeButton } from "./delete-button";

export type Binome =
  | {
      etudiant1: string;
      etudiant2?: string | undefined;
      matricule1: string;
      matricule2?: string | undefined;
    }[]
  | undefined;

export const columnsBinome: ColumnDef<Binome>[] = [
  {
    accessorKey: "etudiant1",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Etudiant 1
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "matricule1",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Matricule 1
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "etudiant2",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Etudiant 2
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "matricule2",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Matricule 2
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex ">
          <UpdateBinomeButton
            //@ts-ignore
            matricule1={row.original?.matricule1! || ""}
            //@ts-ignore
            matricule2={row.original?.matricule2! || ""}
          />
          <DeleteBinomeButton //@ts-ignore
            matricule={row.original?.matricule1! || ""}
          />
        </div>
      );
    },
  },
];
