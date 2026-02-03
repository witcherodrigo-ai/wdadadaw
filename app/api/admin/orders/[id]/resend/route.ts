import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderCodesEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`admin-orders:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Muitas tentativas" }, { status: 429 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
          codes: true
        }
      }
    }
  });

  if (!order) {
    return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
  }

  await sendOrderCodesEmail({
    to: order.email,
    orderId: order.id,
    items: order.items.map((item) => ({
      name: item.product.name,
      codes: item.codes.map((code) => code.code),
      instructions: `Resgate em ${item.product.platform}.`
    }))
  });

  return NextResponse.json({ status: "ok" });
}
