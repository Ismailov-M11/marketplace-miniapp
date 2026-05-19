import { create } from "zustand";

export interface CartItem {
  variantId: number;
  productId: number;
  productName: string;
  variantName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: number) => void;
  updateQty: (variantId: number, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  addItem: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.variantId === item.variantId);
      if (existing) {
        return { items: s.items.map((i) => i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { items: [...s.items, { ...item, quantity: 1 }] };
    }),
  removeItem: (variantId) => set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
  updateQty: (variantId, qty) =>
    set((s) => ({
      items: qty <= 0
        ? s.items.filter((i) => i.variantId !== variantId)
        : s.items.map((i) => i.variantId === variantId ? { ...i, quantity: qty } : i),
    })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
  count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
}));
