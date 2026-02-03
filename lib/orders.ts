import { prisma } from "@/lib/prisma";
import { sendOrderCodesEmail } from "@/lib/email";

export async function deliverOrderCodes(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) throw new Error("Pedido não encontrado");

  const deliveries = [] as Array<{
    orderItemId: string;
    productCodeId: string;
  }>;

  for (const item of order.items) {
    const availableCodes = await prisma.productCode.findMany({
      where: {
        productId: item.productId,
        status: "AVAILABLE"
      },
      take: item.quantity
    });

    if (availableCodes.length < item.quantity) {
      throw new Error(`Estoque insuficiente para ${item.product.name}`);
    }

    for (const code of availableCodes) {
      deliveries.push({ orderItemId: item.id, productCodeId: code.id });
    }

    await prisma.productCode.updateMany({
      where: { id: { in: availableCodes.map((code) => code.id) } },
      data: { status: "DELIVERED", orderItemId: item.id }
    });
  }

  await prisma.deliveryLog.createMany({
    data: deliveries.map((entry) => ({
      orderId,
      orderItemId: entry.orderItemId,
      productCodeId: entry.productCodeId
    }))
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "FULFILLED" }
  });

  const deliveryItems = await prisma.orderItem.findMany({
    where: { orderId },
    include: {
      product: true,
      codes: true
    }
  });

  await sendOrderCodesEmail({
    to: order.email,
    orderId,
    items: deliveryItems.map((item) => ({
      name: item.product.name,
      codes: item.codes.map((code) => code.code),
      instructions: `Resgate em ${item.product.platform}.`
    }))
  });

  return order;
}
