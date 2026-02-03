export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  platform: string;
  tags?: string | null;
  category?: { name: string; slug: string };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};
