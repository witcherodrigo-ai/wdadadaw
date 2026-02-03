"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Button onClick={() => addItem(product)}>
      Adicionar ao carrinho
    </Button>
  );
}
