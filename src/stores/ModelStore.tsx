import { Model } from "@/lib/Model";
import { Provider } from "@/lib/Provider";
import { create } from "zustand";

export type ModelStoreType = {
  models: Model[];

  loadModelFromProvider: (provider: Provider) => void;
  setModels: (models: Model[]) => void;
};

export const useModelStore = create<ModelStoreType>((setter) => ({
  models: new Array<Model>(),

  async loadModelFromProvider(provider: Provider) {
    /**
     * Fetch models from provider
     */
    const models = await provider.fetchModels();

    setter((state) => ({
      ...state,
      models: models,
    }));
  },

  setModels(models) {
    setter((state) => ({
      ...state,
      models,
    }));
  },
}));
