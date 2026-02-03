"use client";

import Link from "next/link";
import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-semibold">Seu carrinho está vazio</h1>
        <p className="text-white/70 mt-2">Adicione um gift card para continuar.</p>
        <Link href="/" className="button-primary mt-6 inline-block">
          Voltar para home
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-semibold">Carrinho</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="glass-card p-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-border py-4">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-white/60">{item.platform}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.id, Number(event.target.value))
                  }
                  className="input-field w-20"
                />
                <span className="text-accent font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-400"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card p-6 h-fit">
          <h2 className="text-lg font-semibold">Resumo</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-white/70">
            <span>Total</span>
            <span className="text-white font-semibold">{formatCurrency(total)}</span>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full">Ir para checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
