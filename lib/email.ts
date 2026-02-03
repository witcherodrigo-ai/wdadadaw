import nodemailer from "nodemailer";
import { formatCurrency } from "@/lib/format";

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendOrderCodesEmail({
  to,
  orderId,
  items
}: {
  to: string;
  orderId: string;
  items: Array<{ name: string; codes: string[]; instructions: string }>;
}) {
  if (!process.env.SMTP_HOST) return;
  const transporter = createTransporter();
  const html = `
    <div style="background:#0b0f19;padding:32px;color:#fff;font-family:Arial, sans-serif;">
      <h1 style="color:#6d6bff;">Seu pedido foi liberado 🎉</h1>
      <p>Pedido <strong>${orderId}</strong> confirmado. Aqui estão seus códigos:</p>
      ${items
        .map(
          (item) => `
          <div style="margin:24px 0;padding:16px;background:#121826;border-radius:12px;">
            <h2 style="margin:0 0 8px 0;">${item.name}</h2>
            <p style="margin:0 0 12px 0;">${item.instructions}</p>
            <ul>
              ${item.codes.map((code) => `<li><code>${code}</code></li>`).join("")}
            </ul>
          </div>
        `
        )
        .join("")}
      <p>Se precisar de ajuda, responda este e-mail.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Seus gift cards foram entregues",
    html
  });
}

export function buildOrderSummary(total: number) {
  return `Total: ${formatCurrency(total)}`;
}
