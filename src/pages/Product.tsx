import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/api/client";
import { useCartStore } from "../shared/store/cart";
import { useMainButton } from "../shared/telegram/mainButton";
import { useBackButton } from "../shared/telegram/backButton";
import { haptic } from "../shared/telegram/haptic";
import { tg } from "../shared/telegram/webapp";
import { Package, CheckCircle2 } from "lucide-react";

function formatPrice(tiyins: number) {
  return `${Math.floor(tiyins / 100).toLocaleString("ru-RU")} sum`;
}

interface ProductVariant {
  id: number;
  name_uz?: string | null;
  name_ru?: string | null;
  price: number;
  old_price?: number | null;
  stock_quantity: number;
  is_active: boolean;
}

interface ProductDetail {
  id: number;
  name_uz: string;
  name_ru?: string;
  description_uz?: string;
  category?: { name_uz: string };
  images: Array<{ id: number; url: string }>;
  variants: ProductVariant[];
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [added, setAdded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const { data: product, isLoading } = useQuery<ProductDetail>({
    queryKey: ["miniapp-product", id],
    queryFn: () => api.get(`/api/v1/miniapp/catalog/products/${id}`).then((r) => r.data),
  });

  useEffect(() => {
    if (product?.variants.length && !selectedVariant) {
      const def = product.variants.find((v) => v.is_active) ?? product.variants[0];
      setSelectedVariant(def);
    }
  }, [product]);

  useBackButton();

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name_uz,
      variantName: selectedVariant.name_uz || selectedVariant.name_ru || "",
      price: selectedVariant.price,
      imageUrl: product.images[0]?.url,
    });
    haptic.success();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    tg?.showAlert("Savatga qo'shildi! 🛒");
  };

  useMainButton(
    added ? "Qo'shildi ✓" : `Savatga qo'shish — ${selectedVariant ? formatPrice(selectedVariant.price) : ""}`,
    handleAddToCart,
    !!selectedVariant && (selectedVariant.stock_quantity > 0)
  );

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-square bg-tg-secondary" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-tg-secondary rounded-lg w-3/4" />
          <div className="h-4 bg-tg-secondary rounded-lg w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-tg-bg">
      <div className="relative aspect-square bg-tg-secondary">
        {product.images.length > 0 ? (
          <>
            <img
              src={product.images[imgIdx].url}
              alt={product.name_uz}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? "bg-tg-button" : "bg-white/60"}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={64} className="text-tg-hint" />
          </div>
        )}
      </div>

      <div className="p-4">
        {product.category && (
          <p className="text-xs text-tg-hint mb-1">{product.category.name_uz}</p>
        )}
        <h1 className="text-xl font-bold text-tg-text">{product.name_uz}</h1>
        {product.name_ru && <p className="text-sm text-tg-hint">{product.name_ru}</p>}

        {product.description_uz && (
          <p className="text-sm text-tg-text mt-3 leading-relaxed">{product.description_uz}</p>
        )}

        {product.variants.length > 1 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-tg-hint mb-2">Variant tanlash</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.filter((v) => v.is_active).map((v) => (
                <button
                  key={v.id}
                  onClick={() => { haptic.selection(); setSelectedVariant(v); }}
                  disabled={v.stock_quantity === 0}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    selectedVariant?.id === v.id
                      ? "bg-tg-button text-tg-button-text border-tg-button"
                      : v.stock_quantity === 0
                      ? "bg-tg-secondary text-tg-hint border-transparent line-through"
                      : "bg-tg-section text-tg-text border-gray-200"
                  }`}
                >
                  {v.name_uz || v.name_ru || "Variant"} — {formatPrice(v.price)}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedVariant && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-tg-button">{formatPrice(selectedVariant.price)}</div>
            {selectedVariant.stock_quantity > 0 ? (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle2 size={14} />
                <span>Mavjud: {selectedVariant.stock_quantity}</span>
              </div>
            ) : (
              <div className="text-tg-destructive text-sm">Tugagan</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
