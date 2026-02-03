import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import Link from "next/link";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } }
  });

  if (!order) {
    return (
      <div className="container py-20">
        <h1 className="text-2xl font-semibold">Pedido não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="glass-card p-8">
        <h1 className="text-3xl font-semibold">Pedido recebido</h1>
        <p className="text-white/70 mt-2">
          ID do pedido: <strong>{order.id}</strong>
        </p>
        <p className="text-white/70 mt-2">
          Status: <strong>{order.status}</strong>
        </p>
        <p className="text-white/70 mt-2">
          Data: {formatDate(order.createdAt)}
        </p>
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Itens</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.product.name} x {item.quantity}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <p className="text-white/70">
            Total: <strong>{formatCurrency(order.total)}</strong>
          </p>
          {order.status === "PENDING" && (
            <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm">
              <p>
                Pagamento pendente. {process.env.PIX_INSTRUCTIONS || "Finalize o pagamento e informe nosso time para liberar seus códigos."}
              </p>
              <Link href={process.env.PAYMENT_WHATSAPP_URL || "#"} className="text-accent">
                Falar no WhatsApp
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
