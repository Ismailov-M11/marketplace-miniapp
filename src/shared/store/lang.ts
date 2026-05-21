import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "uz" | "ru";

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "uz",
      setLang: (lang) => set({ lang }),
    }),
    { name: "miniapp-lang" }
  )
);

export const miniT = {
  catalog:    { uz: "Katalog",      ru: "Каталог" },
  cart:       { uz: "Savat",        ru: "Корзина" },
  orders:     { uz: "Buyurtmalar",  ru: "Заказы" },
  profile:    { uz: "Profil",       ru: "Профиль" },
  totalSpent: { uz: "Jami xarid",   ru: "Потрачено" },
  phoneLbl:   { uz: "Telefon",      ru: "Телефон" },
  language:   { uz: "Til",          ru: "Язык" },
} as const;

export const mt = (key: keyof typeof miniT, lang: Lang): string => miniT[key][lang];
