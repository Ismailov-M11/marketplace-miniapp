import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { api } from "./shared/api/client";
import { useAuthStore } from "./shared/store/auth";
import { initTelegramApp, applyTheme } from "./shared/telegram/init";
import { tg } from "./shared/telegram/webapp";
import BottomNav from "./components/BottomNav";
import CatalogPage from "./pages/Catalog";
import ProductPage from "./pages/Product";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import OrdersPage from "./pages/Orders";
import OrderDetailPage from "./pages/OrderDetail";
import ProfilePage from "./pages/Profile";

function getBotId(): number | null {
  // Telegram passes startapp param as initDataUnsafe.start_param
  const startParam = tg?.initDataUnsafe.start_param;
  if (startParam && /^\d+$/.test(startParam)) return Number(startParam);
  // Fallback: URL query param ?bot_id=
  const urlParam = new URLSearchParams(window.location.search).get("bot_id");
  if (urlParam) return Number(urlParam);
  return null;
}

export default function App() {
  const { token, setToken, clear } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initTelegramApp();
    authenticate();
  }, []);

  async function authenticate() {
    const initData = tg?.initData;
    const botId = getBotId();

    if (!initData && import.meta.env.DEV) {
      try {
        const res = await api.post("/api/v1/miniapp/dev-auth", { bot_id: botId ?? 1 });
        const { jwt, seller_id, customer_id, bot_id, theme } = res.data;
        setToken(jwt, seller_id, customer_id, bot_id);
        applyTheme(theme?.primary_color);
        setReady(true);
      } catch {
        setError("Dev auth failed. Start the backend.");
      }
      return;
    }

    if (!initData || !botId) {
      setError("Open this app from Telegram.");
      return;
    }

    try {
      const res = await api.post("/api/v1/miniapp/init", { bot_id: botId, init_data: initData });
      const { jwt, seller_id, customer_id, bot_id, theme } = res.data;
      setToken(jwt, seller_id, customer_id, bot_id);
      applyTheme(theme?.primary_color);
      setReady(true);
    } catch (e: any) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        clear();
        setError("Autentifikatsiya muvaffaqiyatsiz. Iltimos qayta oching.");
      } else {
        setError("Ulanib bo'lmadi. Qayta urinib ko'ring.");
      }
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 text-center">
        <div>
          <p className="text-tg-destructive font-medium mb-3">{error}</p>
          <button
            onClick={() => { setError(null); authenticate(); }}
            className="bg-tg-button text-tg-button-text px-5 py-2 rounded-xl font-medium"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  if (!ready || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-tg-button border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
