import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/zod";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      codes: { where: { status: "AVAILABLE" } }
    },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`admin-products:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Muitas tentativas" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
