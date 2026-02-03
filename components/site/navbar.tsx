"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const { items } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link href="/" className="text-xl font-semibold">
          GiftCard<span className="text-accent">Pro</span>
        </Link>
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg">
          <Search className="h-4 w-4 text-white/60" />
          <Input placeholder="Buscar gift cards" />
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/categoria/steam" className="hover:text-accent">Steam</Link>
          <Link href="/categoria/psn" className="hover:text-accent">PSN</Link>
          <Link href="/categoria/xbox" className="hover:text-accent">Xbox</Link>
          <Link href="/carrinho" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-accent text-white rounded-full px-1">
                {items.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
