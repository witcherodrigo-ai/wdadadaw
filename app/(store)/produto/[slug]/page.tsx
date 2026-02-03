import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { AddToCart } from "@/components/site/add-to-cart";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function ProductPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true }
  });

  if (!product) {
    return (
      <div className="container py-20">
        <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
        <Link href="/" className="text-accent">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card p-8">
          <Badge>Entrega imediata</Badge>
          <h1 className="mt-4 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-white/70">{product.description}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <span className="rounded-full border border-border px-4 py-2 text-sm">
              Plataforma: {product.platform}
            </span>
            {product.category && (
              <span className="rounded-full border border-border px-4 py-2 text-sm">
                Categoria: {product.category.name}
              </span>
            )}
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-semibold">Como resgatar</h3>
            <ol className="mt-3 space-y-2 text-sm text-white/70">
              <li>1. Acesse sua conta {product.platform}.</li>
              <li>2. Vá em "Resgatar código".</li>
              <li>3. Insira o código entregue por e-mail.</li>
            </ol>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold">FAQ</h3>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>Entrega automática após confirmação do pagamento.</p>
              <p>Suporte via WhatsApp 24h.</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-8 h-fit">
          <p className="text-sm text-white/60">Preço</p>
          <p className="text-3xl font-semibold text-accent mt-2">
            {formatCurrency(product.price)}
          </p>
          <div className="mt-6">
            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl,
                platform: product.platform,
                tags: product.tags,
                category: product.category
              }}
            />
          </div>
          <div className="mt-8 text-sm text-white/70">
            <p>Entrega em minutos via e-mail.</p>
            <p>Pagamento via Pix, link ou Mercado Pago.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
