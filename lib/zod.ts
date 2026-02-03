import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().int().positive(),
  imageUrl: z.string().optional(),
  platform: z.string().min(2),
  tags: z.string().optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
  categoryId: z.string().min(1)
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().optional()
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive()
      })
    )
    .min(1),
  paymentMethod: z.enum(["PIX", "LINK", "MERCADO_PAGO"])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const codeImportSchema = z.object({
  productId: z.string().min(1),
  codes: z.string().min(1)
});

export const settingsSchema = z.object({
  storeName: z.string().min(2),
  logoUrl: z.string().optional(),
  accentColor: z.string().optional(),
  whatsapp: z.string().optional(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  refundPolicy: z.string().optional(),
  terms: z.string().optional(),
  socialLinks: z.string().optional()
});
