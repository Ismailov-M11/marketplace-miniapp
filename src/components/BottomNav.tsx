import { NavLink } from "react-router-dom";
import { Grid3x3, ShoppingCart, ClipboardList, User } from "lucide-react";
import { useCartStore } from "../shared/store/cart";

const tabs = [
  { to: "/catalog", icon: Grid3x3, label: "Katalog" },
  { to: "/cart", icon: ShoppingCart, label: "Savat" },
  { to: "/orders", icon: ClipboardList, label: "Buyurtmalar" },
  { to: "/profile", icon: User, label: "Profil" },
];

export default function BottomNav() {
  const count = useCartStore((s) => s.count());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-tg-section border-t border-gray-200 safe-area-bottom">
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${
                isActive ? "text-tg-button" : "text-tg-hint"
              }`
            }
          >
            <div className="relative">
              <Icon size={22} />
              {to === "/cart" && count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-tg-destructive text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
