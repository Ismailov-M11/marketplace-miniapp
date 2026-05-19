import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/api/client";
import { useBackButton } from "../shared/telegram/backButton";
import { MapPin, Package } from "lucide-react";

function formatPrice(tiyins: number) {
  return `${Math.floor(tiyins / 100).toLocaleString("ru-RU")} sum`;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Yangi",
  confirmed: "Tasdiqlangan",
  preparing: "Tayyorlanmoqda",
  ready: "Tayyor",
  delivering: "Yetkazilmoqda",
  delivered: "Yetkazildi",
  cancelled: "Bekor qilingan",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-red-100 text-red-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-yellow-100 text-yellow-700",
  ready: "bg-purple-100 text-purple-700",
  delivering: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const STATUS_STEPS = ["new", "confirmed", "preparing", "ready", "delivering", "delivered"];

interface OrderDetail {
  id: number;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  delivery_fee: number;
  delivery_address?: string;
  comment?: string;
  created_at: string;
  items: Array<{ id: number; product_name: string; variant_name: string; quantity: number; price_snap: number }>;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  useBackButton();

  const { data: order, isLoading } = useQuery<OrderDetail>({
    queryKey: ["miniapp-order", id],
    queryFn: () => api.get(`/api/v1/miniapp/orders/${id}`).then((r) => r.data),
  });

  if (isLoading) {
    return <div className="min-h-screen bg-tg-secondary p-4 space-y-3">
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-tg-section rounded-2xl h-24 animate-pulse" />)}
    </div>;
  }

  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-tg-secondary pb-4">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-tg-text">Buyurtma #{order.order_number}</h1>
        <p className="text-sm text-tg-hint mt-0.5">
          {new Date(order.created_at).toLocaleString("ru-RU")}
        </p>
      </div>

      {order.status !== "cancelled" && (
        <div className="bg-tg-section mx-3 rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-1">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i <= currentStep ? "bg-tg-button text-tg-button-text" : "bg-tg-secondary text-tg-hint"
                  }`}
                >
                  {i < currentStep ? "✓" : i + 1}
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 ${i < currentStep ? "bg-tg-button" : "bg-tg-secondary"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center">
            <span className={`text-sm px-3 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>
        </div>
      )}

      {order.status === "cancelled" && (
        <div className="bg-red-50 mx-3 rounded-2xl p-4 mb-3 text-center">
          <p className="text-red-700 font-medium">Buyurtma bekor qilingan</p>
        </div>
      )}

      <div className="bg-tg-section mx-3 rounded-2xl p-4 mb-3">
        <h3 className="font-medium text-tg-text text-sm mb-3">Mahsulotlar</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-tg-secondary rounded-lg flex items-center justify-center">
                  <Package size={14} className="text-tg-hint" />
                </div>
                <div>
                  <p className="text-sm text-tg-text">{item.product_name}</p>
                  <p className="text-xs text-tg-hint">{item.variant_name} × {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-tg-text">{formatPrice(item.price_snap * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 space-y-1">
          <div className="flex justify-between text-sm text-tg-hint">
            <span>Mahsulotlar</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-tg-hint">
            <span>Yetkazish</span>
            <span>{order.delivery_fee > 0 ? formatPrice(order.delivery_fee) : "Bepul"}</span>
          </div>
          <div className="flex justify-between font-bold text-tg-text">
            <span>Jami</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {order.delivery_address && (
        <div className="bg-tg-section mx-3 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-tg-hint mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-tg-text">Yetkazish manzili</p>
              <p className="text-sm text-tg-hint mt-0.5">{order.delivery_address}</p>
              {order.comment && <p className="text-xs text-tg-hint mt-1 italic">"{order.comment}"</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
