"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SearchFilters({
  categories,
  platforms
}: {
  categories: { id: string; name: string; slug: string }[];
  platforms: string[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (value) params.set(key, String(value));
    });
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-5">
      <Input
        name="q"
        placeholder="Buscar gift cards"
        defaultValue={searchParams.get("q") ?? ""}
      />
      <Select name="category" defaultValue={searchParams.get("category") ?? ""}>
        <option value="">Categoria</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </Select>
      <Select name="platform" defaultValue={searchParams.get("platform") ?? ""}>
        <option value="">Plataforma</option>
        {platforms.map((platform) => (
          <option key={platform} value={platform}>
            {platform}
          </option>
        ))}
      </Select>
      <Select name="sort" defaultValue={searchParams.get("sort") ?? "popular"}>
        <option value="popular">Popular</option>
        <option value="price-asc">Menor preço</option>
        <option value="price-desc">Maior preço</option>
      </Select>
      <Button type="submit">Filtrar</Button>
    </form>
  );
}
