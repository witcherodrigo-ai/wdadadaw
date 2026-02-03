const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@giftcards.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: "admin"
    }
  });

  const categories = [
    { name: "Steam", slug: "steam", description: "Gift cards Steam" },
    { name: "PlayStation", slug: "psn", description: "Créditos PSN" },
    { name: "Xbox", slug: "xbox", description: "Gift cards Xbox" },
    { name: "Google Play", slug: "google-play", description: "Saldo Google Play" }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  const steam = await prisma.category.findUnique({ where: { slug: "steam" } });
  const psn = await prisma.category.findUnique({ where: { slug: "psn" } });
  const xbox = await prisma.category.findUnique({ where: { slug: "xbox" } });
  const gp = await prisma.category.findUnique({ where: { slug: "google-play" } });

  const products = [
    {
      name: "Steam Wallet R$ 50",
      slug: "steam-50",
      description: "Adicione crédito na Steam instantaneamente.",
      price: 5000,
      platform: "Steam",
      status: "ACTIVE",
      categoryId: steam.id
    },
    {
      name: "Steam Wallet R$ 100",
      slug: "steam-100",
      description: "Compre jogos e DLCs na Steam.",
      price: 10000,
      platform: "Steam",
      status: "ACTIVE",
      categoryId: steam.id
    },
    {
      name: "PSN Card R$ 50",
      slug: "psn-50",
      description: "Créditos oficiais para PlayStation Store.",
      price: 5000,
      platform: "PSN",
      status: "ACTIVE",
      categoryId: psn.id
    },
    {
      name: "Xbox Gift Card R$ 50",
      slug: "xbox-50",
      description: "Saldo para Microsoft Store e Xbox.",
      price: 5000,
      platform: "Xbox",
      status: "ACTIVE",
      categoryId: xbox.id
    },
    {
      name: "Google Play R$ 30",
      slug: "google-play-30",
      description: "Use em apps, filmes e jogos Android.",
      price: 3000,
      platform: "Google Play",
      status: "ACTIVE",
      categoryId: gp.id
    },
    {
      name: "Google Play R$ 100",
      slug: "google-play-100",
      description: "Créditos para Google Play Store.",
      price: 10000,
      platform: "Google Play",
      status: "ACTIVE",
      categoryId: gp.id
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product
    });
  }

  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        storeName: "GiftCardPro",
        whatsapp: process.env.PAYMENT_WHATSAPP_URL || "",
        supportEmail: process.env.SMTP_FROM || ""
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
