import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/api/client";
import { tg } from "../shared/telegram/webapp";
import { User, Phone, ShoppingBag, Globe } from "lucide-react";
import { useLangStore, mt } from "../shared/store/lang";

interface Profile {
  id: number;
  first_name: string;
  last_name?: string;
  phone?: string;
  orders_count: number;
  total_spent: number;
}

function formatPrice(tiyins: number) {
  return `${Math.floor(tiyins / 100).toLocaleString("ru-RU")} UZS`;
}

export default function ProfilePage() {
  const { lang, setLang } = useLangStore();
  const tgUser = tg?.initDataUnsafe.user;

  const { data: profile } = useQuery<Profile>({
    queryKey: ["miniapp-profile"],
    queryFn: () => api.get("/api/v1/miniapp/profile").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-tg-secondary">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-tg-text">{mt("profile", lang)}</h1>
        <button
          onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
          className="flex items-center gap-1.5 text-xs font-semibold bg-tg-section px-3 py-1.5 rounded-full border border-gray-200"
        >
          <Globe size={14} className="text-tg-hint" />
          <span className="text-tg-text">{lang === "uz" ? "🇺🇿 UZ" : "🇷🇺 RU"}</span>
        </button>
      </div>

      <div className="bg-tg-section mx-3 rounded-2xl p-5 mb-3">
        <div className="flex items-center gap-4">
          {tgUser?.photo_url ? (
            <img src={tgUser.photo_url} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-tg-button flex items-center justify-center">
              <User size={28} className="text-tg-button-text" />
            </div>
          )}
          <div>
            <p className="text-lg font-bold text-tg-text">
              {tgUser ? `${tgUser.first_name} ${tgUser.last_name ?? ""}`.trim() : profile?.first_name}
            </p>
            {tgUser?.username && (
              <p className="text-sm text-tg-hint">@{tgUser.username}</p>
            )}
          </div>
        </div>
      </div>

      {profile && (
        <div className="grid grid-cols-2 gap-3 mx-3 mb-3">
          <div className="bg-tg-section rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <ShoppingBag size={20} className="text-tg-button" />
            </div>
            <p className="text-2xl font-bold text-tg-text">{profile.orders_count}</p>
            <p className="text-xs text-tg-hint mt-0.5">{mt("orders", lang)}</p>
          </div>
          <div className="bg-tg-section rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <span className="text-tg-button font-bold text-lg">₸</span>
            </div>
            <p className="text-sm font-bold text-tg-text leading-tight">{formatPrice(profile.total_spent)}</p>
            <p className="text-xs text-tg-hint mt-0.5">{mt("totalSpent", lang)}</p>
          </div>
        </div>
      )}

      {profile?.phone && (
        <div className="bg-tg-section mx-3 rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-tg-hint" />
            <div>
              <p className="text-xs text-tg-hint">{mt("phoneLbl", lang)}</p>
              <p className="text-sm font-medium text-tg-text">{profile.phone}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-tg-section mx-3 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Globe size={18} className="text-tg-hint" />
          <div className="flex-1">
            <p className="text-xs text-tg-hint">{mt("language", lang)}</p>
            <p className="text-sm font-medium text-tg-text">{lang === "uz" ? "O'zbekcha" : "Русский"}</p>
          </div>
          <button
            onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
            className="text-xs font-semibold text-tg-button bg-tg-button/10 px-3 py-1.5 rounded-full"
          >
            {lang === "uz" ? "RU →" : "UZ →"}
          </button>
        </div>
      </div>
    </div>
  );
}
