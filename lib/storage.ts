import fs from "fs";
import path from "path";

export async function saveUpload(file: File, uploadDir: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const fullPath = path.join(process.cwd(), uploadDir, filename);
  await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.promises.writeFile(fullPath, buffer);
  return `/${uploadDir}/${filename}`.replace("/public", "");
}
