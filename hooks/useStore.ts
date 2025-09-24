import { create } from "zustand";

interface DataState {
  fileDataEns: DataItem[] | null;
  fileDataEtud: DataItem[] | null;
  fileDataBinome: DataItemBinome[] | null;
  error: string | null;
  errorEtud: string | null;
  errorBinome: string | null;
  savedEns: boolean;
  savedEtud: boolean;
  setfileDataEns: (data: DataItem[]) => void;
  setfileDataEtud: (data: DataItem[]) => void;
  setfileDataBinome: (data: DataItemBinome[]) => void;
  setError: (message: string) => void;
  setErrorEtud: (message: string) => void;
  setErrorBinome: (message: string) => void;
  setsavedEns: (message: boolean) => void;
  setsavedEtud: (message: boolean) => void;
}
export interface DataItem {
  Nom: string;
  Prenom: string;
  Email: string;
  Matricule: string;
  Spécialité: string;
  Grade?: string;
}
export interface DataItemBinome {
  etudiant1: string;
  etudiant2?: string;
  matricule1?: string;
  matricule2?: string;
}

const useStore = create<DataState>((set) => ({
  fileDataEns: null,
  fileDataEtud: null,
  fileDataBinome: null,
  savedEns: false,
  savedEtud: false,
  setfileDataEns: (data: DataItem[]) => set({ fileDataEns: data }),
  setfileDataEtud: (data: DataItem[]) => set({ fileDataEtud: data }),
  setfileDataBinome: (data: DataItemBinome[]) => set({ fileDataBinome: data }),
  error: null,
  errorEtud: null,
  errorBinome: null,
  setError: (message: string | null) => set({ error: message }),
  setErrorEtud: (message: string | null) => set({ errorEtud: message }),
  setErrorBinome: (message: string | null) => set({ errorBinome: message }),
  setsavedEns: (message: boolean) => set({ savedEns: message }),
  setsavedEtud: (message: boolean) => set({ savedEtud: message }),
}));
export default useStore;
