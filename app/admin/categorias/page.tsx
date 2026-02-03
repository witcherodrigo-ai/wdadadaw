"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Category = { id: string; name: string; slug: string; description?: string };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  const fetchData = async () => {
    const response = await fetch("/api/admin/categories");
    setCategories(await response.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ name: "", slug: "", description: "" });
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Categorias</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold">Nova categoria</h2>
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
            <Button onClick={handleSubmit}>Salvar categoria</Button>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold">Lista</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {categories.map((category) => (
              <li key={category.id}>
                {category.name} <span className="text-white/40">({category.slug})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
