import { useNavigate } from "react-router-dom";
import { useCartStore } from "../shared/store/cart";
import { useMainButton } from "../shared/telegram/mainButton";
import { haptic } from "../shared/telegram/haptic";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

function formatPrice(tiyins: number) {
  return `${Math.floor(tiyins / 100).toLocaleString("ru-RU")} sum`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, total, count } = useCartStore();

  useMainButton(
    `Buyurtma berish — ${formatPrice(total())}`,
    () => { haptic.medium(); navigate("/checkout"); },
    count() > 0
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-tg-secondary flex flex-col items-center justify-center text-center p-6">
        <ShoppingCart size={64} className="text-tg-hint mb-4" />
        <h2 className="text-xl font-bold text-tg-text mb-2">Savat bo'sh</h2>
        <p className="text-tg-hint mb-6">Katalogdan mahsulot qo'shing</p>
        <button
          onClick={() => navigate("/catalog")}
          className="bg-tg-button text-tg-button-text px-6 py-3 rounded-xl font-medium"
        >
          Katalogga o'tish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tg-secondary pb-4">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-tg-text">Savat</h1>
        <p className="text-sm text-tg-hint">{count()} mahsulot</p>
      </div>

      <div className="space-y-2 px-3">
        {items.map((item) => (
          <div key={item.variantId} className="bg-tg-section rounded-2xl p-3 flex gap-3">
            <div className="w-16 h-16 bg-tg-secondary rounded-xl overflow-hidden flex-shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart size={20} className="text-tg-hint" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-tg-text truncate">{item.productName}</p>
              <p className="text-xs text-tg-hint">{item.variantName}</p>
              <p className="text-sm font-bold text-tg-button mt-0.5">{formatPrice(item.price)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => { haptic.light(); removeItem(item.variantId); }}
                className="text-tg-hint active:text-tg-destructive"
              >
                <Trash2 size={14} />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { haptic.selection(); updateQty(item.variantId, item.quantity - 1); }}
                  className="w-7 h-7 bg-tg-secondary rounded-lg flex items-center justify-center text-tg-text active:bg-tg-hint"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold text-tg-text w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => { haptic.selection(); updateQty(item.variantId, item.quantity + 1); }}
                  className="w-7 h-7 bg-tg-button rounded-lg flex items-center justify-center text-tg-button-text active:opacity-80"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-3 mt-4 bg-tg-section rounded-2xl p-4">
        <div className="flex justify-between text-sm text-tg-hint mb-1">
          <span>{count()} ta mahsulot</span>
          <span>{formatPrice(total())}</span>
        </div>
        <div className="flex justify-between font-bold text-tg-text">
          <span>Jami</span>
          <span>{formatPrice(total())}</span>
        </div>
      </div>
    </div>
  );
}
