import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deliverOrderCodes } from "@/lib/orders";

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (process.env.MP_WEBHOOK_SECRET && secret !== process.env.MP_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const orderId = body?.data?.order_id || body?.orderId;

  if (!orderId) {
    return NextResponse.json({ message: "Order ID missing" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" }
  });

  await deliverOrderCodes(orderId);
  return NextResponse.json({ status: "ok" });
}
