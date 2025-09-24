"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { DeleteEnsButton } from "./delete-button";
import { UpdateEnsButton } from "./update-button";

export type EnsEtud =
  | {
      nom: string;
      prenom: string;

      email: string;
      matricule: string;
      specialite: string;
      grade?: string;
    }
  | undefined;

export const columns: ColumnDef<EnsEtud>[] = [
  {
    accessorKey: "nom",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "prenom",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prenom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "matricule",
    header: "Matricule",
  },
  {
    accessorKey: "specialite",
    header: "Spécialié",
  },
  {
    accessorKey: "grade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grade
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
          <UpdateEnsButton
            email={row.original?.email || ""}
            matricule={row.original?.matricule || ""}
            nom={row.original?.nom || ""}
            prenom={row.original?.prenom || ""}
            specialite={row.original?.specialite || ""}
            grade={row.original?.grade || ""}
          />

          <DeleteEnsButton email={row.original?.email || ""} />
        </div>
      );
    },
  },
];
