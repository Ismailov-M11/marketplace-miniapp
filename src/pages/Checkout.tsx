import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../shared/api/client";
import { useCartStore } from "../shared/store/cart";
import { useBackButton } from "../shared/telegram/backButton";
import { useMainButton, useMainButtonProgress } from "../shared/telegram/mainButton";
import { haptic } from "../shared/telegram/haptic";
import { MapPin, Phone } from "lucide-react";

function formatPrice(tiyins: number) {
  return `${Math.floor(tiyins / 100).toLocaleString("ru-RU")} sum`;
}

const schema = z.object({
  phone: z.string().min(9, "Telefon raqam kiriting"),
  delivery_address: z.string().min(5, "Manzil kiriting"),
  comment: z.string().optional(),
});
type CheckoutForm = z.infer<typeof schema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clear } = useCartStore();
  const [submitted, setSubmitted] = useState(false);

  useBackButton();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const orderMutation = useMutation({
    mutationFn: (form: CheckoutForm) =>
      api.post("/api/v1/miniapp/orders/direct", {
        phone: form.phone,
        delivery_address: form.delivery_address,
        comment: form.comment,
        items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
      }),
    onSuccess: (res) => {
      haptic.success();
      clear();
      setSubmitted(true);
      setTimeout(() => navigate(`/orders/${res.data.id}`), 1500);
    },
    onError: () => {
      haptic.error();
    },
  });

  useMainButton(
    "Buyurtma berish",
    handleSubmit((data) => orderMutation.mutate(data)),
    isValid && items.length > 0
  );

  useMainButtonProgress(orderMutation.isPending);

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-xl font-bold text-tg-text mb-2">Buyurtma qabul qilindi!</h2>
        <p className="text-tg-hint">Tez orada siz bilan bog'lanamiz</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tg-secondary">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-tg-text">Buyurtma berish</h1>
      </div>

      <form className="space-y-3 px-3">
        <div className="bg-tg-section rounded-2xl p-4 space-y-3">
          <h3 className="font-medium text-tg-text text-sm">Kontakt ma'lumotlar</h3>
          <div>
            <div className="flex items-center gap-2 bg-tg-secondary rounded-xl px-3 py-2.5">
              <Phone size={16} className="text-tg-hint" />
              <input
                {...register("phone")}
                type="tel"
                placeholder="+998 90 123 45 67"
                className="flex-1 bg-transparent text-sm text-tg-text placeholder:text-tg-hint focus:outline-none"
              />
            </div>
            {errors.phone && <p className="text-tg-destructive text-xs mt-1 ml-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="bg-tg-section rounded-2xl p-4 space-y-3">
          <h3 className="font-medium text-tg-text text-sm">Yetkazish manzili</h3>
          <div>
            <div className="flex items-start gap-2 bg-tg-secondary rounded-xl px-3 py-2.5">
              <MapPin size={16} className="text-tg-hint mt-0.5" />
              <textarea
                {...register("delivery_address")}
                placeholder="Ko'cha, uy, xonadon raqami..."
                rows={2}
                className="flex-1 bg-transparent text-sm text-tg-text placeholder:text-tg-hint focus:outline-none resize-none"
              />
            </div>
            {errors.delivery_address && <p className="text-tg-destructive text-xs mt-1 ml-1">{errors.delivery_address.message}</p>}
          </div>
          <textarea
            {...register("comment")}
            placeholder="Qo'shimcha izoh (ixtiyoriy)"
            rows={2}
            className="w-full bg-tg-secondary rounded-xl px-3 py-2.5 text-sm text-tg-text placeholder:text-tg-hint focus:outline-none resize-none"
          />
        </div>

        <div className="bg-tg-section rounded-2xl p-4">
          <h3 className="font-medium text-tg-text text-sm mb-3">Buyurtma tarkibi</h3>
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm py-1">
              <span className="text-tg-text">{item.productName} × {item.quantity}</span>
              <span className="text-tg-hint">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-bold text-tg-text">
            <span>Jami</span>
            <span>{formatPrice(total())}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
