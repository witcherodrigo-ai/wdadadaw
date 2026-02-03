import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { codeImportSchema } from "@/lib/zod";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`admin-codes:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Muitas tentativas" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = codeImportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const codes = parsed.data.codes
    .split(/\r?\n|,|;/)
    .map((code) => code.trim())
    .filter(Boolean);

  const uniqueCodes = Array.from(new Set(codes));

  const existing = await prisma.productCode.findMany({
    where: { code: { in: uniqueCodes } },
    select: { code: true }
  });

  const existingCodes = new Set(existing.map((entry) => entry.code));

  const newCodes = uniqueCodes.filter((code) => !existingCodes.has(code));

  if (newCodes.length === 0) {
    return NextResponse.json({ added: 0, skipped: uniqueCodes.length });
  }

  await prisma.productCode.createMany({
    data: newCodes.map((code) => ({ code, productId: parsed.data.productId }))
  });

  return NextResponse.json({ added: newCodes.length, skipped: uniqueCodes.length - newCodes.length });
}
