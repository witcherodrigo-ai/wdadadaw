"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";

type Order = {
  id: string;
  email: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; product: { name: string }; quantity: number }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const response = await fetch("/api/admin/orders");
    setOrders(await response.json());
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markPaid = async (id: string) => {
    await fetch(`/api/admin/orders/${id}/pay`, { method: "POST" });
    fetchOrders();
  };

  const resend = async (id: string) => {
    await fetch(`/api/admin/orders/${id}/resend`, { method: "POST" });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Pedidos</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="glass-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Pedido {order.id}</p>
                <p className="text-sm text-white/70">{order.email}</p>
                <p className="text-sm text-white/50">{formatDate(new Date(order.createdAt))}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">Status</p>
                <p className="text-accent font-semibold">{order.status}</p>
                <p className="text-sm text-white/70">{formatCurrency(order.total)}</p>
              </div>
            </div>
            <ul className="mt-4 text-sm text-white/70">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} x {item.quantity}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => markPaid(order.id)} variant="secondary">
                Marcar como pago
              </Button>
              <Button onClick={() => resend(order.id)} variant="outline">
                Reenviar e-mail
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
