import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/zod";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  const settings = await prisma.settings.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`admin-settings:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Muitas tentativas" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const existing = await prisma.settings.findFirst();
  let socialLinks: any = null;
  if (parsed.data.socialLinks) {
    try {
      socialLinks = JSON.parse(parsed.data.socialLinks);
    } catch (error) {
      return NextResponse.json({ message: "Links sociais inválidos" }, { status: 400 });
    }
  }

  const data = {
    ...parsed.data,
    supportEmail: parsed.data.supportEmail || null,
    socialLinks
  };

  const settings = existing
    ? await prisma.settings.update({ where: { id: existing.id }, data })
    : await prisma.settings.create({ data: { storeName: parsed.data.storeName, ...data } });

  return NextResponse.json(settings);
}
