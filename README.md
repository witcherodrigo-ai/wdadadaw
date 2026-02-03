# GiftCardPro - Loja de Gift Cards Digitais

Aplicação completa de e-commerce para venda de gift cards digitais com tema escuro premium, painel admin e entrega automática de códigos.

## Requisitos
- Node.js 20+
- Docker + Docker Compose (opcional)
- SQLite (dev) ou Postgres (produção via schema alternativo)

## Instalação local
```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run dev
```
Acesse: `http://localhost:3000`

## Docker Compose
```bash
docker compose up --build
```
Acesse: `http://localhost:3000`

## Prisma Migrate / Seed
- SQLite (padrão):
```bash
npm run prisma:migrate
npm run prisma:seed
```

- Postgres (schema alternativo):
```bash
npx prisma migrate dev --schema prisma/schema.postgres.prisma
npx prisma db seed --schema prisma/schema.postgres.prisma
```

## SMTP (Nodemailer)
Configure no `.env`:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Mercado Pago (opcional)
- Configure `MP_ACCESS_TOKEN` e `MP_WEBHOOK_SECRET` no `.env`.
- Webhook: `POST /api/store/mercado-pago` com header `x-webhook-secret`.
- O payload deve conter `data.order_id` ou `orderId`.

## Upload de imagens
- Upload local no endpoint `/api/admin/upload`
- Arquivos salvos em `public/uploads`

## Admin
- Login em `/admin/login`
- Credenciais padrão (via seed):
  - Email: `ADMIN_EMAIL`
  - Senha: `ADMIN_PASSWORD`

## Deploy em VPS com Nginx (exemplo)
1. Suba a aplicação via Docker Compose.
2. Configure Nginx como reverse proxy:
```
server {
  listen 80;
  server_name seu-dominio.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Observações
- Para entrega automática de códigos, o admin deve marcar o pedido como pago no painel.
- O sistema reserva e entrega N códigos conforme a quantidade comprada.
