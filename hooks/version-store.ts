import { create } from "zustand";

interface DataState {
  version: string | null;

  setVersion: (data: string) => void;
}

const useVersionStore = create<DataState>((set) => ({
  version: null,

  setVersion: (data: string) => set({ version: data }),
}));
export default useVersionStore;
