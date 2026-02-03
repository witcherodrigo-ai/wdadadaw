import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";

function getDateRange(days: number) {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - days);
  return past;
}

export default async function AdminDashboard() {
  const [todayOrders, weekOrders, monthOrders, lowStock] = await Promise.all([
    prisma.order.count({
      where: { createdAt: { gte: getDateRange(1) } }
    }),
    prisma.order.count({
      where: { createdAt: { gte: getDateRange(7) } }
    }),
    prisma.order.count({
      where: { createdAt: { gte: getDateRange(30) } }
    }),
    prisma.product.findMany({
      include: {
        codes: { where: { status: "AVAILABLE" } }
      }
    })
  ]);

  const revenue = await prisma.order.aggregate({
    where: { status: { in: ["PAID", "FULFILLED"] } },
    _sum: { total: true }
  });

  const ticketsAvg = await prisma.order.aggregate({
    _avg: { total: true }
  });

  const lowStockItems = lowStock
    .map((product) => ({
      name: product.name,
      stock: product.codes.length
    }))
    .filter((item) => item.stock < 5);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-6">
          <p className="text-sm text-white/60">Pedidos hoje</p>
          <p className="text-2xl font-semibold mt-2">{todayOrders}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-white/60">Pedidos 7 dias</p>
          <p className="text-2xl font-semibold mt-2">{weekOrders}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-white/60">Pedidos 30 dias</p>
          <p className="text-2xl font-semibold mt-2">{monthOrders}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-white/60">Receita total</p>
          <p className="text-2xl font-semibold mt-2">
            {formatCurrency(revenue._sum.total ?? 0)}
          </p>
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold">Ticket médio</h2>
          <p className="text-2xl font-semibold mt-2">
            {formatCurrency(Math.round(ticketsAvg._avg.total ?? 0))}
          </p>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold">Estoque baixo</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {lowStockItems.length === 0 && <li>Sem alertas no momento.</li>}
            {lowStockItems.map((item) => (
              <li key={item.name}>
                {item.name}: {item.stock} códigos
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
