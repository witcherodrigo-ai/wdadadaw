import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deliverOrderCodes } from "@/lib/orders";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`admin-orders:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Muitas tentativas" }, { status: 429 });
  }

  await prisma.order.update({
    where: { id: params.id },
    data: { status: "PAID" }
  });

  try {
    const order = await deliverOrderCodes(params.id);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
