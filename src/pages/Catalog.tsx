import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../shared/api/client";
import { Search, Package } from "lucide-react";
import { haptic } from "../shared/telegram/haptic";

function formatPrice(tiyins: number) {
  return `${Math.floor(tiyins / 100).toLocaleString("ru-RU")} sum`;
}

interface Category {
  id: number;
  name_uz: string;
  name_ru: string;
}

interface Product {
  id: number;
  name_uz: string;
  min_price: number;
  images: Array<{ url: string }>;
  category?: { name_uz: string };
}

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["miniapp-categories"],
    queryFn: () => api.get("/api/v1/miniapp/catalog/categories").then((r) => r.data),
  });

  const { data: productsData, isLoading } = useQuery<{ items: Product[] }>({
    queryKey: ["miniapp-products", search, categoryId],
    queryFn: () =>
      api
        .get("/api/v1/miniapp/catalog/products", {
          params: { q: search || undefined, category_id: categoryId ?? undefined },
        })
        .then((r) => r.data),
  });
  const products = productsData?.items ?? [];

  return (
    <div className="min-h-screen bg-tg-secondary">
      <div className="bg-tg-section px-4 pt-4 pb-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-hint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mahsulot qidirish..."
            className="w-full bg-tg-secondary rounded-xl pl-9 pr-4 py-2.5 text-sm text-tg-text placeholder:text-tg-hint focus:outline-none"
          />
        </div>
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => { haptic.selection(); setCategoryId(null); }}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                categoryId === null ? "bg-tg-button text-tg-button-text" : "bg-tg-secondary text-tg-text"
              }`}
            >
              Barchasi
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => { haptic.selection(); setCategoryId(c.id); }}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  categoryId === c.id ? "bg-tg-button text-tg-button-text" : "bg-tg-secondary text-tg-text"
                }`}
              >
                {c.name_uz}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-tg-section rounded-2xl h-52 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={48} className="text-tg-hint mb-3" />
            <p className="text-tg-hint">Mahsulotlar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                onClick={() => haptic.light()}
                className="bg-tg-section rounded-2xl overflow-hidden active:scale-95 transition-transform"
              >
                <div className="aspect-square bg-tg-secondary">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt={p.name_uz} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={32} className="text-tg-hint" />
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-medium text-tg-text line-clamp-2 leading-tight">{p.name_uz}</p>
                  <p className="text-sm font-bold text-tg-button mt-1">{formatPrice(p.min_price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
