import { OllamaProvider, Provider } from "@/lib/Provider";
import Session from "@/lib/Session";
import { create } from "zustand";

export type AppStoreType = {
  sessions: Session[];
  provider: Provider;
  // setActiveSession: (session: Session) => void;
};

const useAppStore = create<AppStoreType>((set) => ({
  sessions: [],
  provider: new OllamaProvider(),
}));

export { useAppStore };
