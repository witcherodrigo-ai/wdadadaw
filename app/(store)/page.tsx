import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/site/product-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SearchFilters } from "@/components/site/search-filters";

export default async function HomePage({
  searchParams
}: {
  searchParams: { q?: string; category?: string; platform?: string; sort?: string };
}) {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(searchParams?.q
          ? { name: { contains: searchParams.q, mode: "insensitive" } }
          : {}),
        ...(searchParams?.platform ? { platform: searchParams.platform } : {}),
        ...(searchParams?.category
          ? { category: { slug: searchParams.category } }
          : {})
      },
      include: { category: true },
      take: 6,
      orderBy:
        searchParams?.sort === "price-asc"
          ? { price: "asc" }
          : searchParams?.sort === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" }
    })
  ]);

  const platforms = Array.from(new Set(products.map((product) => product.platform)));

  return (
    <div>
      <section className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <Badge>Loja gringa premium</Badge>
            <h1 className="mt-6 text-4xl md:text-5xl font-semibold">
              Gift cards digitais com entrega instantânea e suporte 24/7.
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Steam, PSN, Xbox, Google Play e muito mais. Compre em segundos,
              receba os códigos automaticamente.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="#produtos" className="button-primary">
                Ver destaques
              </Link>
              <Link href="/categoria/steam" className="button-secondary">
                Ver Steam
              </Link>
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold">Categorias rápidas</h3>
            <div className="mt-4 grid gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categoria/${category.slug}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-alt/60 px-4 py-3 hover:bg-surface"
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-white/60">{category.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12" id="produtos">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Destaques da semana</h2>
          <Link href="/categoria/steam" className="text-sm text-accent">
            Ver todos
          </Link>
        </div>
        <div className="mt-6 glass-card p-4">
          <SearchFilters categories={categories} platforms={platforms} />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
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
          ))}
        </div>
      </section>
    </div>
  );
}
