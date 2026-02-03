import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="glass-card p-5 transition hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <Badge>Entrega rápida</Badge>
        <span className="text-xs text-white/60">{product.platform}</span>
      </div>
      <Link href={`/produto/${product.slug}`} className="block mt-4 text-lg font-semibold">
        {product.name}
      </Link>
      <p className="text-sm text-white/60 mt-2 line-clamp-2">{product.description}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xl font-semibold text-accent">{formatCurrency(product.price)}</span>
        <span className="text-xs text-white/50">Estoque imediato</span>
      </div>
    </div>
  );
}
