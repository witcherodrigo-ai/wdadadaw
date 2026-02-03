import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/zod";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`checkout:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Muitas tentativas" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const items = await prisma.product.findMany({
    where: { id: { in: parsed.data.items.map((item) => item.productId) } }
  });

  if (items.length === 0) {
    return NextResponse.json({ message: "Produtos inválidos" }, { status: 400 });
  }

  const total = parsed.data.items.reduce((acc, item) => {
    const product = items.find((p) => p.id === item.productId);
    if (!product) return acc;
    return acc + product.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      email: parsed.data.email,
      paymentMethod: parsed.data.paymentMethod,
      total,
      items: {
        create: parsed.data.items.map((item) => {
          const product = items.find((p) => p.id === item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product?.price ?? 0
          };
        })
      }
    }
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
