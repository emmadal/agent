import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { initialState, IState } from "./state";
import { Action } from "./action";

const SecureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await SecureStore.getItemAsync(name);
    return value || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useStoreApp = create(
  persist<IState & Action>(
    (set) => ({
      ...initialState,
      updateState: ({ user, team, token }) => {
        set((state) => ({
          ...state,
          user,
          team,
          token,
          isSignout: false,
        }));
      },
      updatePhoto: (picture) =>
        set((state) => ({ user: { ...state.user, picture } })),
      updateToken: (token) => set((state) => ({ ...state, token })),
      updateProfile: (user) =>
        set((state) => ({ user: { ...state.user, ...user } })),
      signOut: () => set(initialState),
    }),
    {
      name: "agent_str",
      storage: createJSONStorage(() => SecureStorage),
    },
  ),
);
