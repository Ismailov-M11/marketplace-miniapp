import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../shared/api/client";
import { ClipboardList, ChevronRight } from "lucide-react";

function formatPrice(tiyins: number) {
  return `${Math.floor(tiyins / 100).toLocaleString("ru-RU")} sum`;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-red-100 text-red-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-yellow-100 text-yellow-700",
  ready: "bg-purple-100 text-purple-700",
  delivering: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Yangi",
  confirmed: "Tasdiqlangan",
  preparing: "Tayyorlanmoqda",
  ready: "Tayyor",
  delivering: "Yetkazilmoqda",
  delivered: "Yetkazildi",
  cancelled: "Bekor",
};

interface Order {
  id: number;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  items_count: number;
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["miniapp-orders"],
    queryFn: () => api.get("/api/v1/miniapp/orders").then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tg-secondary p-3 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-tg-section rounded-2xl h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tg-secondary">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-tg-text">Buyurtmalarim</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <ClipboardList size={64} className="text-tg-hint mb-4" />
          <h2 className="text-lg font-bold text-tg-text mb-2">Buyurtmalar yo'q</h2>
          <p className="text-tg-hint text-sm">Katalogdan birinchi buyurtmangizni bering</p>
        </div>
      ) : (
        <div className="space-y-2 px-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-tg-section rounded-2xl p-4 active:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-tg-text">#{order.order_number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-xs text-tg-hint">{order.items_count} mahsulot · {formatPrice(order.total)}</p>
                  <p className="text-xs text-tg-hint mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("ru-RU", { day: "2-digit", month: "long" })}
                  </p>
                </div>
                <ChevronRight size={16} className="text-tg-hint" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
