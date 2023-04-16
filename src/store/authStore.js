import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        login: (user) => {
          set(() => ({ isAuthenticated: true, user }));
        },
        logout: () => {
          set(() => ({ isAuthenticated: false, user: null }));
        },
      }),
      { name: "auth-store" }
    )
  )
);

export default useAuthStore;
