import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/site/product-card";
import Link from "next/link";

export default async function CategoryPage({
  params
}: {
  params: { slug: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { products: true }
  });

  if (!category) {
    return (
      <div className="container py-20">
        <h1 className="text-2xl font-semibold">Categoria não encontrada</h1>
        <Link href="/" className="text-accent">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{category.name}</h1>
          <p className="text-white/70 mt-2">{category.description}</p>
        </div>
        <Link href="/" className="text-sm text-accent">Voltar para home</Link>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {category.products.map((product) => (
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
              tags: product.tags
            }}
          />
        ))}
      </div>
    </div>
  );
}
