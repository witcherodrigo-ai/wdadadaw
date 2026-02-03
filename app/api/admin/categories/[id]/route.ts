import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/zod";
import { rateLimit } from "@/lib/rate-limit";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`admin-categories:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Muitas tentativas" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const category = await prisma.category.update({
    where: { id: params.id },
    data: parsed.data
  });
  return NextResponse.json(category);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`admin-categories:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Muitas tentativas" }, { status: 429 });
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ status: "ok" });
}
