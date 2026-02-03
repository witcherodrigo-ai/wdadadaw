import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`admin-upload:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: "Muitas tentativas" }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "Arquivo inválido" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Apenas imagens são permitidas" }, { status: 400 });
  }

  const url = await saveUpload(file, process.env.UPLOAD_DIR || "public/uploads");
  return NextResponse.json({ url });
}
