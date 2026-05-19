import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken, clearAuthToken } from "../api/client";

interface AuthState {
  token: string | null;
  sellerId: number | null;
  customerId: number | null;
  botId: number | null;
  setToken: (token: string, sellerId: number, customerId: number, botId: number) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      sellerId: null,
      customerId: null,
      botId: null,
      setToken: (token, sellerId, customerId, botId) => {
        setAuthToken(token);
        set({ token, sellerId, customerId, botId });
      },
      clear: () => {
        clearAuthToken();
        set({ token: null, sellerId: null, customerId: null, botId: null });
      },
    }),
    {
      name: "miniapp-auth",
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthToken(state.token);
      },
    }
  )
);
