"use client";

import { useEffect, useState } from "react";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Product = { id: string; name: string };

type StockInfo = { id: string; name: string; stock: number };

export default function AdminStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<StockInfo[]>([]);
  const [productId, setProductId] = useState("");
  const [codes, setCodes] = useState("");
  const [result, setResult] = useState("");

  const loadData = async () => {
    const productsRes = await fetch("/api/admin/products");
    const productData = await productsRes.json();
    setProducts(productData);
    setStock(
      productData.map((product: any) => ({
        id: product.id,
        name: product.name,
        stock: product.codes?.length ?? 0
      }))
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImport = async () => {
    const response = await fetch("/api/admin/codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, codes })
    });
    const data = await response.json();
    setResult(`Adicionados: ${data.added}, Ignorados: ${data.skipped}`);
    setCodes("");
    loadData();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Estoque de códigos</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold">Importar códigos</h2>
          <div className="mt-4 space-y-3">
            <Select value={productId} onChange={(event) => setProductId(event.target.value)}>
              <option value="">Selecione o produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </Select>
            <Textarea
              placeholder="Cole códigos (1 por linha ou separado por vírgula)"
              value={codes}
              onChange={(event) => setCodes(event.target.value)}
            />
            <Button onClick={handleImport} disabled={!productId || !codes}>
              Importar
            </Button>
            {result && <p className="text-sm text-accent">{result}</p>}
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold">Estoque atual</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {stock.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.stock} códigos</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
