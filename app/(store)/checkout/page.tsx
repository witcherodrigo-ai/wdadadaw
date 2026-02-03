"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/store/cart-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    const response = await fetch("/api/store/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        }))
      })
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      clear();
      router.push(`/pedido/${data.orderId}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-semibold">Carrinho vazio</h1>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="glass-card p-6 space-y-4">
          <label className="text-sm text-white/70">E-mail para entrega</label>
          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seuemail@exemplo.com"
          />
          <label className="text-sm text-white/70">Forma de pagamento</label>
          <Select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <option value="PIX">Pix / Link</option>
            <option value="MERCADO_PAGO">Mercado Pago (se ativo)</option>
          </Select>
          <Button onClick={handleCheckout} disabled={loading}>
            {loading ? "Processando..." : "Finalizar pedido"}
          </Button>
        </div>
        <div className="glass-card p-6 h-fit">
          <h2 className="text-lg font-semibold">Resumo</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
