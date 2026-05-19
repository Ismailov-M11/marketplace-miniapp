import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/api/client";
import { tg } from "../shared/telegram/webapp";
import { User, Phone, ShoppingBag } from "lucide-react";

interface Profile {
  id: number;
  first_name: string;
  last_name?: string;
  phone?: string;
  orders_count: number;
  total_spent: number;
}

function formatPrice(tiyins: number) {
  return `${Math.floor(tiyins / 100).toLocaleString("ru-RU")} sum`;
}

export default function ProfilePage() {
  const tgUser = tg?.initDataUnsafe.user;

  const { data: profile } = useQuery<Profile>({
    queryKey: ["miniapp-profile"],
    queryFn: () => api.get("/api/v1/miniapp/profile").then((r) => r.data),
  });

  return (
    <div className="min-h-screen bg-tg-secondary">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-tg-text">Profil</h1>
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
              {tgUser ? `${tgUser.first_name} ${tgUser.last_name ?? ""}` : profile?.first_name}
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
            <p className="text-xs text-tg-hint mt-0.5">Buyurtmalar</p>
          </div>
          <div className="bg-tg-section rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <span className="text-tg-button font-bold text-lg">₸</span>
            </div>
            <p className="text-lg font-bold text-tg-text">{formatPrice(profile.total_spent)}</p>
            <p className="text-xs text-tg-hint mt-0.5">Jami xarid</p>
          </div>
        </div>
      )}

      {profile?.phone && (
        <div className="bg-tg-section mx-3 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-tg-hint" />
            <div>
              <p className="text-xs text-tg-hint">Telefon</p>
              <p className="text-sm font-medium text-tg-text">{profile.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
