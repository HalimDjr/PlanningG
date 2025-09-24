import { UpdatePlanningProps } from "@/app/dashboard/_components/modifier-planning";
import { Configuration, Visibility } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "profile"
  | "gestion"
  | "edit"
  | "deletePlanning"
  | "editSoutenance";

interface ModalData {
  config?: Configuration | null;
  editData?: { version: string; etat: Visibility };
  idPlanning?: number;
  soutenanceDetails?: UpdatePlanningProps;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
