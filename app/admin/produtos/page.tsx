"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  platform: string;
  status: string;
  categoryId: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    platform: "",
    status: "ACTIVE",
    categoryId: ""
  });

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories")
    ]);
    setProducts(await productsRes.json());
    setCategories(await categoriesRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price)
      })
    });
    setForm({
      name: "",
      slug: "",
      description: "",
      price: "",
      platform: "",
      status: "ACTIVE",
      categoryId: ""
    });
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Produtos</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold">Novo produto</h2>
          <div className="mt-4 space-y-3">
            <Input
              placeholder="Nome"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <Input
              placeholder="Slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
            <Textarea
              placeholder="Descrição"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
            <Input
              placeholder="Preço em centavos (ex: 1990)"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
            />
            <Input
              placeholder="Plataforma (Steam, PSN, etc)"
              value={form.platform}
              onChange={(event) => setForm({ ...form, platform: event.target.value })}
            />
            <Select
              value={form.categoryId}
              onChange={(event) =>
                setForm({ ...form, categoryId: event.target.value })
              }
            >
              <option value="">Selecione categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="DRAFT">Rascunho</option>
              <option value="ARCHIVED">Arquivado</option>
            </Select>
            <Button onClick={handleSubmit}>Salvar produto</Button>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold">Lista</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {products.map((product) => (
              <li key={product.id} className="flex justify-between">
                <span>{product.name}</span>
                <span>{formatCurrency(product.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
