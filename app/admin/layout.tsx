import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link href="/admin" className="text-lg font-semibold">
            Admin GiftCardPro
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="hover:text-accent">Dashboard</Link>
            <Link href="/admin/produtos" className="hover:text-accent">Produtos</Link>
            <Link href="/admin/categorias" className="hover:text-accent">Categorias</Link>
            <Link href="/admin/estoque" className="hover:text-accent">Estoque</Link>
            <Link href="/admin/pedidos" className="hover:text-accent">Pedidos</Link>
            <Link href="/admin/configuracoes" className="hover:text-accent">Configurações</Link>
          </nav>
        </div>
      </div>
      <div className="container py-10">{children}</div>
    </div>
  );
}
